import type {ContentItem, ContentSection, Locale, PageContent} from "@/types/content";

export function value(item: ContentItem | undefined, locale: Locale): string {
  const raw = item?.[locale];
  if (raw === null || raw === undefined || raw === "—") return "";
  return String(raw);
}

export function byLabel(section: ContentSection, matcher: string | RegExp): ContentItem | undefined {
  return section.items.find((item) => {
    const label = String(item.label ?? "");
    return typeof matcher === "string" ? label === matcher : matcher.test(label);
  });
}

export function allByLabel(section: ContentSection, matcher: RegExp): ContentItem[] {
  return section.items.filter((item) => matcher.test(String(item.label ?? "")));
}

export function meta(page: PageContent, label: string, locale: Locale): string {
  return value(page.metadata.find((item) => item.label === label), locale);
}

export function sectionDisplayTitle(section: ContentSection): string {
  return section.title.replace(/^Section\s+\d+\s+[—–-]\s*/, "");
}

export interface NumberedGroup {
  key: string;
  prefix: string;
  number: number;
  parts: Record<string, ContentItem>;
}

export function numberedGroups(section: ContentSection): NumberedGroup[] {
  const groups = new Map<string, NumberedGroup>();
  for (const item of section.items) {
    const label = String(item.label ?? "");
    const match = label.match(/^(.*?)(\d+)\s*(.*)$/);
    if (!match) continue;
    const prefix = match[1].trim();
    if (/^(Paragraph|Supporting Paragraph|Field|Job Card Field|Form Field)$/i.test(prefix)) continue;
    const number = Number(match[2]);
    const suffix = match[3].trim() || "Text";
    const key = `${prefix}-${number}`;
    const group = groups.get(key) ?? {key, prefix, number, parts: {}};
    group.parts[suffix] = item;
    groups.set(key, group);
  }
  return [...groups.values()].sort((a, b) => a.number - b.number);
}

export function isStructuralLabel(label: string): boolean {
  return /^(Section Label|Main Heading|Breadcrumb|Eyebrow|Primary CTA|Secondary CTA|CTA|Supporting Paragraph \d+|Paragraph \d+|Supporting Content|Introductory Content|Introduction|Statement|Vision Statement|Mission Statement)$/i.test(label);
}

export function paragraphs(section: ContentSection, locale: Locale): string[] {
  return section.items
    .filter((item) => /Paragraph|Supporting Content|Introductory Content|Introduction|Statement|Policy Direction|Closing Content/i.test(String(item.label ?? "")))
    .map((item) => value(item, locale))
    .filter(Boolean);
}

export function pageTitle(page: PageContent, locale: Locale): string {
  const hero = page.sections[0];
  return value(byLabel(hero, "Main Heading"), locale) || value(byLabel(hero, "Page Heading"), locale) || page.title;
}

export function resolveCtaHref(label: string): string {
  const text = label.trim().toLowerCase();

  if (/career application|apply now|current opportunit|application|قدّم|التقديم الوظيفي/.test(text)) return "/careers#career-application";
  if (/submit partnership|partnership enquiry|طلب شراكة|إرسال طلب الشراكة/.test(text)) return "#partnership-enquiry";
  if (/logistics|distribution|اللوجستية|التوزيع/.test(text)) return "/capabilities/logistics-distribution";
  if (/quality|compliance|الجودة|الامتثال/.test(text)) return "/capabilities/quality-compliance";
  if (/manufactur|التصنيع/.test(text)) return "/capabilities/manufacturing";
  if (/operation|العمليات/.test(text)) return "/capabilities/operations";
  if (/partnership|partner|الشراكات|شريك/.test(text)) return "/brands-partnerships/partnerships";
  if (/fonte website|موقع فونتي/.test(text)) return "https://www.masdar.sa";
  if (/brand|fonte|علامات|العلامات|فونتي/.test(text)) return "/brands-partnerships/brands";
  if (/career|وظائف/.test(text)) return "/careers";
  if (/enquiry|contact|تواصل|استفسار/.test(text)) return "/contact#contact-form";
  return "/contact";
}
