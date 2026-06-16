"use client";

import { useCallback, useState } from "react";
import { SearchX } from "lucide-react";
import { entryInBudget, PROJECTS } from "../constants/projects";
import { useBudgetFilter } from "../hooks/useBudgetFilter";
import { useFilteredProjects } from "../hooks/useFilteredProjects";
import type { Project } from "../types/project";
import { ProjectCard } from "./ProjectCard";
import {
  ProjectDetailModal,
  type DetailPanel,
} from "./ProjectDetailModal";

export function ProjectGrid() {
  const projects = useFilteredProjects();
  const budget = useBudgetFilter();
  const [selected, setSelected] = useState<{
    project: Project;
    panel: DetailPanel;
  } | null>(null);

  const handleOpen = useCallback(
    (project: Project, panel: DetailPanel = "hub") => {
      setSelected({ project, panel });
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <section id="projects" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
      <p className="text-sm font-medium text-brown">
        Showing{" "}
        <span className="font-semibold text-ink">{projects.length}</span> of{" "}
        {PROJECTS.length} projects
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
                onOpen={handleOpen}
                entryMillions={entry.millions}
                entrySqft={entry.size}
              />
            );
          })}
        </div>
      )}

      <ProjectDetailModal
        project={selected?.project ?? null}
        initialPanel={selected?.panel}
        onClose={handleClose}
      />
    </section>
  );
}
