import { Header } from "@/components/shared/Header";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { Hero } from "@/features/projects/components/Hero";
import { FilterToolbar } from "@/features/projects/components/FilterToolbar";
import { ProjectGrid } from "@/features/projects/components/ProjectGrid";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FilterToolbar />
        <ProjectGrid />
      </main>
      <SiteFooter />
    </>
  );
}
