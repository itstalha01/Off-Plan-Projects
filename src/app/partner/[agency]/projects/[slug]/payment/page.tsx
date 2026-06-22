import { notFound } from "next/navigation";
import { PaymentCalculator } from "@/features/projects/components/PaymentModal";
import { ProjectSection } from "@/features/projects/components/ProjectSection";
import { hasSection } from "@/features/projects/constants/sections";
import { partnerById } from "@/features/partners/partners";
import {
  partnerProjectBySlug,
  partnerSectionParams,
} from "@/features/partners/partnerParams";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerSectionParams("payment");
}

export default async function PartnerPaymentPage({
  params,
}: {
  params: Promise<{ agency: string; slug: string }>;
}) {
  const { agency, slug } = await params;
  const partner = partnerById(agency);
  if (!partner) notFound();
  const project = partnerProjectBySlug(partner, slug);
  if (!project || !hasSection(project, "payment")) notFound();

  return (
    <ProjectSection title="Payment plan">
      <PaymentCalculator project={project} />
    </ProjectSection>
  );
}
