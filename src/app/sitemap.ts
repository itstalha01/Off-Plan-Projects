import type { MetadataRoute } from "next";
import { PROJECTS, slugOf } from "@/features/projects/constants/projects";
import { SECTION_META, sectionsOf } from "@/features/projects/constants/sections";
import { CURVE_ARTICLE_PATH } from "@/features/articles/curve-brands";
import { LAHORE_PLAZAS, LAHORE_PLAZAS_URL, lahorePlazaUrl } from "@/features/plazas/catalogue";

const SITE_URL = "https://clearstoreys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/privacy-policy` },
    { url: `${SITE_URL}/articles` },
    { url: `${SITE_URL}${CURVE_ARTICLE_PATH}` },
    { url: LAHORE_PLAZAS_URL },
    ...LAHORE_PLAZAS.map(({ slug }) => ({ url: lahorePlazaUrl(slug) })),
    ...PROJECTS.flatMap((project) => {
      const url = `${SITE_URL}/projects/${slugOf(project)}`;
      return [
        { url },
        ...sectionsOf(project).map((section) => ({
          url: `${url}/${SECTION_META[section].segment}`,
        })),
      ];
    }),
  ];
}
