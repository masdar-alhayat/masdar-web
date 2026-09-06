"use client";

import {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ArrowUpRight, CheckCircle2, Upload} from "lucide-react";
import type {ContentSection, Locale} from "@/types/content";
import {value} from "@/lib/content";
import {
  CAREER_SELECT_OPTIONS,
  CAREER_SELECT_VALUES,
  getCareerFieldName,
  isLettersOnly,
  isLinkedInProfileUrl,
  isSaudiMobile,
  isValidFullName,
  type CareerFieldName,
  type CareerSelectFieldName,
  type LocalizedOption,
  validateCvFile,
} from "@/lib/careerFormValidation";
import {
  PARTNERSHIP_SELECT_OPTIONS,
  PARTNERSHIP_SELECT_VALUES,
  getPartnershipFieldName,
  isBusinessWebsiteUrl,
  isMeaningfulLongText,
  isSaudiMobile as isPartnershipSaudiMobile,
  isValidCompanyName,
  isValidPartnershipFullName,
  isValidPartnershipJobTitle,
  type PartnershipFieldName,
  type PartnershipSelectFieldName,
  validatePartnershipAttachment,
} from "@/lib/partnershipFormValidation";
import {
  CONTACT_SELECT_OPTIONS,
  CONTACT_SELECT_VALUES,
  getContactFieldName,
  isMeaningfulContactMessage,
  isSaudiMobile as isContactSaudiMobile,
  isValidContactCompanyName,
  isValidContactFullName,
  isValidContactSubject,
  type ContactFieldName,
  type ContactSelectFieldName,
  validateContactAttachment,
} from "@/lib/contactFormValidation";
import styles from "./CorporateForm.module.css";

type FormKind = "partnership" | "careers" | "contact";
type FieldType = "text" | "email" | "tel" | "url" | "textarea" | "file" | "select";
type FormValues = Record<string, unknown>;

type Field = {
  id: string;
  label: string;
  englishLabel: string;
  type: FieldType;
  careerName?: CareerFieldName;
  partnerName?: PartnershipFieldName;
  contactName?: ContactFieldName;
};

type ValidationMessages = {
  required: string;
  fullName: string;
  email: string;
  phone: string;
  lettersOnly: string;
  select: string;
  linkedIn: string;
  cvRequired: string;
  cvType: string;
  cvSize: string;
  message: string;
  consent: string;
  companyName: string;
  jobTitle: string;
  website: string;
  requirement: string;
  attachmentType: string;
  attachmentSize: string;
  subject: string;
  contactAttachmentType: string;
  contactAttachmentSize: string;
};

const genericOptions: Record<string, LocalizedOption[]> = {
  country: [
    {value: "saudi-arabia", en: "Saudi Arabia", ar: "المملكة العربية السعودية"},
    {value: "gcc", en: "GCC", ar: "دول مجلس التعاون الخليجي"},
    {value: "middle-east", en: "Middle East", ar: "الشرق الأوسط"},
    {value: "international", en: "International", ar: "دولي"},
  ],
  city: [
    {value: "riyadh", en: "Riyadh", ar: "الرياض"},
    {value: "jeddah", en: "Jeddah", ar: "جدة"},
    {value: "dammam", en: "Dammam", ar: "الدمام"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  type: [
    {value: "general", en: "General", ar: "عام"},
    {value: "distribution", en: "Distribution", ar: "التوزيع"},
    {value: "retail", en: "Retail", ar: "التجزئة"},
    {value: "foodservice", en: "Foodservice", ar: "خدمات الأغذية"},
    {value: "institutional", en: "Institutional", ar: "المؤسسات"},
    {value: "supplier", en: "Supplier", ar: "مورد"},
    {value: "media", en: "Media", ar: "الإعلام"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  category: [
    {value: "bakery", en: "Bakery", ar: "المخبوزات"},
    {value: "pastries", en: "Pastries", ar: "المعجنات"},
    {value: "sauces-condiments", en: "Sauces & Condiments", ar: "الصلصات والتتبيلات"},
    {value: "frozen-ready-meals", en: "Frozen & Ready Meals", ar: "الأغذية المجمدة والوجبات الجاهزة"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  nature: [
    {value: "retail", en: "Retail", ar: "التجزئة"},
    {value: "distribution", en: "Distribution", ar: "التوزيع"},
    {value: "foodservice", en: "Foodservice", ar: "خدمات الأغذية"},
    {value: "hospitality", en: "Hospitality", ar: "الضيافة"},
    {value: "institutional", en: "Institutional", ar: "المؤسسات"},
    {value: "manufacturing", en: "Manufacturing", ar: "التصنيع"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  area: [
    {value: "manufacturing", en: "Manufacturing", ar: "التصنيع"},
    {value: "quality-food-safety", en: "Quality & Food Safety", ar: "الجودة وسلامة الغذاء"},
    {value: "supply-chain", en: "Supply Chain", ar: "سلسلة الإمداد"},
    {value: "sales-marketing", en: "Sales & Marketing", ar: "المبيعات والتسويق"},
    {value: "finance-administration", en: "Finance & Administration", ar: "المالية والإدارة"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  experience: [
    {value: "0-2", en: "0–2 years", ar: "0–2 سنوات"},
    {value: "3-5", en: "3–5 years", ar: "3–5 سنوات"},
    {value: "6-10", en: "6–10 years", ar: "6–10 سنوات"},
    {value: "10-plus", en: "10+ years", ar: "أكثر من 10 سنوات"},
  ],
  qualification: [
    {value: "diploma", en: "Diploma", ar: "دبلوم"},
    {value: "bachelors", en: "Bachelor’s Degree", ar: "درجة البكالوريوس"},
    {value: "masters", en: "Master’s Degree", ar: "درجة الماجستير"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  markets: [
    {value: "retail", en: "Retail", ar: "التجزئة"},
    {value: "wholesale", en: "Wholesale", ar: "الجملة"},
    {value: "foodservice", en: "Foodservice", ar: "خدمات الأغذية"},
    {value: "institutional", en: "Institutional", ar: "المؤسسات"},
    {value: "multiple", en: "Multiple channels", ar: "قنوات متعددة"},
  ],
};

function fieldType(
  label: string,
  careerName?: CareerFieldName,
  partnerName?: PartnershipFieldName,
  contactName?: ContactFieldName,
): FieldType {
  if (careerName === "email" || partnerName === "businessEmail" || contactName === "email") return "email";
  if (careerName === "phone" || partnerName === "phone" || contactName === "phone") return "tel";
  if (careerName === "linkedInProfile" || partnerName === "companyWebsite") return "url";
  if (
    careerName === "additionalMessage" ||
    partnerName === "estimatedRequirement" ||
    partnerName === "message" ||
    contactName === "message"
  ) return "textarea";
  if (careerName === "cv" || partnerName === "attachment" || contactName === "attachment") return "file";
  if (
    careerName === "currentCity" ||
    careerName === "areaOfInterest" ||
    careerName === "yearsOfExperience" ||
    careerName === "highestQualification" ||
    partnerName === "country" ||
    partnerName === "city" ||
    partnerName === "natureOfBusiness" ||
    partnerName === "partnershipType" ||
    partnerName === "productCategory" ||
    partnerName === "marketsServed" ||
    contactName === "country" ||
    contactName === "city" ||
    contactName === "enquiryType"
  ) {
    return "select";
  }

  if (/email/i.test(label)) return "email";
  if (/phone/i.test(label)) return "tel";
  if (/website|linkedin/i.test(label)) return "url";
  if (/message|requirement/i.test(label)) return "textarea";
  if (/attachment|upload|cv/i.test(label)) return "file";
  if (/country|city|type|category|nature|area|experience|qualification|markets|channels/i.test(label)) {
    return "select";
  }
  return "text";
}

function isCareerSelectField(name: CareerFieldName | undefined): name is CareerSelectFieldName {
  return (
    name === "currentCity" ||
    name === "areaOfInterest" ||
    name === "yearsOfExperience" ||
    name === "highestQualification"
  );
}

function isPartnershipSelectField(name: PartnershipFieldName | undefined): name is PartnershipSelectFieldName {
  return (
    name === "country" ||
    name === "city" ||
    name === "natureOfBusiness" ||
    name === "partnershipType" ||
    name === "productCategory" ||
    name === "marketsServed"
  );
}

function isContactSelectField(name: ContactFieldName | undefined): name is ContactSelectFieldName {
  return name === "country" || name === "city" || name === "enquiryType";
}

function getFirstFile(input: unknown): File | undefined {
  if (!input) return undefined;
  if (typeof File !== "undefined" && input instanceof File) return input;
  if (typeof FileList !== "undefined" && input instanceof FileList) {
    return input.item(0) ?? undefined;
  }

  if (typeof input === "object" && input !== null && "0" in input) {
    const candidate = (input as {0?: unknown})[0];
    if (typeof File !== "undefined" && candidate instanceof File) return candidate;
  }

  return undefined;
}

function validationMessages(locale: Locale): ValidationMessages {
  if (locale === "ar") {
    return {
      required: "هذا الحقل مطلوب.",
      fullName: "أدخل اسماً لا يقل عن 3 أحرف، باستخدام الحروف العربية أو الإنجليزية والمسافات فقط.",
      email: "أدخل بريداً إلكترونياً صحيحاً.",
      phone: "يجب أن يتكون رقم الهاتف من 10 أرقام، وأن يبدأ بـ 05، دون مسافات أو رموز.",
      lettersOnly: "أدخل 3 أحرف على الأقل دون مسافات أو أرقام أو رموز خاصة.",
      select: "يرجى اختيار أحد الخيارات.",
      linkedIn: "أدخل رابط ملف شخصي صحيحاً على LinkedIn يبدأ بـ https://linkedin.com/in/ أو https://www.linkedin.com/in/.",
      cvRequired: "إرفاق السيرة الذاتية مطلوب.",
      cvType: "يجب أن تكون السيرة الذاتية بصيغة PDF أو DOC أو DOCX فقط.",
      cvSize: "يجب ألا يتجاوز حجم السيرة الذاتية 5 ميجابايت.",
      message: "أدخل رسالة لا تقل عن 3 أحرف.",
      consent: "يجب الموافقة على الإقرار قبل إرسال الطلب.",
      companyName: "أدخل اسم شركة صحيحاً لا يقل عن حرفين، ويمكن أن يحتوي على حروف عربية أو إنجليزية وأرقام وبعض رموز الأعمال مثل & و- و.",
      jobTitle: "أدخل مسمى وظيفياً لا يقل عن 3 أحرف، باستخدام الحروف العربية أو الإنجليزية والمسافات فقط.",
      website: "أدخل رابط موقع إلكتروني صحيحاً يبدأ بـ http:// أو https://.",
      requirement: "أدخل تفاصيل لا تقل عن 3 أحرف أو أرقام.",
      attachmentType: "المرفق يجب أن يكون PDF أو DOC أو DOCX أو JPG أو PNG فقط.",
      attachmentSize: "يجب ألا يتجاوز حجم المرفق 5 ميجابايت.",
      subject: "أدخل موضوعاً واضحاً لا يقل عن 3 أحرف أو أرقام.",
      contactAttachmentType: "المرفق يجب أن يكون PDF أو DOC أو DOCX أو JPG أو PNG فقط.",
      contactAttachmentSize: "يجب ألا يتجاوز حجم المرفق 5 ميجابايت.",
    };
  }

  return {
    required: "This field is required.",
    fullName: "Enter at least 3 letters using English or Arabic letters and spaces only.",
    email: "Enter a valid email address.",
    phone: "The phone number must contain exactly 10 digits, start with 05, and include no spaces or symbols.",
    lettersOnly: "Enter at least 3 letters with no spaces, numbers, or special symbols.",
    select: "Please select one of the available options.",
    linkedIn: "Enter a valid LinkedIn profile URL beginning with https://linkedin.com/in/ or https://www.linkedin.com/in/.",
    cvRequired: "Uploading your CV is required.",
    cvType: "The CV must be a PDF, DOC, or DOCX file only.",
    cvSize: "The CV file must not exceed 5 MB.",
    message: "Enter a message containing at least 3 characters.",
    consent: "You must accept the declaration before submitting your application.",
    companyName: "Enter a valid company name with at least 2 characters. Letters, numbers, spaces, and common business symbols are allowed.",
    jobTitle: "Enter a job title with at least 3 letters using English or Arabic letters and spaces only.",
    website: "Enter a valid website URL beginning with http:// or https://.",
    requirement: "Enter details containing at least 3 letters or numbers.",
    attachmentType: "The attachment must be PDF, DOC, DOCX, JPG, or PNG only.",
    attachmentSize: "The attachment file must not exceed 5 MB.",
    subject: "Enter a clear subject containing at least 3 letters or numbers.",
    contactAttachmentType: "The attachment must be PDF, DOC, DOCX, JPG, or PNG only.",
    contactAttachmentSize: "The attachment file must not exceed 5 MB.",
  };
}

function careerFieldSchema(fieldName: CareerFieldName, messages: ValidationMessages): z.ZodType {
  switch (fieldName) {
    case "fullName":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(120, messages.fullName)
        .refine(isValidFullName, messages.fullName);
    case "email":
      return z.string().trim().min(1, messages.required).max(254).email(messages.email);
    case "phone":
      return z.string().trim().min(1, messages.required).refine(isSaudiMobile, messages.phone);
    case "nationality":
    case "jobTitle":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(120, messages.lettersOnly)
        .refine(isLettersOnly, messages.lettersOnly);
    case "currentCity":
    case "areaOfInterest":
    case "yearsOfExperience":
    case "highestQualification":
      return z
        .string()
        .trim()
        .min(1, messages.select)
        .refine((entry) => CAREER_SELECT_VALUES[fieldName].has(entry), messages.select);
    case "linkedInProfile":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(500, messages.linkedIn)
        .refine(isLinkedInProfileUrl, messages.linkedIn);
    case "cv":
      return z.any().superRefine((entry, context) => {
        const result = validateCvFile(getFirstFile(entry));
        if (result.ok) return;
        const message =
          result.reason === "required"
            ? messages.cvRequired
            : result.reason === "size"
              ? messages.cvSize
              : messages.cvType;
        context.addIssue({code: "custom", message});
      });
    case "additionalMessage":
      return z.string().trim().min(3, messages.message).max(5000, messages.message);
  }
}

function partnershipFieldSchema(fieldName: PartnershipFieldName, messages: ValidationMessages): z.ZodType {
  switch (fieldName) {
    case "fullName":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(120, messages.fullName)
        .refine(isValidPartnershipFullName, messages.fullName);
    case "companyName":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(160, messages.companyName)
        .refine(isValidCompanyName, messages.companyName);
    case "jobTitle":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(120, messages.jobTitle)
        .refine(isValidPartnershipJobTitle, messages.jobTitle);
    case "businessEmail":
      return z.string().trim().min(1, messages.required).max(254).email(messages.email);
    case "phone":
      return z.string().trim().min(1, messages.required).refine(isPartnershipSaudiMobile, messages.phone);
    case "country":
    case "city":
    case "natureOfBusiness":
    case "partnershipType":
    case "productCategory":
    case "marketsServed":
      return z
        .string()
        .trim()
        .min(1, messages.select)
        .refine((entry) => PARTNERSHIP_SELECT_VALUES[fieldName].has(entry), messages.select);
    case "companyWebsite":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(500, messages.website)
        .refine(isBusinessWebsiteUrl, messages.website);
    case "estimatedRequirement":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(1000, messages.requirement)
        .refine((entry) => isMeaningfulLongText(entry, 3), messages.requirement);
    case "message":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(5000, messages.message)
        .refine((entry) => isMeaningfulLongText(entry, 3), messages.message);
    case "attachment":
      return z.any().superRefine((entry, context) => {
        const result = validatePartnershipAttachment(getFirstFile(entry), false);
        if (result.ok) return;
        const message = result.reason === "size" ? messages.attachmentSize : messages.attachmentType;
        context.addIssue({code: "custom", message});
      });
  }
}

function contactFieldSchema(fieldName: ContactFieldName, messages: ValidationMessages): z.ZodType {
  switch (fieldName) {
    case "fullName":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(120, messages.fullName)
        .refine(isValidContactFullName, messages.fullName);
    case "companyName":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(160, messages.companyName)
        .refine(isValidContactCompanyName, messages.companyName);
    case "email":
      return z.string().trim().min(1, messages.required).max(254).email(messages.email);
    case "phone":
      return z.string().trim().min(1, messages.required).refine(isContactSaudiMobile, messages.phone);
    case "country":
    case "city":
    case "enquiryType":
      return z
        .string()
        .trim()
        .min(1, messages.select)
        .refine((entry) => CONTACT_SELECT_VALUES[fieldName].has(entry), messages.select);
    case "subject":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(200, messages.subject)
        .refine(isValidContactSubject, messages.subject);
    case "message":
      return z
        .string()
        .trim()
        .min(1, messages.required)
        .max(5000, messages.message)
        .refine((entry) => isMeaningfulContactMessage(entry, 3), messages.message);
    case "attachment":
      return z.any().superRefine((entry, context) => {
        const result = validateContactAttachment(getFirstFile(entry), false);
        if (result.ok) return;
        const message = result.reason === "size" ? messages.contactAttachmentSize : messages.contactAttachmentType;
        context.addIssue({code: "custom", message});
      });
  }
}

function genericFieldSchema(field: Field, messages: ValidationMessages): z.ZodType {
  if (field.type === "file") return z.any().optional();
  if (field.type === "email") {
    return z.string().trim().min(1, messages.required).email(messages.email);
  }
  if (field.type === "url") {
    return z.string().trim().min(1, messages.required).url();
  }
  return z.string().trim().min(1, messages.required).max(5000);
}

function inputMetadata(field: Field) {
  if (field.contactName) {
    switch (field.contactName) {
      case "fullName":
        return {autoComplete: "name", maxLength: 120};
      case "companyName":
        return {autoComplete: "organization", maxLength: 160};
      case "email":
        return {autoComplete: "email", maxLength: 254};
      case "phone":
        return {autoComplete: "tel", inputMode: "numeric" as const, pattern: "[0-9]*", maxLength: 10};
      case "subject":
        return {maxLength: 200};
      case "message":
        return {maxLength: 5000};
      default:
        return {};
    }
  }

  if (field.partnerName) {
    switch (field.partnerName) {
      case "fullName":
        return {autoComplete: "name", maxLength: 120};
      case "companyName":
        return {autoComplete: "organization", maxLength: 160};
      case "jobTitle":
        return {autoComplete: "organization-title", maxLength: 120};
      case "businessEmail":
        return {autoComplete: "email", maxLength: 254};
      case "phone":
        return {autoComplete: "tel", inputMode: "numeric" as const, pattern: "[0-9]*", maxLength: 10};
      case "companyWebsite":
        return {autoComplete: "url", maxLength: 500, placeholder: "https://example.com"};
      case "estimatedRequirement":
        return {maxLength: 1000};
      case "message":
        return {maxLength: 5000};
      default:
        return {};
    }
  }

  switch (field.careerName) {
    case "fullName":
      return {autoComplete: "name", maxLength: 120};
    case "email":
      return {autoComplete: "email", maxLength: 254};
    case "phone":
      return {autoComplete: "tel", inputMode: "numeric" as const, pattern: "[0-9]*", maxLength: 10};
    case "nationality":
      return {autoComplete: "country-name", maxLength: 80};
    case "jobTitle":
      return {autoComplete: "organization-title", maxLength: 120};
    case "linkedInProfile":
      return {autoComplete: "url", maxLength: 500, placeholder: "https://www.linkedin.com/in/username"};
    case "additionalMessage":
      return {maxLength: 5000};
    default:
      return {};
  }
}

function genericSelectOptions(field: Field): LocalizedOption[] {
  const optionKey = Object.keys(genericOptions).find((key) =>
    field.englishLabel.toLowerCase().includes(key),
  );
  return genericOptions[optionKey ?? "type"] ?? genericOptions.type;
}

export function CorporateForm({
  section,
  locale,
  kind,
}: {
  section: ContentSection;
  locale: Locale;
  kind: FormKind;
}) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resetVersion, setResetVersion] = useState(0);
  const isArabic = locale === "ar";

  const fields = useMemo<Field[]>(
    () =>
      section.items
        .filter((item) => /^Field \d+$/.test(String(item.label)))
        .map((item, index) => {
          const englishLabel = value(item, "en");
          const careerName = kind === "careers" ? getCareerFieldName(englishLabel) : undefined;
          const partnerName = kind === "partnership" ? getPartnershipFieldName(englishLabel) : undefined;
          const contactName = kind === "contact" ? getContactFieldName(englishLabel) : undefined;
          return {
            id: careerName ?? partnerName ?? contactName ?? `field_${index + 1}`,
            label: value(item, locale),
            englishLabel,
            careerName,
            partnerName,
            contactName,
            type: fieldType(englishLabel, careerName, partnerName, contactName),
          };
        }),
    [section, locale, kind],
  );

  const consent = value(
    section.items.find((item) => item.label === "Consent Checkbox"),
    locale,
  );
  const submitLabel = value(
    section.items.find((item) => item.label === "Submit Button"),
    locale,
  );
  const success =
    value(section.items.find((item) => item.label === "Success Message"), locale) ||
    (isArabic ? "شكراً لك. تم استلام طلبك بنجاح." : "Thank you. Your application has been received successfully.");
  const error =
    value(section.items.find((item) => item.label === "Error Message"), locale) ||
    (isArabic
      ? "تعذر إرسال النموذج. يرجى مراجعة البيانات والمحاولة مرة أخرى."
      : "The form could not be submitted. Please review the information and try again.");
  const messages = useMemo(() => validationMessages(locale), [locale]);

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodType> = {};
    for (const field of fields) {
      shape[field.id] =
        kind === "careers" && field.careerName
          ? careerFieldSchema(field.careerName, messages)
          : kind === "partnership" && field.partnerName
            ? partnershipFieldSchema(field.partnerName, messages)
            : kind === "contact" && field.contactName
              ? contactFieldSchema(field.contactName, messages)
              : genericFieldSchema(field, messages);
    }
    shape.consent = z.boolean().refine(Boolean, messages.consent);
    shape.website = z.string().max(0).optional();
    return z.object(shape);
  }, [fields, kind, messages]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {consent: false, website: ""},
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => setStatus("idle"), 5200);
    return () => window.clearTimeout(timer);
  }, [status]);

  const onSubmit = handleSubmit(async (data) => {
    setStatus("idle");

    try {
      const body = new FormData();
      Object.entries(data).forEach(([key, entry]) => {
        const file = getFirstFile(entry);
        if (file) body.append(key, file);
        else body.append(key, String(entry ?? ""));
      });

      const response = await fetch(`/api/forms/${kind}`, {
        method: "POST",
        body,
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      reset({consent: false, website: ""});
      setResetVersion((version) => version + 1);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  });

  return (
    <form
      className="corporate-form"
      onSubmit={onSubmit}
      noValidate
      data-animate
    >
      <input
        className="honeypot"
        tabIndex={-1}
        autoComplete="off"
        {...register("website")}
        aria-hidden="true"
      />

      <div className="corporate-form__grid">
        {fields.map((field) => {
          const err = errors[field.id]?.message as string | undefined;
          const registration = register(field.id);
          const metadata = inputMetadata(field);
          const fieldClassName = [
            "form-field",
            field.type === "textarea" || field.type === "file" ? "form-field--full" : "",
            err ? styles.fieldInvalid : "",
          ]
            .filter(Boolean)
            .join(" ");
          const controlClassName = err ? styles.controlInvalid : undefined;
          const common = {
            ...registration,
            id: field.id,
            className: controlClassName,
            "aria-invalid": Boolean(err),
            "aria-required": true,
            "aria-describedby": err ? `${field.id}-error` : undefined,
          };

          const selectOptions = isCareerSelectField(field.careerName)
            ? CAREER_SELECT_OPTIONS[field.careerName]
            : isPartnershipSelectField(field.partnerName)
              ? PARTNERSHIP_SELECT_OPTIONS[field.partnerName]
              : isContactSelectField(field.contactName)
                ? CONTACT_SELECT_OPTIONS[field.contactName]
                : genericSelectOptions(field);

          return (
            <div className={fieldClassName} key={field.id}>
              <label htmlFor={field.id}>
                {field.label}
                <span aria-hidden="true">*</span>
              </label>

              {field.type === "textarea" ? (
                <textarea {...common} {...metadata} rows={5} />
              ) : field.type === "select" ? (
                <select {...common} defaultValue="">
                  <option value="" disabled>
                    {isArabic ? "اختر" : "Select"}
                  </option>
                  {selectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {isArabic ? option.ar : option.en}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <div className={`file-control ${err ? styles.fileInvalid : ""}`}>
                  <Upload size={20} aria-hidden="true" />
                  <input
                    key={`${field.id}-${resetVersion}`}
                    {...common}
                    type="file"
                    accept={
                      field.partnerName === "attachment" || field.contactName === "attachment"
                        ? ".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
                        : ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    }
                  />
                  <span className={styles.fileHint}>
                    {field.partnerName === "attachment" || field.contactName === "attachment"
                      ? isArabic
                        ? "اختياري: PDF أو DOC أو DOCX أو JPG أو PNG، بحد أقصى 5 ميجابايت"
                        : "Optional: PDF, DOC, DOCX, JPG, or PNG — maximum 5 MB"
                      : isArabic
                        ? "PDF أو DOC أو DOCX فقط، بحد أقصى 5 ميجابايت"
                        : "PDF, DOC, or DOCX only — maximum 5 MB"}
                  </span>
                </div>
              ) : (
                <input {...common} {...metadata} type={field.type} />
              )}

              {err && (
                <small id={`${field.id}-error`} className={styles.errorText} role="alert">
                  {err}
                </small>
              )}
            </div>
          );
        })}
      </div>

      <label className="consent">
        <input type="checkbox" {...register("consent")} aria-invalid={Boolean(errors.consent)} />
        <span>{consent}</span>
      </label>
      {errors.consent && (
        <small className={styles.errorText} role="alert">
          {errors.consent.message as string}
        </small>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (isArabic ? "جارٍ الإرسال..." : "Submitting...") : submitLabel}
        <ArrowUpRight className="directional-icon" size={18} aria-hidden="true" />
      </button>

      {status === "success" && (
        <div className={styles.successCard} role="status" aria-live="polite">
          <span className={styles.successIcon} aria-hidden="true">
            <CheckCircle2 size={28} strokeWidth={2.2} />
          </span>
          <div className={styles.successCopy}>
            <strong className={styles.successTitle}>{isArabic ? "شكراً لك" : "Thank you"}</strong>
            <p className={styles.successMessage}>{success}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className={styles.errorCard} role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </form>
  );
}
