import type {Locale, PageContent} from "@/types/content";

const IMG = "/assets/images/research-innovation";

export interface FocusArea {
  id: string;
  image: string;
  label: string;
  title: string;
  text: string;
}

export interface ProductInnovation {
  id: "pancake" | "brioche" | "protein" | "tortillas";
  name: string;
  tag: string;
  thumb: string;
  insight: string;
  innovation: string;
  facts: string[];
}

export interface ResearchCopy {
  breadcrumb: string;
  kicker: string;
  heading: string[];
  intro: string;
  productsCta: string;
  areasCta: string;
  heroNotes: {protein: string; sugar: string; flavours: string};
  pillars: {title: string; text: string}[];
  areasKicker: string;
  areasHeading: string;
  areasIntro: string;
  areas: FocusArea[];
  productsKicker: string;
  productsHeading: string;
  productsIntro: string;
  insightLabel: string;
  innovationLabel: string;
  products: ProductInnovation[];
  flavours: {id: "strawberry" | "blueberry" | "chocolate"; name: string}[];
  flavourLabel: string;
  views: {id: "front" | "side" | "back"; name: string}[];
  viewLabel: string;
  range: {id: string; name: string}[];
  closing: string;
  cta: string;
}

const productImages = {
  pancake: `${IMG}/pancake-single-strawberry.webp`,
  brioche: `${IMG}/hanini-brioche-front-whole-v1.webp`,
  protein: `${IMG}/tortilla-protein.webp`,
  tortillas: `${IMG}/tortilla-wraps.webp`,
};

// Product facts are taken only from the printed packaging supplied by the client.
// No investment figures, laboratories or patents are implied.
export const researchCopy: Record<Locale, ResearchCopy> = {
  en: {
    breadcrumb: "Home / Research & Innovation",
    kicker: "Research & Innovation",
    heading: ["From insight", "to the table."],
    intro: "At Masdar Al Hayat, research and innovation connect what we learn from people and markets with our food and manufacturing know-how, so every new idea is measured by one question: does it make everyday food better?",
    productsCta: "See our latest innovations",
    areasCta: "Explore our focus areas",
    heroNotes: {protein: "37 g protein per pack", sugar: "No added sugar", flavours: "3 new filled flavours"},
    pillars: [
      {title: "Research", text: "Understand people, markets and possibilities."},
      {title: "Innovation", text: "Turn insight into better food and better ways of working."},
    ],
    areasKicker: "Where we focus",
    areasHeading: "Six areas where the next better idea begins.",
    areasIntro: "Research and innovation reach across our business, from the first consumer insight to the way products are made, packed and delivered.",
    areas: [
      {id: "insight", image: `${IMG}/focus-insight-v2.webp`, label: "Consumer & Market Insight", title: "Understanding people and markets", text: "Consumer preferences, customer feedback and changing market conditions show us where the next idea should begin."},
      {id: "recipes", image: `${IMG}/focus-recipes-v2.webp`, label: "Recipe & Product Innovation", title: "Better taste, texture and formats", text: "We explore recipes, ingredients and formats, from new filled flavours to higher-protein and no-added-sugar choices."},
      {id: "packaging", image: `${IMG}/focus-packaging-v2.webp`, label: "Packaging & Convenience", title: "Packs designed for real life", text: "Formats and packs are shaped around how food is stored, carried, shared and enjoyed, from single portions to family packs."},
      {id: "quality", image: `${IMG}/focus-quality-v2.webp`, label: "Quality & Food Safety", title: "Confidence built in by design", text: "Quality expectations and product protection are considered from the first idea, not added at the end."},
      {id: "digital", image: `${IMG}/focus-digital-v2.webp`, label: "Digital & Process Innovation", title: "Smarter ways of working", text: "Useful data, digital tools and practical process improvements help our teams work with more consistency and insight."},
      {id: "partners", image: `${IMG}/focus-partners-v2.webp`, label: "Open Innovation & Partnerships", title: "Growing through shared knowledge", text: "Customers, suppliers and partners bring new perspectives that we turn into useful improvements together."},
    ],
    productsKicker: "Product innovation",
    productsHeading: "Innovation you can taste.",
    productsIntro: "Our research shows up where it matters most: on the shelf. Explore some of the newest products shaped by what we learned.",
    insightLabel: "The insight",
    innovationLabel: "The innovation",
    products: [
      {id: "pancake", name: "Fonte Pan Cake", tag: "New filled snack", thumb: productImages.pancake, insight: "Families look for a soft, filled treat that is easy to pack, share and enjoy anywhere.", innovation: "Fluffy pan cakes with a fruit or chocolate-hazelnut filling, individually packed and presented in a 12-piece display box.", facts: ["3 flavours", "Individually packed", "12-piece display box"]},
      {id: "brioche", name: "Hanini Brioche", tag: "New", thumb: productImages.brioche, insight: "People want the softness of brioche with choices that fit a more balanced everyday table.", innovation: "A sliced brioche with no added sugar and a source of fibre, wrapped in a pack inspired by local heritage patterns.", facts: ["No added sugar", "Source of fibre", "500 g"]},
      {id: "protein", name: "Protein Tortilla", tag: "High protein", thumb: productImages.protein, insight: "Active consumers want familiar food that works harder for their goals.", innovation: "A tortilla with 37 g of protein per pack, high in fibre and with no added sugar, ready for wraps, fajitas and shawarma.", facts: ["37 g protein per pack", "High fibre", "No added sugar"]},
      {id: "tortillas", name: "Tortilla Range", tag: "7 varieties", thumb: productImages.tortillas, insight: "Every kitchen wraps differently, from classic and whole-wheat to bold and spicy.", innovation: "A growing family of 8-inch tortillas, each with six pieces per pack, covering everyday and specialty tastes.", facts: ["7 varieties", "6 pieces per pack", "8-inch size"]},
    ],
    flavours: [{id: "strawberry", name: "Strawberry"}, {id: "blueberry", name: "Blueberry"}, {id: "chocolate", name: "Chocolate Hazelnut"}],
    flavourLabel: "Choose a flavour",
    views: [{id: "front", name: "Front"}, {id: "side", name: "Side"}, {id: "back", name: "Back"}],
    viewLabel: "Turn the pack",
    range: [{id: "wraps", name: "Tortilla Wraps"}, {id: "brown", name: "Brown Wraps"}, {id: "oat", name: "Oat"}, {id: "corn", name: "Corn"}, {id: "potato", name: "Potato"}, {id: "spicy", name: "Spicy Wraps"}, {id: "protein", name: "Protein"}],
    closing: "Have an idea, a need or a partnership in mind?",
    cta: "Start a conversation",
  },
  ar: {
    breadcrumb: "الرئيسية / البحث والابتكار",
    kicker: "البحث والابتكار",
    heading: ["من الفكرة", "إلى المائدة."],
    intro: "في مصدر الحياة، يربط البحث والابتكار ما نتعلّمه من الناس والأسواق بخبراتنا في الغذاء والتصنيع، لتُقاس كل فكرة جديدة بسؤال واحد: هل تجعل غذاءنا اليومي أفضل؟",
    productsCta: "اكتشف أحدث ابتكاراتنا",
    areasCta: "استكشف مجالات تركيزنا",
    heroNotes: {protein: "٣٧ غ بروتين في العبوة", sugar: "بدون سكر مضاف", flavours: "٣ نكهات محشوة جديدة"},
    pillars: [
      {title: "البحث", text: "نفهم الناس والأسواق والإمكانات."},
      {title: "الابتكار", text: "نحوّل الفهم إلى غذاء أفضل وأساليب عمل أفضل."},
    ],
    areasKicker: "مجالات تركيزنا",
    areasHeading: "ستة مجالات تبدأ منها الفكرة الأفضل التالية.",
    areasIntro: "يمتد البحث والابتكار عبر أعمالنا، من أول فهم لاحتياجات المستهلك إلى طريقة تصنيع المنتجات وتعبئتها وإيصالها.",
    areas: [
      {id: "insight", image: `${IMG}/focus-insight-v2.webp`, label: "رؤى المستهلك والسوق", title: "نفهم الناس والأسواق", text: "تكشف لنا تفضيلات المستهلكين وملاحظات العملاء ومتغيرات السوق من أين يجب أن تبدأ الفكرة التالية."},
      {id: "recipes", image: `${IMG}/focus-recipes-v2.webp`, label: "ابتكار الوصفات والمنتجات", title: "مذاق وقوام وأشكال أفضل", text: "نستكشف الوصفات والمكوّنات والأشكال، من النكهات المحشوة الجديدة إلى الخيارات الغنية بالبروتين والخالية من السكر المضاف."},
      {id: "packaging", image: `${IMG}/focus-packaging-v2.webp`, label: "التعبئة وسهولة الاستخدام", title: "عبوات مصممة للحياة اليومية", text: "نصمم الأشكال والعبوات وفق طريقة حفظ الغذاء وحمله ومشاركته والاستمتاع به، من الحصص الفردية إلى العبوات العائلية."},
      {id: "quality", image: `${IMG}/focus-quality-v2.webp`, label: "الجودة وسلامة الغذاء", title: "ثقة مدمجة منذ البداية", text: "نراعي توقعات الجودة وحماية المنتج منذ الفكرة الأولى، لا في المرحلة الأخيرة."},
      {id: "digital", image: `${IMG}/focus-digital-v2.webp`, label: "الابتكار الرقمي وتحسين العمليات", title: "أساليب عمل أذكى", text: "تساعد البيانات المفيدة والأدوات الرقمية والتحسينات العملية فرقنا على العمل باتساق وفهم أكبر."},
      {id: "partners", image: `${IMG}/focus-partners-v2.webp`, label: "الابتكار المفتوح والشراكات", title: "ننمو بالمعرفة المشتركة", text: "يقدّم العملاء والمورّدون والشركاء رؤى جديدة نحوّلها معاً إلى تحسينات مفيدة."},
    ],
    productsKicker: "ابتكار المنتجات",
    productsHeading: "ابتكار تتذوّقه.",
    productsIntro: "يظهر أثر أبحاثنا حيث يهمّ أكثر: على الرفوف. تعرّف على بعض أحدث المنتجات التي صاغها ما تعلّمناه.",
    insightLabel: "ما لاحظناه",
    innovationLabel: "ما ابتكرناه",
    products: [
      {id: "pancake", name: "بان كيك فونتي", tag: "وجبة خفيفة محشوة جديدة", thumb: productImages.pancake, insight: "تبحث العائلات عن حلوى طرية ومحشوة يسهل حملها ومشاركتها والاستمتاع بها في أي مكان.", innovation: "بان كيك هشّ بحشوة الفاكهة أو الشوكولاتة بالبندق، مغلّف بشكل فردي ويُعرض في علبة من ١٢ قطعة.", facts: ["٣ نكهات", "تغليف فردي", "علبة عرض من ١٢ قطعة"]},
      {id: "brioche", name: "بريوش حنيني", tag: "جديد", thumb: productImages.brioche, insight: "يريد الناس طراوة البريوش مع خيارات تناسب مائدة يومية أكثر توازناً.", innovation: "بريوش مقطّع بدون سكر مضاف ومصدر للألياف، في عبوة مستوحاة من النقوش التراثية المحلية.", facts: ["بدون سكر مضاف", "مصدر للألياف", "٥٠٠ غ"]},
      {id: "protein", name: "تورتيلا بالبروتين", tag: "عالية البروتين", thumb: productImages.protein, insight: "يريد المستهلكون النشطون غذاءً مألوفاً يدعم أهدافهم بشكل أكبر.", innovation: "تورتيلا تحتوي على ٣٧ غ من البروتين في العبوة، غنية بالألياف وبدون سكر مضاف، جاهزة للّفائف والفاهيتا والشاورما.", facts: ["٣٧ غ بروتين في العبوة", "غنية بالألياف", "بدون سكر مضاف"]},
      {id: "tortillas", name: "مجموعة التورتيلا", tag: "٧ أصناف", thumb: productImages.tortillas, insight: "لكل مطبخ طريقته في اللف، من الكلاسيكي والقمح الكامل إلى الجريء والحار.", innovation: "عائلة متنامية من التورتيلا بقياس ٨ إنش، ست قطع في كل عبوة، تغطي الأذواق اليومية والمتخصصة.", facts: ["٧ أصناف", "٦ قطع في العبوة", "قياس ٨ إنش"]},
    ],
    flavours: [{id: "strawberry", name: "فراولة"}, {id: "blueberry", name: "توت أزرق"}, {id: "chocolate", name: "شوكولاتة بالبندق"}],
    flavourLabel: "اختر النكهة",
    views: [{id: "front", name: "الأمام"}, {id: "side", name: "الجانب"}, {id: "back", name: "الخلف"}],
    viewLabel: "قلّب العبوة",
    range: [{id: "wraps", name: "خبز التورتيلا"}, {id: "brown", name: "القمح البر"}, {id: "oat", name: "الشوفان"}, {id: "corn", name: "الذرة"}, {id: "potato", name: "البطاطس"}, {id: "spicy", name: "الفلفل الحار"}, {id: "protein", name: "البروتين"}],
    closing: "هل لديك فكرة أو حاجة أو شراكة في ذهنك؟",
    cta: "لنبدأ حواراً",
  },
};

export const researchInnovationContent: PageContent = {
  title: "Research & Innovation",
  metadata: [
    {label: "Meta Title", en: "Research & Innovation | Masdar Al Hayat", ar: "البحث والابتكار | مصدر الحياة"},
    {label: "Meta Description", en: "Discover how Masdar Al Hayat turns consumer insight, food know-how and partnerships into product innovations such as Fonte Pan Cake, Hanini Brioche and Protein Tortilla.", ar: "اكتشف كيف تحوّل مصدر الحياة فهم المستهلك وخبرات الغذاء والشراكات إلى منتجات مبتكرة مثل بان كيك فونتي وبريوش حنيني وتورتيلا البروتين."},
  ],
  sections: [{title: "Hero", items: [
    {label: "Main Heading", en: researchCopy.en.heading.join(" "), ar: researchCopy.ar.heading.join(" ")},
  ]}],
};
