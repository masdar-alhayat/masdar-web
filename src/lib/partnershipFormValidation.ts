export const MAX_PARTNERSHIP_ATTACHMENT_SIZE = 5 * 1024 * 1024;

export const PARTNERSHIP_ALLOWED_FILE_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png"] as const;

export const PARTNERSHIP_ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
]);

export const PARTNERSHIP_FIELD_NAME_BY_ENGLISH_LABEL = {
  "Full Name": "fullName",
  "Company Name": "companyName",
  "Job Title": "jobTitle",
  "Business Email": "businessEmail",
  "Phone Number": "phone",
  Country: "country",
  City: "city",
  "Company Website": "companyWebsite",
  "Nature of Business": "natureOfBusiness",
  "Partnership Type": "partnershipType",
  "Product Category of Interest": "productCategory",
  "Markets or Channels Served": "marketsServed",
  "Estimated Requirement": "estimatedRequirement",
  Message: "message",
  Attachment: "attachment",
} as const;

export type PartnershipFieldName =
  (typeof PARTNERSHIP_FIELD_NAME_BY_ENGLISH_LABEL)[keyof typeof PARTNERSHIP_FIELD_NAME_BY_ENGLISH_LABEL];

export type PartnershipSelectFieldName =
  | "country"
  | "city"
  | "natureOfBusiness"
  | "partnershipType"
  | "productCategory"
  | "marketsServed";

export type LocalizedOption = {
  value: string;
  en: string;
  ar: string;
};

export const PARTNERSHIP_SELECT_OPTIONS: Record<PartnershipSelectFieldName, LocalizedOption[]> = {
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
  natureOfBusiness: [
    {value: "retail", en: "Retail", ar: "التجزئة"},
    {value: "distribution", en: "Distribution", ar: "التوزيع"},
    {value: "foodservice", en: "Foodservice", ar: "خدمات الأغذية"},
    {value: "hospitality", en: "Hospitality", ar: "الضيافة"},
    {value: "institutional", en: "Institutional", ar: "المؤسسات"},
    {value: "manufacturing", en: "Manufacturing", ar: "التصنيع"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  partnershipType: [
    {value: "distribution", en: "Distribution Partnership", ar: "شراكة توزيع"},
    {value: "retail", en: "Retail / Modern Trade", ar: "التجزئة / التجارة الحديثة"},
    {value: "foodservice", en: "Foodservice", ar: "خدمات الأغذية"},
    {value: "institutional", en: "Institutional Supply", ar: "توريد مؤسسي"},
    {value: "private-label", en: "Private Label", ar: "علامة خاصة"},
    {value: "supplier", en: "Supplier Collaboration", ar: "تعاون مع مورد"},
    {value: "strategic", en: "Strategic Partnership", ar: "شراكة استراتيجية"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  productCategory: [
    {value: "bakery", en: "Bakery", ar: "المخبوزات"},
    {value: "pastries", en: "Pastries", ar: "المعجنات"},
    {value: "sauces-condiments", en: "Sauces & Condiments", ar: "الصلصات والتتبيلات"},
    {value: "frozen-ready-meals", en: "Frozen & Ready Meals", ar: "الأغذية المجمدة والوجبات الجاهزة"},
    {value: "multiple", en: "Multiple Categories", ar: "فئات متعددة"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  marketsServed: [
    {value: "retail", en: "Retail", ar: "التجزئة"},
    {value: "wholesale", en: "Wholesale", ar: "الجملة"},
    {value: "foodservice", en: "Foodservice", ar: "خدمات الأغذية"},
    {value: "hospitality", en: "Hospitality", ar: "الضيافة"},
    {value: "institutional", en: "Institutional", ar: "المؤسسات"},
    {value: "ecommerce", en: "E-commerce", ar: "التجارة الإلكترونية"},
    {value: "multiple", en: "Multiple channels", ar: "قنوات متعددة"},
  ],
};

export const PARTNERSHIP_SELECT_VALUES: Record<PartnershipSelectFieldName, Set<string>> = {
  country: new Set(PARTNERSHIP_SELECT_OPTIONS.country.map((option) => option.value)),
  city: new Set(PARTNERSHIP_SELECT_OPTIONS.city.map((option) => option.value)),
  natureOfBusiness: new Set(PARTNERSHIP_SELECT_OPTIONS.natureOfBusiness.map((option) => option.value)),
  partnershipType: new Set(PARTNERSHIP_SELECT_OPTIONS.partnershipType.map((option) => option.value)),
  productCategory: new Set(PARTNERSHIP_SELECT_OPTIONS.productCategory.map((option) => option.value)),
  marketsServed: new Set(PARTNERSHIP_SELECT_OPTIONS.marketsServed.map((option) => option.value)),
};

const LETTER = /\p{L}|\p{M}/gu;
const LETTER_OR_NUMBER = /[\p{L}\p{M}\p{N}]/gu;
const FULL_NAME_PATTERN = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
const LETTERS_AND_SPACES_PATTERN = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
const COMPANY_NAME_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} &'.,()\-\/]{1,159}$/u;
const SAUDI_MOBILE_PATTERN = /^05\d{8}$/;

export function getPartnershipFieldName(englishLabel: string): PartnershipFieldName | undefined {
  return PARTNERSHIP_FIELD_NAME_BY_ENGLISH_LABEL[
    englishLabel as keyof typeof PARTNERSHIP_FIELD_NAME_BY_ENGLISH_LABEL
  ];
}

export function countLetters(value: string): number {
  return value.match(LETTER)?.length ?? 0;
}

export function countLettersOrNumbers(value: string): number {
  return value.match(LETTER_OR_NUMBER)?.length ?? 0;
}

export function isValidPartnershipFullName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  return FULL_NAME_PATTERN.test(normalized) && countLetters(normalized) >= 3;
}

export function isValidCompanyName(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  return COMPANY_NAME_PATTERN.test(normalized) && countLettersOrNumbers(normalized) >= 2;
}

export function isValidPartnershipJobTitle(value: string): boolean {
  const normalized = value.trim().replace(/\s+/g, " ");
  return LETTERS_AND_SPACES_PATTERN.test(normalized) && countLetters(normalized) >= 3;
}

export function isSaudiMobile(value: string): boolean {
  return SAUDI_MOBILE_PATTERN.test(value);
}

export function isBusinessWebsiteUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      host.includes(".") &&
      !host.includes(" ") &&
      !host.endsWith(".")
    );
  } catch {
    return false;
  }
}

export function isMeaningfulLongText(value: string, minimum = 3): boolean {
  const normalized = value.trim();
  return normalized.length >= minimum && countLettersOrNumbers(normalized) >= minimum;
}

export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : "";
}

export type PartnershipAttachmentLike = {
  name: string;
  size: number;
  type?: string;
};

export type PartnershipAttachmentValidationResult =
  | {ok: true}
  | {ok: false; reason: "required" | "size" | "type"};

export function validatePartnershipAttachment(
  file: PartnershipAttachmentLike | undefined,
  required = false,
): PartnershipAttachmentValidationResult {
  if (!file || file.size <= 0) return required ? {ok: false, reason: "required"} : {ok: true};
  if (file.size > MAX_PARTNERSHIP_ATTACHMENT_SIZE) return {ok: false, reason: "size"};

  const extension = getFileExtension(file.name);
  const extensionAllowed = PARTNERSHIP_ALLOWED_FILE_EXTENSIONS.includes(
    extension as (typeof PARTNERSHIP_ALLOWED_FILE_EXTENSIONS)[number],
  );
  const mimeAllowed = !file.type || PARTNERSHIP_ALLOWED_FILE_TYPES.has(file.type);

  if (!extensionAllowed || !mimeAllowed) return {ok: false, reason: "type"};
  return {ok: true};
}

export async function hasValidPartnershipAttachmentSignature(file: File): Promise<boolean> {
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
