/**
 * The public origin, used for metadata and the sitemap.
 *
 * Vercel provides its production domain automatically. Anywhere else, set
 * `NEXT_PUBLIC_SITE_URL`; the localhost fallback keeps development working
 * without pretending to be a deployed site.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
