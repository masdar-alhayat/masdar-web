import type {Locale, PageContent} from "@/types/content";

export interface InnovationArea {
  id: string;
  label: string;
  title: string;
  description: string;
  focus: string[];
  value: string;
}

interface InnovationCopy {
  pageName: string;
  metadataDescription: string;
  breadcrumb: string;
  eyebrow: string;
  heading: string;
  intro: string;
  explore: string;
  imageAlt: string;
  imageCaption: string;
  pillars: {title: string; text: string}[];
  areasKicker: string;
  areasHeading: string;
  areasIntro: string;
  mapLabel: string;
  mapCenter: string;
  mapHint: string;
  focusLabel: string;
  valueLabel: string;
  areas: InnovationArea[];
  journeyKicker: string;
  journeyHeading: string;
  journeyIntro: string;
  steps: {title: string; text: string; outcome: string}[];
  feedback: string;
  cta: string;
}

// This describes the company's approach, not a formal departmental structure.
// No institutes, investment figures, proprietary technology or results are implied.
export const innovationCopy: Record<Locale, InnovationCopy> = {
  en: {
    pageName: "Research & Innovation 2",
    metadataDescription: "Explore Masdar Al Hayat’s connected approach to research, innovation and development across customers, products, operations, supply and people.",
    breadcrumb: "Home / Research & Innovation / Research & Innovation 2",
    eyebrow: "Research, Innovation & Development",
    heading: "Connected Thinking. Progress Across Our Business.",
    intro: "At Masdar Al Hayat, our approach brings together market understanding, shared expertise and practical development to improve what we offer, how we work and how we serve.",
    explore: "Explore Our Approach",
    imageAlt: "Colleagues reviewing customer insights, packaging concepts and distribution plans together",
    imageCaption: "Knowledge shared. Progress applied.",
    pillars: [
      {title: "Research", text: "Understand needs and possibilities."},
      {title: "Innovation", text: "Explore better ideas and ways of working."},
      {title: "Development", text: "Turn learning into practical progress."},
    ],
    areasKicker: "One Connected Approach",
    areasHeading: "Innovation Across Our Business",
    areasIntro: "Different perspectives. Shared priorities. Explore how research and development connect the areas that shape our business.",
    mapLabel: "Explore areas of research, innovation and development",
    mapCenter: "Shared Knowledge. Connected Progress.",
    mapHint: "Select an area to explore its focus.",
    focusLabel: "Development focus",
    valueLabel: "The value we work towards",
    areas: [
      {id: "market", label: "Market & Customer Insight", title: "Understanding People and Markets", description: "Consumer preferences, customer feedback and changing market conditions help define where we focus our next effort.", focus: ["Consumer and customer needs", "Market and channel opportunities", "Feedback from sales and service"], value: "More informed priorities and relevant decisions."},
      {id: "products", label: "Products & Packaging", title: "Developing What We Offer", description: "Ideas for recipes, formats and packaging are considered together with how products are used, experienced and delivered.", focus: ["Taste, texture and product formats", "Packaging and convenience", "Everyday and professional applications"], value: "Products and formats that better meet real needs."},
      {id: "quality", label: "Quality & Responsible Practices", title: "Building Confidence Through Improvement", description: "Quality expectations, product protection and responsible use of resources guide how improvements are considered across the business.", focus: ["Quality and product requirements", "Product protection and handling", "Resource use and waste awareness"], value: "Greater consistency, care and confidence."},
      {id: "operations", label: "Operations & Digital Improvement", title: "Improving How Work Gets Done", description: "Reviewing workflows, information and suitable technologies helps identify opportunities for more consistent and effective operations.", focus: ["Workflows and team coordination", "Useful information and digital tools", "Practical process improvements"], value: "Clearer decisions and more effective ways of working."},
      {id: "supply", label: "Supply & Market Delivery", title: "Connecting Supply with Market Needs", description: "Research and improvement extend to sourcing, stock planning, distribution and the way we respond to customer requirements.", focus: ["Supply and inventory planning", "Distribution and service needs", "Information shared across the network"], value: "Better coordination from supply to customer."},
      {id: "people", label: "People & Partnerships", title: "Growing Through Shared Knowledge", description: "Learning across teams and exchanging ideas with customers, suppliers and partners help turn different perspectives into useful improvements.", focus: ["Team knowledge and development", "Cross-functional collaboration", "Customer, supplier and partner dialogue"], value: "Knowledge that travels further across the business."},
    ],
    journeyKicker: "From Insight to Improvement",
    journeyHeading: "A Shared Path to Practical Progress",
    journeyIntro: "Across these areas, the same principle guides our approach: understand the need, develop an idea, learn from its application and keep improving.",
    steps: [
      {title: "Understand", text: "Listen to customers, observe how work happens and define the opportunity or challenge.", outcome: "A clear need to address."},
      {title: "Connect & Develop", text: "Bring relevant teams and knowledge together to explore options and shape a practical response.", outcome: "An idea with a clear purpose."},
      {title: "Evaluate & Apply", text: "Review the proposed improvement, learn from trials where relevant and apply an appropriate solution.", outcome: "Learning put into practice."},
      {title: "Learn & Improve", text: "Use feedback and experience to refine the approach and inform the next opportunity.", outcome: "Continuous learning across teams."},
    ],
    feedback: "Every improvement informs the next question.",
    cta: "Start a Conversation",
  },
  ar: {
    pageName: "البحث والابتكار ٢",
    metadataDescription: "اكتشف نهج مصدر الحياة المتكامل في البحث والابتكار والتطوير عبر العملاء والمنتجات والعمليات والإمداد والكوادر.",
    breadcrumb: "الرئيسية / البحث والابتكار / البحث والابتكار ٢",
    eyebrow: "البحث والابتكار والتطوير",
    heading: "فكر متكامل. تقدّم يشمل أعمالنا.",
    intro: "في مصدر الحياة، يجمع نهجنا بين فهم السوق وتبادل الخبرات والتطوير العملي، لتحسين ما نقدّمه وكيفية عملنا وخدمة عملائنا.",
    explore: "اكتشف نهجنا",
    imageAlt: "فريق عمل يناقش احتياجات العملاء وأفكار التعبئة وخطط التوزيع معاً",
    imageCaption: "معرفة نتشاركها. وتقدّم نطبّقه.",
    pillars: [
      {title: "البحث", text: "نفهم الاحتياجات ونستكشف الإمكانات."},
      {title: "الابتكار", text: "نستكشف أفكاراً وأساليب عمل أفضل."},
      {title: "التطوير", text: "نحوّل ما نتعلّمه إلى تقدّم عملي."},
    ],
    areasKicker: "نهج واحد متكامل",
    areasHeading: "ابتكار يمتد عبر أعمالنا",
    areasIntro: "رؤى متنوعة وأولويات مشتركة. اكتشف كيف يربط البحث والتطوير بين المجالات التي تشكّل أعمالنا.",
    mapLabel: "استكشف مجالات البحث والابتكار والتطوير",
    mapCenter: "معرفة مشتركة. وتقدّم متكامل.",
    mapHint: "اختر مجالاً لاستكشاف محاور تطويره.",
    focusLabel: "محاور التطوير",
    valueLabel: "القيمة التي نعمل لتحقيقها",
    areas: [
      {id: "market", label: "رؤى السوق والعملاء", title: "نفهم الناس والأسواق", description: "تساعدنا تفضيلات المستهلكين وملاحظات العملاء ومتغيرات السوق على تحديد أولويات جهودنا المقبلة.", focus: ["احتياجات المستهلكين والعملاء", "فرص الأسواق وقنوات البيع", "ملاحظات فرق المبيعات والخدمة"], value: "أولويات أوضح وقرارات أكثر ارتباطاً بالاحتياجات."},
      {id: "products", label: "المنتجات والتعبئة", title: "نطوّر ما نقدّمه", description: "ندرس أفكار الوصفات والأشكال والعبوات مع مراعاة كيفية استخدام المنتجات وتجربتها وإيصالها إلى العملاء.", focus: ["المذاق والقوام وأشكال المنتجات", "التعبئة وسهولة الاستخدام", "الاستخدامات اليومية والمهنية"], value: "منتجات وأشكال تلبي الاحتياجات الفعلية بشكل أفضل."},
      {id: "quality", label: "الجودة والممارسات المسؤولة", title: "نعزّز الثقة عبر التحسين", description: "توجّه توقعات الجودة وحماية المنتجات والاستخدام المسؤول للموارد دراسة التحسينات في مختلف أعمالنا.", focus: ["متطلبات الجودة والمنتجات", "حماية المنتجات ومناولتها", "استخدام الموارد والوعي بالهدر"], value: "مزيد من الاتساق والعناية والثقة."},
      {id: "operations", label: "العمليات والتحسين الرقمي", title: "نحسّن أساليب العمل", description: "تساعد مراجعة إجراءات العمل والمعلومات والتقنيات المناسبة على تحديد فرص تعزيز اتساق العمليات وفاعليتها.", focus: ["إجراءات العمل والتنسيق بين الفرق", "المعلومات المفيدة والأدوات الرقمية", "التحسينات العملية للإجراءات"], value: "قرارات أوضح وأساليب عمل أكثر فاعلية."},
      {id: "supply", label: "الإمداد والوصول إلى الأسواق", title: "نربط الإمداد باحتياجات السوق", description: "يمتد البحث والتحسين إلى التوريد وتخطيط المخزون والتوزيع وطريقة استجابتنا لمتطلبات العملاء.", focus: ["تخطيط الإمداد والمخزون", "احتياجات التوزيع والخدمة", "تبادل المعلومات عبر الشبكة"], value: "تنسيق أفضل من الإمداد حتى العميل."},
      {id: "people", label: "الكوادر والشراكات", title: "ننمو بالمعرفة المشتركة", description: "يساعد التعلّم بين الفرق وتبادل الأفكار مع العملاء والمورّدين والشركاء على تحويل الرؤى المتنوعة إلى تحسينات مفيدة.", focus: ["معرفة الكوادر وتطويرها", "التعاون بين فرق العمل", "الحوار مع العملاء والمورّدين والشركاء"], value: "معرفة يمتد أثرها إلى مختلف أعمالنا."},
    ],
    journeyKicker: "من الفهم إلى التحسين",
    journeyHeading: "مسار مشترك نحو تقدّم عملي",
    journeyIntro: "يجمع هذه المجالات مبدأ واحد: نفهم الحاجة، ونطوّر الفكرة، ونتعلّم من تطبيقها، ونواصل التحسين.",
    steps: [
      {title: "نفهم", text: "نستمع إلى العملاء، ونتابع أساليب العمل، ونحدّد الفرصة أو التحدّي.", outcome: "حاجة واضحة نعمل على تلبيتها."},
      {title: "نربط ونطوّر", text: "نجمع الفرق والمعارف ذات الصلة لاستكشاف الخيارات وصياغة استجابة عملية.", outcome: "فكرة ذات هدف واضح."},
      {title: "نقيّم ونطبّق", text: "نراجع التحسين المقترح، ونتعلّم من التجارب عند الحاجة، ونطبّق الحل المناسب.", outcome: "معرفة تتحوّل إلى ممارسة."},
      {title: "نتعلّم ونحسّن", text: "نستفيد من الملاحظات والخبرة لتنقيح النهج وتوجيه الفرصة التالية.", outcome: "تعلّم مستمر بين فرق العمل."},
    ],
    feedback: "كل تحسين يفتح باباً لفكرة جديدة.",
    cta: "لنبدأ حواراً",
  },
};

export const researchInnovation2Content: PageContent = {
  title: "Research & Innovation 2",
  metadata: [
    {label: "Meta Title", en: "Research & Innovation 2 | Masdar Al Hayat", ar: "البحث والابتكار ٢ | مصدر الحياة"},
    {label: "Meta Description", en: innovationCopy.en.metadataDescription, ar: innovationCopy.ar.metadataDescription},
  ],
  sections: [{title: "Hero", items: [
    {label: "Main Heading", en: innovationCopy.en.heading, ar: innovationCopy.ar.heading},
  ]}],
};
