import {InnerHero} from "@/components/ui/InnerHero";
import {SectionRenderer} from "@/components/ui/SectionRenderer";
import {getSectionImage, PAGE_IMAGES} from "@/content/pages";
import type {Locale, PageContent, PageTheme} from "@/types/content";

export function InternalPage({
  page,
  locale,
  theme,
  imageKey,
}: {
  page: PageContent;
  locale: Locale;
  theme: PageTheme;
  imageKey: keyof typeof PAGE_IMAGES;
}) {
  const [hero, ...sections] = page.sections;
  const heroImage = PAGE_IMAGES[imageKey];

  return (
    <main
      id="main-content"
      className={`page-theme page-theme--${theme}`}
    >
      <InnerHero
        section={hero}
        locale={locale}
        theme={theme}
        image={heroImage}
      />

      {sections.map((section, index) => {
        const sectionIndex = index + 2;

        return (
          <SectionRenderer
            key={section.title}
            section={section}
            index={sectionIndex}
            locale={locale}
            theme={theme}
            image={getSectionImage(imageKey, sectionIndex)}
          />
        );
      })}
    </main>
  );
}
