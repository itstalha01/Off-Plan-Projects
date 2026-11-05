import type { MetadataRoute } from "next";
import { PROJECTS, slugOf } from "@/features/projects/constants/projects";
import { SECTION_META, sectionsOf } from "@/features/projects/constants/sections";

const SITE_URL = "https://clearstoreys.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
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
