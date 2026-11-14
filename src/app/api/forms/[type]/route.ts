import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";
import {
  CAREER_SELECT_VALUES,
  hasValidCvSignature,
  isLettersOnly,
  isLinkedInProfileUrl,
  isSaudiMobile,
  isValidFullName,
  validateCvFile,
} from "@/lib/careerFormValidation";
import {
  PARTNERSHIP_SELECT_VALUES,
  hasValidPartnershipAttachmentSignature,
  isBusinessWebsiteUrl,
  isMeaningfulLongText,
  isSaudiMobile as isPartnershipSaudiMobile,
  isValidCompanyName,
  isValidPartnershipFullName,
  isValidPartnershipJobTitle,
  validatePartnershipAttachment,
} from "@/lib/partnershipFormValidation";
import {
  CONTACT_SELECT_VALUES,
  hasValidContactAttachmentSignature,
  isMeaningfulContactMessage,
  isSaudiMobile as isContactSaudiMobile,
  isValidContactCompanyName,
  isValidContactFullName,
  isValidContactSubject,
  validateContactAttachment,
} from "@/lib/contactFormValidation";

const allowed = new Set(["partnership", "careers", "contact"]);
const attempts = new Map<string, {count: number; reset: number}>();
const RATE_LIMIT = 8; // submissions per client per minute
const MAX_TRACKED_CLIENTS = 5_000;
// One attachment (max 5 MB) plus the text fields; anything larger is rejected before the body is read.
const MAX_REQUEST_BYTES = 6 * 1024 * 1024;

/**
 * Client address for rate limiting. nginx sets X-Real-IP and *appends* the real address to
 * X-Forwarded-For, so the first X-Forwarded-For entry can be forged by the sender; use the last one.
 */
function clientAddress(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").map(part => part.trim()).filter(Boolean);
  return forwarded?.at(-1) || "local";
}

function pruneAttempts(now: number) {
  if (attempts.size < MAX_TRACKED_CLIENTS) return;
  for (const [key, slot] of attempts) if (slot.reset <= now) attempts.delete(key);
  // Still full (e.g. a flood of distinct addresses): drop the oldest entries.
  for (const key of attempts.keys()) {
    if (attempts.size < MAX_TRACKED_CLIENTS) break;
    attempts.delete(key);
  }
}
const careerSchema = z.object({
  fullName: z.string().trim().min(1).max(120).refine(isValidFullName),
  email: z.string().trim().min(1).max(254).email(),
  phone: z.string().trim().refine(isSaudiMobile),
  nationality: z.string().trim().min(1).max(80).refine(isLettersOnly),
  currentCity: z.string().trim().refine((entry) => CAREER_SELECT_VALUES.currentCity.has(entry)),
  areaOfInterest: z
    .string()
    .trim()
    .refine((entry) => CAREER_SELECT_VALUES.areaOfInterest.has(entry)),
  yearsOfExperience: z
    .string()
    .trim()
    .refine((entry) => CAREER_SELECT_VALUES.yearsOfExperience.has(entry)),
  highestQualification: z
    .string()
    .trim()
    .refine((entry) => CAREER_SELECT_VALUES.highestQualification.has(entry)),
  jobTitle: z.string().trim().min(1).max(120).refine(isLettersOnly),
  linkedInProfile: z.string().trim().min(1).max(500).refine(isLinkedInProfileUrl),
  additionalMessage: z.string().trim().min(3).max(5000),
  consent: z.literal("true"),
});

const partnershipSchema = z.object({
  fullName: z.string().trim().min(1).max(120).refine(isValidPartnershipFullName),
  companyName: z.string().trim().min(1).max(160).refine(isValidCompanyName),
  jobTitle: z.string().trim().min(1).max(120).refine(isValidPartnershipJobTitle),
  businessEmail: z.string().trim().min(1).max(254).email(),
  phone: z.string().trim().refine(isPartnershipSaudiMobile),
  country: z.string().trim().refine((entry) => PARTNERSHIP_SELECT_VALUES.country.has(entry)),
  city: z.string().trim().refine((entry) => PARTNERSHIP_SELECT_VALUES.city.has(entry)),
  natureOfBusiness: z
    .string()
    .trim()
    .refine((entry) => PARTNERSHIP_SELECT_VALUES.natureOfBusiness.has(entry)),
  partnershipType: z
    .string()
    .trim()
    .refine((entry) => PARTNERSHIP_SELECT_VALUES.partnershipType.has(entry)),
  productCategory: z
    .string()
    .trim()
    .refine((entry) => PARTNERSHIP_SELECT_VALUES.productCategory.has(entry)),
  marketsServed: z
    .string()
    .trim()
    .refine((entry) => PARTNERSHIP_SELECT_VALUES.marketsServed.has(entry)),
  companyWebsite: z.string().trim().min(1).max(500).refine(isBusinessWebsiteUrl),
  estimatedRequirement: z
    .string()
    .trim()
    .min(1)
    .max(1000)
    .refine((entry) => isMeaningfulLongText(entry, 3)),
  message: z
    .string()
    .trim()
    .min(1)
    .max(5000)
    .refine((entry) => isMeaningfulLongText(entry, 3)),
  consent: z.literal("true"),
});

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(120).refine(isValidContactFullName),
  companyName: z.string().trim().min(1).max(160).refine(isValidContactCompanyName),
  email: z.string().trim().min(1).max(254).email(),
  phone: z.string().trim().refine(isContactSaudiMobile),
  country: z.string().trim().refine((entry) => CONTACT_SELECT_VALUES.country.has(entry)),
  city: z.string().trim().refine((entry) => CONTACT_SELECT_VALUES.city.has(entry)),
  enquiryType: z.string().trim().refine((entry) => CONTACT_SELECT_VALUES.enquiryType.has(entry)),
  subject: z.string().trim().min(1).max(200).refine(isValidContactSubject),
  message: z
    .string()
    .trim()
    .min(1)
    .max(5000)
    .refine((entry) => isMeaningfulContactMessage(entry, 3)),
  consent: z.literal("true"),
});

function text(data: FormData, key: string): string {
  const entry = data.get(key);
  return typeof entry === "string" ? entry : "";
}

async function validateCareerSubmission(data: FormData) {
  const parsed = careerSchema.safeParse({
    fullName: text(data, "fullName"),
    email: text(data, "email"),
    phone: text(data, "phone"),
    nationality: text(data, "nationality"),
    currentCity: text(data, "currentCity"),
    areaOfInterest: text(data, "areaOfInterest"),
    yearsOfExperience: text(data, "yearsOfExperience"),
    highestQualification: text(data, "highestQualification"),
    jobTitle: text(data, "jobTitle"),
    linkedInProfile: text(data, "linkedInProfile"),
    additionalMessage: text(data, "additionalMessage"),
    consent: text(data, "consent"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {ok: false, message: "Career application validation failed", issues: parsed.error.flatten()},
      {status: 400},
    );
  }

  const cv = data.get("cv");
  if (!(cv instanceof File)) {
    return NextResponse.json({ok: false, message: "CV is required"}, {status: 400});
  }

  const cvResult = validateCvFile(cv);
  if (!cvResult.ok) {
    return NextResponse.json(
      {ok: false, message: cvResult.reason === "size" ? "CV exceeds 5 MB" : "Invalid CV format"},
      {status: 400},
    );
  }

  if (!(await hasValidCvSignature(cv))) {
    return NextResponse.json({ok: false, message: "CV file content is invalid"}, {status: 400});
  }

  return null;
}

async function validatePartnershipSubmission(data: FormData) {
  const parsed = partnershipSchema.safeParse({
    fullName: text(data, "fullName"),
    companyName: text(data, "companyName"),
    jobTitle: text(data, "jobTitle"),
    businessEmail: text(data, "businessEmail"),
    phone: text(data, "phone"),
    country: text(data, "country"),
    city: text(data, "city"),
    companyWebsite: text(data, "companyWebsite"),
    natureOfBusiness: text(data, "natureOfBusiness"),
    partnershipType: text(data, "partnershipType"),
    productCategory: text(data, "productCategory"),
    marketsServed: text(data, "marketsServed"),
    estimatedRequirement: text(data, "estimatedRequirement"),
    message: text(data, "message"),
    consent: text(data, "consent"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {ok: false, message: "Partnership enquiry validation failed", issues: parsed.error.flatten()},
      {status: 400},
    );
  }

  const attachment = data.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    const attachmentResult = validatePartnershipAttachment(attachment, false);
    if (!attachmentResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: attachmentResult.reason === "size" ? "Attachment exceeds 5 MB" : "Invalid attachment format",
        },
        {status: 400},
      );
    }

    if (!(await hasValidPartnershipAttachmentSignature(attachment))) {
      return NextResponse.json({ok: false, message: "Attachment file content is invalid"}, {status: 400});
    }
  }

  return null;
}

async function validateContactSubmission(data: FormData) {
  const parsed = contactSchema.safeParse({
    fullName: text(data, "fullName"),
    companyName: text(data, "companyName"),
    email: text(data, "email"),
    phone: text(data, "phone"),
    country: text(data, "country"),
    city: text(data, "city"),
    enquiryType: text(data, "enquiryType"),
    subject: text(data, "subject"),
    message: text(data, "message"),
    consent: text(data, "consent"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      {ok: false, message: "Contact enquiry validation failed", issues: parsed.error.flatten()},
      {status: 400},
    );
  }

  const attachment = data.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    const attachmentResult = validateContactAttachment(attachment, false);
    if (!attachmentResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: attachmentResult.reason === "size" ? "Attachment exceeds 5 MB" : "Invalid attachment format",
        },
        {status: 400},
      );
    }

    if (!(await hasValidContactAttachmentSignature(attachment))) {
      return NextResponse.json({ok: false, message: "Attachment file content is invalid"}, {status: 400});
    }
  }

  return null;
}

export async function POST(
  request: NextRequest,
  {params}: {params: Promise<{type: string}>},
) {
  const {type} = await params;
  if (!allowed.has(type)) {
    return NextResponse.json({ok: false, message: "Unknown form"}, {status: 404});
  }

  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > MAX_REQUEST_BYTES) {
    return NextResponse.json({ok: false, message: "Submission is too large"}, {status: 413});
  }

  const ip = clientAddress(request);
  const now = Date.now();
  pruneAttempts(now);
  const slot = attempts.get(ip);
  if (slot && slot.reset > now && slot.count >= RATE_LIMIT) {
    return NextResponse.json({ok: false, message: "Too many requests"}, {status: 429});
  }
  attempts.set(
    ip,
    !slot || slot.reset <= now
      ? {count: 1, reset: now + 60_000}
      : {count: slot.count + 1, reset: slot.reset},
  );

  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return NextResponse.json({ok: false, message: "Invalid submission"}, {status: 400});
  }
  if (String(data.get("website") || "")) return NextResponse.json({ok: true});

  if (type === "careers") {
    const validationResponse = await validateCareerSubmission(data);
    if (validationResponse) return validationResponse;
  } else if (type === "partnership") {
    const validationResponse = await validatePartnershipSubmission(data);
    if (validationResponse) return validationResponse;
  } else if (type === "contact") {
    const validationResponse = await validateContactSubmission(data);
    if (validationResponse) return validationResponse;
  }

  // Production integration point: forward validated data to the approved corporate email/CRM/ATS adapter.
  return NextResponse.json({
    ok: true,
    reference: `MAH-${type.toUpperCase()}-${Date.now()}`,
  });
}
