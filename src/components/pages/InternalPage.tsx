import {InnerHero} from "@/components/ui/InnerHero";
import {SectionRenderer} from "@/components/ui/SectionRenderer";
import {PAGE_IMAGES, SECTION_IMAGES} from "@/content/pages";
import type {Locale, PageContent, PageTheme} from "@/types/content";

export function InternalPage({page, locale, theme, imageKey}: {page: PageContent; locale: Locale; theme: PageTheme; imageKey: keyof typeof PAGE_IMAGES}) {
  const [hero, ...sections] = page.sections;
  const image = PAGE_IMAGES[imageKey];
  return <main id="main-content" className={`page-theme page-theme--${theme}`}><InnerHero section={hero} locale={locale} theme={theme} image={image}/>{sections.map((section,index)=><SectionRenderer key={section.title} section={section} index={index+2} locale={locale} theme={theme} image={SECTION_IMAGES[(index + Object.keys(PAGE_IMAGES).indexOf(imageKey)) % SECTION_IMAGES.length]}/>)}</main>;
}
