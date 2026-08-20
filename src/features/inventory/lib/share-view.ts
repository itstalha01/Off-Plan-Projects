import { formatCroreLakh } from "@/lib/format";
import type { ShareableFieldKey } from "../constants/shareable-fields";
import type { Unit, UnitPhoto } from "../types/unit";
import { formatSize } from "./size";

export type SharedUnitView = Partial<{
  type: string;
  city: string;
  area: string;
  sector: string | null;
  address: string;
  unitNumber: string | null;
  mapLink: string | null;
  size: string;
  price: string;
  status: string;
  photos: UnitPhoto[];
}>;

/** Projects a unit down to only the fields a given share chose to expose. */
export function pickVisibleFields(
  unit: Unit,
  visibleFields: ShareableFieldKey[]
): SharedUnitView {
  const has = (key: ShareableFieldKey) => visibleFields.includes(key);
  const view: SharedUnitView = {};

  if (has("type")) view.type = unit.type;
  if (has("city")) view.city = unit.city;
  if (has("area")) view.area = unit.area;
  if (has("sector")) view.sector = unit.sector;
  if (has("address")) view.address = unit.address;
  if (has("unitNumber")) view.unitNumber = unit.unitNumber;
  if (has("mapLink")) view.mapLink = unit.mapLink;
  if (has("size")) view.size = formatSize(unit.areaSqft);
  if (has("price")) view.price = formatCroreLakh(unit.totalPrice);
  if (has("status")) view.status = unit.status;
  if (has("photos")) view.photos = unit.photos;

  return view;
}
