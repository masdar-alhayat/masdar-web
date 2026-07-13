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

const allowed = new Set(["partnership", "careers", "contact"]);
const attempts = new Map<string, {count: number; reset: number}>();
const MAX_FILE = 5 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

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

export async function POST(
  request: NextRequest,
  {params}: {params: Promise<{type: string}>},
) {
  const {type} = await params;
  if (!allowed.has(type)) {
    return NextResponse.json({ok: false, message: "Unknown form"}, {status: 404});
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  const now = Date.now();
  const slot = attempts.get(ip);
  if (slot && slot.reset > now && slot.count >= 8) {
    return NextResponse.json({ok: false, message: "Too many requests"}, {status: 429});
  }
  attempts.set(
    ip,
    !slot || slot.reset <= now
      ? {count: 1, reset: now + 60_000}
      : {count: slot.count + 1, reset: slot.reset},
  );

  const data = await request.formData();
  if (String(data.get("website") || "")) return NextResponse.json({ok: true});

  if (type === "careers") {
    const validationResponse = await validateCareerSubmission(data);
    if (validationResponse) return validationResponse;
  } else {
    const textValues = [...data.entries()]
      .filter(
        ([key, entry]) =>
          key !== "website" &&
          typeof entry === "string" &&
          entry !== "true" &&
          entry !== "false",
      )
      .map(([, entry]) => String(entry));
    const textSchema = z.array(z.string().trim().min(1).max(5000)).min(2);
    const parsed = textSchema.safeParse(textValues);

    if (!parsed.success || data.get("consent") !== "true") {
      return NextResponse.json({ok: false, message: "Validation failed"}, {status: 400});
    }

    for (const [, entry] of data.entries()) {
      if (entry instanceof File && entry.size) {
        if (entry.size > MAX_FILE || !allowedTypes.has(entry.type)) {
          return NextResponse.json({ok: false, message: "Invalid attachment"}, {status: 400});
        }
      }
    }
  }

  // Production integration point: forward validated data to the approved corporate email/CRM/ATS adapter.
  return NextResponse.json({
    ok: true,
    reference: `MAH-${type.toUpperCase()}-${Date.now()}`,
  });
}
