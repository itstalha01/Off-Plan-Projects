// Every field a share link can choose to show or hide. `key` doubles as the
// property name read off a Unit in pickVisibleFields().
export const SHAREABLE_FIELDS = [
  { key: "type", label: "Type" },
  { key: "city", label: "City" },
  { key: "area", label: "Area" },
  { key: "address", label: "Address" },
  { key: "unitNumber", label: "Unit / Plot Number" },
  { key: "mapLink", label: "Map Pin" },
  { key: "size", label: "Size (Marla/Kanal)" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "photos", label: "Photos" },
] as const;

export type ShareableFieldKey = (typeof SHAREABLE_FIELDS)[number]["key"];

export const ALL_SHAREABLE_FIELD_KEYS: ShareableFieldKey[] = SHAREABLE_FIELDS.map(
  (f) => f.key
);
