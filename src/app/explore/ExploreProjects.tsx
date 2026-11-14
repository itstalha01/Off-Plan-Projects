import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { entryPriceMillions, PROJECTS, slugOf } from "@/features/projects/constants/projects";
import { SECTION_META, sectionsOf } from "@/features/projects/constants/sections";
import { formatMillionsCr } from "@/lib/format";
import { CurveFloorSelector } from "./CurveFloorSelector";
import styles from "./explore.module.css";

const projects = [
  "curve-pine-avenue-downtown",
  "sky-tree-tower",
  "canton-sky-tower",
].flatMap((slug) => {
  const project = PROJECTS.find((item) => slugOf(item) === slug);
  return project ? [project] : [];
});

export function ExploreProjects() {
  return (
    <div className={styles.page}>
      <div className={styles.intro}>
        <h1>Explore Off-Plan Projects</h1>
        <Link className={styles.link} href="#areas">Browse all projects <ArrowDown aria-hidden="true" size={16} /></Link>
        <p>Scroll for more projects. Swipe the panels or choose a chapter to explore each one.</p>
        <nav aria-label="Jump to a project">
          {projects.map((project) => (
            <a key={slugOf(project)} href={`#${slugOf(project)}`}>{project.name}</a>
          ))}
        </nav>
      </div>

      {projects.map((project, index) => {
        const slug = slugOf(project);
        const projectUrl = `/projects/${slug}`;
        const sections = sectionsOf(project);
        const nextProject = projects[index + 1];

        return (
          <section key={slug} id={slug} className={styles.project} aria-labelledby={`${slug}-name`}>
            <nav aria-label={`${project.name} chapters`} className={styles.chapters}>
              <a href={`#${slug}-overview`}>Overview</a>
              {sections.map((section) => (
                <a key={section} href={`#${slug}-${section}`}>
                  {section === "payment" ? "Payment plan" : SECTION_META[section].tab}
                </a>
              ))}
            </nav>

            <div className={styles.track} tabIndex={0} role="region" aria-label={`Swipe or use the arrow keys to browse ${project.name}`}>
              <article id={`${slug}-overview`} className={styles.hero}>
                {project.img && (
                  <Image className={styles.cover} src={project.img} fill sizes="(max-width: 1280px) 100vw, 1280px" alt="" preload={index === 0} />
                )}
                <div className={styles.heroCopy}>
                  <p className={styles.location}>{project.area}, {project.city}</p>
                  <h2 id={`${slug}-name`}>{project.name}</h2>
                  <p>From {formatMillionsCr(entryPriceMillions(project))} · {project.dev}</p>
                  <Link className={styles.button} href={projectUrl}>View project <ArrowUpRight aria-hidden="true" size={16} /></Link>
                </div>
              </article>

              {sections.map((section) => {
                const meta = SECTION_META[section];
                const plan = project.floorPlans?.[0];

                if (section === "floor-plans" && slug === "curve-pine-avenue-downtown") {
                  const ground = project.floorPlans?.find(({ label }) => label === "Ground Floor");
                  const first = project.floorPlans?.find(({ label }) => label === "First Floor");
                  const facade = project.gallery?.[0];

                  if (ground && first && facade) {
                    return (
                      <article key={section} id={`${slug}-${section}`} className={styles.floorPanel}>
                        <CurveFloorSelector facade={facade} floors={[ground, first]} projectUrl={projectUrl} />
                      </article>
                    );
                  }
                }

                const image = section === "floor-plans" ? plan?.img : project.gallery?.[0] ?? project.img;

                return (
                  <article key={section} id={`${slug}-${section}`} className={styles.panel}>
                    <div className={styles.panelCopy}>
                      <p className={styles.location}>{project.name}</p>
                      <h3>{meta.title}</h3>
                      {section === "about" && <p>{project.about?.description}</p>}
                      {section === "developer" && <p>{project.developer?.blurb}</p>}
                      {section === "floor-plans" && <p>{plan?.label}</p>}
                      {section === "payment" && <p>Choose a unit type and size to calculate booking costs and installments.</p>}
                      <Link className={styles.button} href={`${projectUrl}/${meta.segment}`}>
                        {section === "payment" ? "Open calculator" : `View ${section === "about" ? "project details" : meta.tab.toLowerCase()}`}
                        <ArrowUpRight aria-hidden="true" size={16} />
                      </Link>
                    </div>
                    {image && (
                      <div className={section === "floor-plans" ? styles.drawing : styles.photo}>
                        <Image src={image} fill sizes="(max-width: 640px) 90vw, 650px" alt={section === "floor-plans" ? `${project.name} — ${plan?.label}` : ""} />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            <div className={styles.projectFooter}>
              {sections[0] && <a className={styles.link} href={`#${slug}-${sections[0]}`}>Explore chapters <ArrowRight aria-hidden="true" size={16} /></a>}
              {nextProject ? (
                <a className={styles.link} href={`#${slugOf(nextProject)}`}>{nextProject.name} <ArrowDown aria-hidden="true" size={16} /></a>
              ) : (
                <Link className={styles.link} href="#areas">Browse all projects <ArrowUpRight aria-hidden="true" size={16} /></Link>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
