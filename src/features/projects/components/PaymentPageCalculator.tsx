"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { slugOf } from "../constants/projects";
import type { Project } from "../types/project";
import { PaymentCalculator } from "./PaymentModal";

function SelectedPaymentCalculator({ project }: { project: Project }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const group = searchParams.get("group");
  const categoryIndex = project.categories.findIndex(
    (item) => item.name === category && (item.group ?? null) === group
  );

  return (
    <PaymentCalculator
      key={`${slugOf(project)}:${categoryIndex}`}
      project={project}
      initialCategoryIndex={categoryIndex}
    />
  );
}

/** Keep payment pages static while reading the selected unit type on the client. */
export function PaymentPageCalculator({ project }: { project: Project }) {
  return (
    <Suspense
      fallback={
        <p role="status" className="text-sm text-brown">
          Loading payment calculator…
        </p>
      }
    >
      <SelectedPaymentCalculator project={project} />
    </Suspense>
  );
}
