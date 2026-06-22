"use client";

import { usePathname } from "next/navigation";
import { partnerFromPath, type Partner } from "./partners";

/** The active partner for the current route, or null on the main Clearstoreys
 *  site. Lets client components stay partner-aware without prop threading. */
export function usePartner(): Partner | null {
  return partnerFromPath(usePathname() || "");
}
