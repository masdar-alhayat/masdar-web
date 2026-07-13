export const MAX_CONTACT_ATTACHMENT_SIZE = 5 * 1024 * 1024;

export const CONTACT_ALLOWED_FILE_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png"] as const;

export const CONTACT_ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

export const CONTACT_FIELD_NAME_BY_ENGLISH_LABEL = {
  "Full Name": "fullName",
  "Company Name": "companyName",
  "Email Address": "email",
  "Phone Number": "phone",
  Country: "country",
  City: "city",
  "Enquiry Type": "enquiryType",
  Subject: "subject",
  Message: "message",
  Attachment: "attachment",
} as const;

export type ContactFieldName =
  (typeof CONTACT_FIELD_NAME_BY_ENGLISH_LABEL)[keyof typeof CONTACT_FIELD_NAME_BY_ENGLISH_LABEL];

export type ContactSelectFieldName = "country" | "city" | "enquiryType";

export type LocalizedOption = {
  value: string;
  en: string;
  ar: string;
};

export const CONTACT_SELECT_OPTIONS: Record<ContactSelectFieldName, LocalizedOption[]> = {
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
    {value: "khobar", en: "Al Khobar", ar: "الخبر"},
    {value: "makkah", en: "Makkah", ar: "مكة المكرمة"},
    {value: "madinah", en: "Madinah", ar: "المدينة المنورة"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  enquiryType: [
    {value: "general", en: "General Enquiry", ar: "استفسار عام"},
    {value: "sales", en: "Sales Enquiry", ar: "استفسار مبيعات"},
    {value: "partnership", en: "Partnership", ar: "شراكة"},
    {value: "distribution", en: "Distribution", ar: "التوزيع"},
    {value: "supplier", en: "Supplier / Vendor", ar: "مورد"},
    {value: "media", en: "Media", ar: "الإعلام"},
    {value: "careers", en: "Careers", ar: "الوظائف"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
};

export const CONTACT_SELECT_VALUES: Record<ContactSelectFieldName, Set<string>> = {
  country: new Set(CONTACT_SELECT_OPTIONS.country.map((option) => option.value)),
  city: new Set(CONTACT_SELECT_OPTIONS.city.map((option) => option.value)),
  enquiryType: new Set(CONTACT_SELECT_OPTIONS.enquiryType.map((option) => option.value)),
};

const LETTER = /\p{L}|\p{M}/gu;
const LETTER_OR_NUMBER = /[\p{L}\p{M}\p{N}]/gu;
const FULL_NAME_PATTERN = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
const COMPANY_NAME_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} &'.,()\-\/]{1,159}$/u;
const SUBJECT_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s.,'’()\-\/&:;!?]{2,199}$/u;
const SAUDI_MOBILE_PATTERN = /^05\d{8}$/;

export function getContactFieldName(englishLabel: string): ContactFieldName | undefined {
  return CONTACT_FIELD_NAME_BY_ENGLISH_LABEL[englishLabel as keyof typeof CONTACT_FIELD_NAME_BY_ENGLISH_LABEL];
}

export function countLetters(value: string): number {
  return value.match(LETTER)?.length ?? 0;
}

export function countLettersOrNumbers(value: string): number {
  return value.match(LETTER_OR_NUMBER)?.length ?? 0;
}

export function isValidContactFullName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  return FULL_NAME_PATTERN.test(normalized) && countLetters(normalized) >= 3;
}

export function isValidContactCompanyName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  return COMPANY_NAME_PATTERN.test(normalized) && countLettersOrNumbers(normalized) >= 2;
}

export function isSaudiMobile(value: string): boolean {
  return SAUDI_MOBILE_PATTERN.test(value);
}

export function isValidContactSubject(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  return SUBJECT_PATTERN.test(normalized) && countLettersOrNumbers(normalized) >= 3;
}

export function isMeaningfulContactMessage(value: string, minimum = 3): boolean {
  const normalized = value.trim();
  return normalized.length >= minimum && countLettersOrNumbers(normalized) >= minimum;
}

export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : "";
}

export type ContactAttachmentLike = {
  name: string;
  size: number;
  type?: string;
};

export type ContactAttachmentValidationResult =
  | {ok: true}
  | {ok: false; reason: "required" | "size" | "type"};

export function validateContactAttachment(
  file: ContactAttachmentLike | undefined,
  required = false,
): ContactAttachmentValidationResult {
  if (!file || file.size <= 0) return required ? {ok: false, reason: "required"} : {ok: true};
  if (file.size > MAX_CONTACT_ATTACHMENT_SIZE) return {ok: false, reason: "size"};

  const extension = getFileExtension(file.name);
  const extensionAllowed = CONTACT_ALLOWED_FILE_EXTENSIONS.includes(
    extension as (typeof CONTACT_ALLOWED_FILE_EXTENSIONS)[number],
  );
  const mimeAllowed = !file.type || CONTACT_ALLOWED_FILE_TYPES.has(file.type);

  if (!extensionAllowed || !mimeAllowed) return {ok: false, reason: "type"};
  return {ok: true};
}

export async function hasValidContactAttachmentSignature(file: File): Promise<boolean> {
  if (!file.size) return true;

  const extension = getFileExtension(file.name);
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());

  if (extension === "pdf") {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d;
  }

  if (extension === "doc") {
    return (
      bytes[0] === 0xd0 &&
      bytes[1] === 0xcf &&
      bytes[2] === 0x11 &&
      bytes[3] === 0xe0 &&
      bytes[4] === 0xa1 &&
      bytes[5] === 0xb1 &&
      bytes[6] === 0x1a &&
      bytes[7] === 0xe1
    );
  }

  if (extension === "docx") {
    return bytes[0] === 0x50 && bytes[1] === 0x4b && [0x03, 0x05, 0x07].includes(bytes[2]) && [0x04, 0x06, 0x08].includes(bytes[3]);
  }

  if (extension === "jpg" || extension === "jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (extension === "png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  }

  return false;
}
