import type { UnitStatusValue } from "../constants/unit-statuses";
import type { UnitTypeValue } from "../constants/unit-types";

export type AreaInputMode = "dimensions" | "direct";
export type RateUnit = "marla" | "kanal";

export type UnitPhoto = {
  id: string;
  blobUrl: string;
  sortOrder: number;
};

export type Unit = {
  id: string;
  category: string;
  type: UnitTypeValue;
  city: string;
  area: string;
  address: string;
  unitNumber: string | null;
  mapLink: string | null;

  areaSqft: number;
  frontFt: number | null;
  depthFt: number | null;
  areaInputMode: AreaInputMode;

  rate: number;
  rateUnit: RateUnit;
  totalPrice: number;

  status: UnitStatusValue;

  photos: UnitPhoto[];

  createdAt: string;
  updatedAt: string;
};

export type UnitFilters = {
  city?: string;
  area?: string;
  type?: string;
  status?: string;
};
