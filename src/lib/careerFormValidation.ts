export const MAX_CV_SIZE = 5 * 1024 * 1024;

export const CAREER_ALLOWED_FILE_EXTENSIONS = ["pdf", "doc", "docx"] as const;

export const CAREER_ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const CAREER_FIELD_NAME_BY_ENGLISH_LABEL = {
  "Full Name": "fullName",
  "Email Address": "email",
  "Phone Number": "phone",
  Nationality: "nationality",
  "Current City": "currentCity",
  "Area of Interest": "areaOfInterest",
  "Years of Experience": "yearsOfExperience",
  "Highest Qualification": "highestQualification",
  "Current or Last Job Title": "jobTitle",
  "LinkedIn Profile": "linkedInProfile",
  "Upload CV": "cv",
  "Additional Message": "additionalMessage",
} as const;

export type CareerFieldName =
  (typeof CAREER_FIELD_NAME_BY_ENGLISH_LABEL)[keyof typeof CAREER_FIELD_NAME_BY_ENGLISH_LABEL];

export type CareerSelectFieldName =
  | "currentCity"
  | "areaOfInterest"
  | "yearsOfExperience"
  | "highestQualification";

export type LocalizedOption = {
  value: string;
  en: string;
  ar: string;
};

export const CAREER_SELECT_OPTIONS: Record<CareerSelectFieldName, LocalizedOption[]> = {
  currentCity: [
    {value: "riyadh", en: "Riyadh", ar: "الرياض"},
    {value: "jeddah", en: "Jeddah", ar: "جدة"},
    {value: "dammam", en: "Dammam", ar: "الدمام"},
    {value: "khobar", en: "Al Khobar", ar: "الخبر"},
    {value: "makkah", en: "Makkah", ar: "مكة المكرمة"},
    {value: "madinah", en: "Madinah", ar: "المدينة المنورة"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  areaOfInterest: [
    {value: "manufacturing", en: "Manufacturing", ar: "التصنيع"},
    {value: "quality-food-safety", en: "Quality & Food Safety", ar: "الجودة وسلامة الغذاء"},
    {value: "supply-chain", en: "Supply Chain", ar: "سلسلة الإمداد"},
    {value: "sales-marketing", en: "Sales & Marketing", ar: "المبيعات والتسويق"},
    {value: "finance-administration", en: "Finance & Administration", ar: "المالية والإدارة"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
  yearsOfExperience: [
    {value: "0-2", en: "0–2 years", ar: "0–2 سنوات"},
    {value: "3-5", en: "3–5 years", ar: "3–5 سنوات"},
    {value: "6-10", en: "6–10 years", ar: "6–10 سنوات"},
    {value: "10-plus", en: "10+ years", ar: "أكثر من 10 سنوات"},
  ],
  highestQualification: [
    {value: "diploma", en: "Diploma", ar: "دبلوم"},
    {value: "bachelors", en: "Bachelor’s Degree", ar: "درجة البكالوريوس"},
    {value: "masters", en: "Master’s Degree", ar: "درجة الماجستير"},
    {value: "doctorate", en: "Doctorate", ar: "الدكتوراه"},
    {value: "other", en: "Other", ar: "أخرى"},
  ],
};

export const CAREER_SELECT_VALUES: Record<CareerSelectFieldName, Set<string>> = {
  currentCity: new Set(CAREER_SELECT_OPTIONS.currentCity.map((option) => option.value)),
  areaOfInterest: new Set(CAREER_SELECT_OPTIONS.areaOfInterest.map((option) => option.value)),
  yearsOfExperience: new Set(CAREER_SELECT_OPTIONS.yearsOfExperience.map((option) => option.value)),
  highestQualification: new Set(CAREER_SELECT_OPTIONS.highestQualification.map((option) => option.value)),
};

const LETTER = /\p{L}|\p{M}/gu;
const FULL_NAME_PATTERN = /^[\p{L}\p{M}]+(?: [\p{L}\p{M}]+)*$/u;
const LETTERS_ONLY_PATTERN = /^[\p{L}\p{M}]+$/u;
const SAUDI_MOBILE_PATTERN = /^05\d{8}$/;

export function getCareerFieldName(englishLabel: string): CareerFieldName | undefined {
  return CAREER_FIELD_NAME_BY_ENGLISH_LABEL[
    englishLabel as keyof typeof CAREER_FIELD_NAME_BY_ENGLISH_LABEL
  ];
}

export function countLetters(value: string): number {
  return value.match(LETTER)?.length ?? 0;
}

export function isValidFullName(value: string): boolean {
  const normalized = value.trim();
  return FULL_NAME_PATTERN.test(normalized) && countLetters(normalized) >= 3;
}

export function isLettersOnly(value: string): boolean {
  const normalized = value.trim();
  return LETTERS_ONLY_PATTERN.test(normalized) && countLetters(normalized) >= 3;
}

export function isSaudiMobile(value: string): boolean {
  return SAUDI_MOBILE_PATTERN.test(value);
}

export function isLinkedInProfileUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    const hostname = url.hostname.toLowerCase();
    const isLinkedInHost = hostname === "linkedin.com" || hostname.endsWith(".linkedin.com");
    const pathParts = url.pathname.split("/").filter(Boolean);

    return (
      url.protocol === "https:" &&
      isLinkedInHost &&
      pathParts.length >= 2 &&
      pathParts[0].toLowerCase() === "in" &&
      Boolean(pathParts[1])
    );
  } catch {
    return false;
  }
}

export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot >= 0 ? fileName.slice(lastDot + 1).toLowerCase() : "";
}

export type CvFileLike = {
  name: string;
  size: number;
  type?: string;
};

export type CvValidationResult =
  | {ok: true}
  | {ok: false; reason: "required" | "size" | "type"};

export function validateCvFile(file: CvFileLike | undefined): CvValidationResult {
  if (!file || file.size <= 0) return {ok: false, reason: "required"};
  if (file.size > MAX_CV_SIZE) return {ok: false, reason: "size"};

  const extension = getFileExtension(file.name);
  const extensionAllowed = CAREER_ALLOWED_FILE_EXTENSIONS.includes(
    extension as (typeof CAREER_ALLOWED_FILE_EXTENSIONS)[number],
  );
  const mimeAllowed = !file.type || CAREER_ALLOWED_FILE_TYPES.has(file.type);

  if (!extensionAllowed || !mimeAllowed) return {ok: false, reason: "type"};
  return {ok: true};
}

export async function hasValidCvSignature(file: File): Promise<boolean> {
  const extension = getFileExtension(file.name);
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());

  if (extension === "pdf") {
    return (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46 &&
      bytes[4] === 0x2d
    );
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
    return (
      bytes[0] === 0x50 &&
      bytes[1] === 0x4b &&
      (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07) &&
      (bytes[3] === 0x04 || bytes[3] === 0x06 || bytes[3] === 0x08)
    );
  }

  return false;
}
