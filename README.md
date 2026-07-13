# Masdar Al Hayat Corporate Website

Production-oriented bilingual corporate website for **Masdar Al Hayat for Food Industries Ltd.**, built from the approved English/Arabic content workbook.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript strict mode
- Bootstrap 5 Sass foundation + bespoke SCSS
- GSAP + `@gsap/react` + ScrollTrigger
- `next-intl` English/Arabic routing
- React Hook Form + Zod
- Lucide React icons

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` for English and `http://localhost:3000/ar` for Arabic.

## Quality commands

```bash
npm run lint
npm run build
npm run test:e2e
```

## Content

Public content is generated in `src/content/content.generated.json` from `MASDAR-WEB-CONTENT.xlsx`. Items requiring client/management confirmation are stored separately in `src/content/private-confirmations.generated.json` and are intentionally not imported into public pages.

To update content, revise the approved workbook, regenerate the structured JSON, then replace `content.generated.json`. Keep English and Arabic entries semantically aligned.

## Forms

The partnership, careers and contact forms post to `src/app/api/forms/[type]/route.ts`. The included route performs server-side validation, attachment checks, honeypot filtering and basic rate limiting. Replace the final development response with an approved email, CRM or ATS delivery adapter before production launch.

## Images

The visual prototype references curated Unsplash image URLs through `next/image`. Before launch, replace these with client-approved, locally stored photographs in `public/media` and update `src/content/pages.ts`. Keep photo permissions and credits on record.

## Unconfirmed information

Leadership profiles, exact addresses, contact details, certificates, production figures, sustainability metrics, exhibitions, vacancies and other unapproved facts remain hidden. Add them only after written client approval.

## Deployment

The project is compatible with Vercel or a Node.js 22 hosting environment. Configure `NEXT_PUBLIC_SITE_URL`, build with `npm run build`, and start with `npm run start`.
