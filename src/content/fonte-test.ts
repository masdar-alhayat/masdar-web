import content from "./content.generated.json";
import type {PageContent} from "@/types/content";

// Reuse the approved Brands copy for the dedicated Fonte brand experience.
export const fonteContent: PageContent = {
  ...content.BRANDS,
  title: "Fonte",
  metadata: [
    {label: "Meta Title", en: "Fonte | Every Occasion a Celebration", ar: "فونتي | لكل مناسبة احتفال"},
    {label: "Meta Description", en: "Discover Fonte, Masdar Al Hayat’s flagship food brand. Explore tortillas, sliced breads, specialty buns, pastries, tomato paste and bread crumbs.", ar: "اكتشف فونتي، العلامة الغذائية الرئيسية لمصدر الحياة. تعرّف على التورتيلا والخبز المقطع وخبز البرغر والمعجنات ومعجون الطماطم وفتات الخبز."},
  ],
};
