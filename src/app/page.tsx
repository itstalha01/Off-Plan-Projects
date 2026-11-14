import type { Metadata } from "next";
import { Header } from "@/components/shared/Header";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { ExploreProjects } from "./explore/ExploreProjects";
import { FilterToolbar } from "@/features/projects/components/FilterToolbar";
import { ProjectGrid } from "@/features/projects/components/ProjectGrid";
// TEMP: kept for the Bahria Sky One open-house invite banner, currently hidden.
// import { InviteDownload } from "@/features/invite/InviteDownload";

export const metadata: Metadata = {
  alternates: { canonical: "https://clearstoreys.com/" },
  title: "Explore Off-Plan Projects in Lahore & Islamabad | Clearstoreys",
  description:
    "Compare off-plan apartments, shops and offices in Lahore and Islamabad. Explore installment payment plans, starting prices and expected possession dates.",
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ExploreProjects />
        {/* TEMP: Bahria Sky One open-house invite download (remove after the event). */}
        {/* Hidden for now — re-enable by uncommenting when needed. */}
        {/* <InviteDownload /> */}
        <FilterToolbar />
        <ProjectGrid />
      </main>
      <SiteFooter />
    </>
  );
}
