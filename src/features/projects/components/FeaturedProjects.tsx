import { ArrowRight } from "lucide-react";
import {
  entryPriceMillions,
  entrySize,
  PROJECTS,
  slugOf,
} from "../constants/projects";
import { ProjectCard } from "./ProjectCard";

// Editorial order stays independent of the catalogue's filters and sorting.
const FEATURED_SLUGS = [
  "curve-pine-avenue-downtown",
  "sky-tree-tower",
  "canton-sky-tower",
] as const;

const featuredProjects = FEATURED_SLUGS.flatMap((slug) => {
  const project = PROJECTS.find((project) => slugOf(project) === slug);
  return project ? [project] : [];
});

export function FeaturedProjects() {
  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="border-y border-gold/20 bg-cream/50"
    >
      <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">
              In the spotlight
            </p>
            <h2
              id="featured-projects-heading"
              className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl"
            >
              Featured projects
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brown">
              Explore Curve, Sky Tree Tower and Canton Sky Tower. Compare starting
              prices and explore their installment plans.
            </p>
          </div>
          <a
            href="#areas"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-sm text-sm font-semibold text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:self-auto"
          >
            Browse all projects
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={slugOf(project)}
              project={project}
              index={index}
              entryMillions={entryPriceMillions(project)}
              entrySqft={entrySize(project)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
