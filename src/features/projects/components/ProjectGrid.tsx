"use client";

import { SearchX } from "lucide-react";
import { entryInBudget, PROJECTS, slugOf } from "../constants/projects";
import { isAllowedSlug } from "@/features/partners/partners";
import { usePartner } from "@/features/partners/usePartner";
import { useBudgetFilter } from "../hooks/useBudgetFilter";
import { useFilteredProjects } from "../hooks/useFilteredProjects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  const projects = useFilteredProjects();
  const budget = useBudgetFilter();
  const partner = usePartner();
  const total = partner
    ? PROJECTS.filter((p) => isAllowedSlug(partner, slugOf(p))).length
    : PROJECTS.length;

  return (
    <section id="projects" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <p className="text-sm font-medium text-brown">
        Showing{" "}
        <span className="font-semibold text-ink">{projects.length}</span> of{" "}
        {total} projects
      </p>

      {projects.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-paper py-20 text-center">
          <SearchX className="size-8 text-brown/50" />
          <h3 className="mt-4 font-serif text-xl font-semibold text-ink">
            No projects match your filters
          </h3>
          <p className="mt-1 max-w-sm text-sm text-brown">
            Try widening your budget, clearing the area or type, or resetting
            the filters above.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
          {projects.map((project, index) => {
            const entry = entryInBudget(project, budget);
            return (
              <ProjectCard
                key={project.name}
                project={project}
                index={index}
                entryMillions={entry.millions}
                entrySqft={entry.size}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
