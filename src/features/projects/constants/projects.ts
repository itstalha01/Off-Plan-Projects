import type {
  About,
  Category,
  Developer,
  FloorPlan,
  Installment,
  LdaStatus,
  Plan,
  Project,
  ProjectType,
  UnitConfig,
  UnitConfigGroup,
} from "../types/project";

// Base fields per project. Single-category projects also carry rate/minU/maxU,
// which are auto-wrapped into one "Standard" category below. Projects listed in
// CATEGORY_OVERRIDES / PLAN_OVERRIDES ignore the generic rate/plan fields.
type BaseTuple = [
  name: string,
  dev: string,
  area: string,
  type: ProjectType | ProjectType[],
  poss: string,
  lda: LdaStatus,
  book: number,
  dur: number,
  possP: number,
  bfreq: string,
  yrs: number,
  rate: number,
  minU: number,
  maxU: number,
  img?: string,
];

const rows: BaseTuple[] = [
  ["Bahria Sky 2", "OZ Developers", "Raiwind Road", ["Commercial", "Residential"], "2029", "Approved", 15, 60, 10, "6-Monthly", 3, 54000, 143, 654, "/images/bahria-sky-2.jpg"],
  ["Sky Tree Tower", "HF Developers", "Pine Avenue Road", ["Commercial", "Residential"], "2029", "Approved", 10, 60, 20, "6-Monthly", 3, 30000, 570, 4600, "/images/sky-tree-tower.webp"],
  ["Emirates Mall & Residency", "The Kings Developments", "Raiwind Road", ["Commercial", "Residential"], "2030", "Approved", 10, 65, 15, "6-Monthly", 4, 17000, 56, 1293, "/images/emirates-mall.jpg"],
  ["The Ark", "The Ark Developments", "Pine Avenue Road", "Commercial", "2027", "Approved", 10, 60, 20, "Monthly", 2.5, 31000, 637, 1345, "/images/the-ark-cover.jpg"],
  ["Falah Technology Tower", "Falah Developers", "Main Defence Road", "Commercial", "2028", "Approved", 10, 55, 25, "Monthly", 2.6, 26000, 375, 2003, "/images/falah-tower.jpg"],
  ["Curve – Pine Avenue Downtown", "HF Developers", "Pine Avenue Road", "Commercial", "2029", "Approved", 10, 60, 20, "6-Monthly", 3, 24000, 225, 4800, "/images/curve.webp"],
  ["Zalmi X", "Zalmi Developments", "Pine Avenue Road", "Commercial", "2028", "Approved", 15, 55, 0, "Quarterly", 2.5, 30000, 729, 4671, "/images/zalmi-x.webp"],
  ["Pearl One Capital", "ABS Developers", "DHA Phase 2", ["Residential", "Commercial"], "2029", "Approved", 5, 85, 10, "Monthly", 3, 26000, 625, 1668.75, "/images/pearl-one-capital.webp"],
  ["Pearl One Courtyard", "ABS Developers", "Bahria Town", "Residential", "2029", "Approved", 7, 83, 10, "Monthly", 2, 30000, 500, 1000, "/images/pearl-one-courtyard.webp"],
  ["Classic Atrium", "Classic Living", "Bahria Town", "Residential", "2030", "Approved", 10, 48, 13, "Monthly", 4, 18500, 350, 2500, "/images/classic-atrium.webp"],
  ["Skyline Boulevard", "Brother Developers", "Raiwind Road", ["Commercial", "Residential"], "2030", "Approved", 15, 45, 15, "Monthly", 3.5, 15000, 100, 4668, "/images/skyline-boulevard.jpg"],
  ["Icon Mall & Tower 1", "Athar Associates", "Bahria Town", ["Commercial", "Residential"], "2031", "Approved", 10, 60, 20, "Monthly", 4.5, 19000, 318, 1318, "/images/icon-mall/aerial.webp"],
  ["Icon Mall & Tower 2", "Athar Associates", "Bahria Town", "Residential", "2031", "Approved", 10, 60, 20, "Monthly", 5, 16000, 343, 1182, "/images/icon-mall/aerial.webp"],
  ["Icon Avenue", "Athar Associates", "Pine Avenue Road", "Commercial", "2029", "Approved", 10, 60, 20, "Monthly", 2.5, 25000, 384, 4877, "/images/icon-avenue.jpg"],
];

// Non-Lahore projects. Keyed by name; everything else defaults to "Lahore".
const CITY_OVERRIDES: Record<string, string> = {
  "Pearl One Capital": "Islamabad",
};

// Projects with multiple purchasable layouts. Keyed by project name.
const CATEGORY_OVERRIDES: Record<string, Category[]> = {
  // Real data from the developer's published payment plan.
  // Bahria Sky 2 · launch (discounted) base rate per floor. Main-Boulevard /
  // 60-ft-facing / corner / atrium units are priced higher (see note); sizes
  // are gross sqft read from the plan.
  // Full per-sub-category breakdown. Rates are the discounted launch rates,
  // with each sub-category's location/corner/atrium premium baked into the
  // effective rate (total = gross sqft × rate). Sizes are gross sqft.
  "Bahria Sky 2": [
    { group: "Ground Floor", name: "Standard", rate: 54000, sizes: [154, 330, 338, 581] },
    { group: "Ground Floor", name: "Standard & Atrium", rate: 59400, sizes: [371, 434] },
    { group: "Ground Floor", name: "Standard, Corner & Atrium", rate: 64800, sizes: [336, 345, 394] },
    { group: "Ground Floor", name: "Facing 60ft Road", rate: 69300, sizes: [390, 399, 412, 427, 490, 637] },
    { group: "Ground Floor", name: "Facing 60ft Road & Corner", rate: 72450, sizes: [456, 470] },
    { group: "Ground Floor", name: "Main Boulevard", rate: 77000, sizes: [357, 364, 388] },
    { group: "Ground Floor", name: "Main Boulevard & Corner", rate: 80500, sizes: [350, 420, 630] },
    { group: "Ground Floor", name: "Kiosk (Atrium Facing)", rate: 59400, sizes: [77, 175, 193] },

    { group: "First Floor", name: "Standard", rate: 35000, sizes: [149, 182, 201, 208, 227, 247, 266, 292] },
    { group: "First Floor", name: "Standard & Corner", rate: 38500, sizes: [175, 201, 208, 214, 234, 247, 351] },
    { group: "First Floor", name: "Standard & Atrium", rate: 38500, sizes: [175, 195] },
    { group: "First Floor", name: "Standard, Corner & Atrium", rate: 42000, sizes: [175, 195, 201, 210, 221] },
    { group: "First Floor", name: "Facing 60ft Road", rate: 38500, sizes: [182, 188, 208, 221, 227, 240, 292, 318] },
    { group: "First Floor", name: "Facing 60ft Road & Corner", rate: 40250, sizes: [266] },
    { group: "First Floor", name: "Main Boulevard", rate: 38500, sizes: [182, 195, 201, 247, 253, 435] },
    { group: "First Floor", name: "Main Boulevard & Corner", rate: 40250, sizes: [507] },
    { group: "First Floor", name: "Kiosk (Atrium Facing)", rate: 38500, sizes: [143] },

    { group: "Second Floor", name: "Standard", rate: 30000, sizes: [162, 182, 195, 201, 227, 247, 292, 347] },
    { group: "Second Floor", name: "Standard & Corner", rate: 33000, sizes: [188, 208, 214, 234, 247, 292] },
    { group: "Second Floor", name: "Standard & Atrium", rate: 33000, sizes: [188, 195] },
    { group: "Second Floor", name: "Standard, Corner & Atrium", rate: 36000, sizes: [156, 188, 195, 201] },
    { group: "Second Floor", name: "Facing 60ft Road", rate: 33000, sizes: [175, 182, 188, 227, 292, 299, 325] },
    { group: "Second Floor", name: "Facing 60ft Road & Corner", rate: 34500, sizes: [266] },
    { group: "Second Floor", name: "Main Boulevard", rate: 33000, sizes: [227, 234, 435] },
    { group: "Second Floor", name: "Main Boulevard & Corner", rate: 34500, sizes: [494] },
    { group: "Second Floor", name: "Kiosk (Atrium Facing)", rate: 33000, sizes: [143] },

    { group: "Third Floor", name: "Standard", rate: 27000, sizes: [162, 182, 195, 201, 227, 247, 292, 347] },
    { group: "Third Floor", name: "Standard & Corner", rate: 29700, sizes: [188, 208, 214, 234, 247, 292] },
    { group: "Third Floor", name: "Standard & Atrium", rate: 29700, sizes: [188, 195] },
    { group: "Third Floor", name: "Standard, Corner & Atrium", rate: 32400, sizes: [156, 188, 195, 201] },
    { group: "Third Floor", name: "Facing 60ft Road", rate: 29700, sizes: [175, 182, 188, 227, 292, 299, 325] },
    { group: "Third Floor", name: "Facing 60ft Road & Corner", rate: 31050, sizes: [266] },
    { group: "Third Floor", name: "Main Boulevard", rate: 29700, sizes: [227, 234, 435] },
    { group: "Third Floor", name: "Main Boulevard & Corner", rate: 31050, sizes: [494] },
    { group: "Third Floor", name: "Kiosk (Atrium Facing)", rate: 29700, sizes: [143] },

    { group: "Fourth Floor · Food Court", name: "Kiosk", rate: 36000, sizes: [136, 169, 182, 188, 201] },
    { group: "Fourth Floor · Food Court", name: "Kiosk & Corner", rate: 39600, sizes: [117, 175, 195] },
    { group: "Fourth Floor · Food Court", name: "Kiosk (Atrium Facing)", rate: 39600, sizes: [104, 149, 169, 182, 188] },
    { group: "Fourth Floor · Food Court", name: "Kiosk, Corner & Atrium", rate: 43200, sizes: [91, 136, 188, 195] },
    { group: "Fourth Floor · Food Court", name: "Standard", rate: 36000, sizes: [292] },
    { group: "Fourth Floor · Food Court", name: "Facing 60ft Road", rate: 39600, sizes: [182, 195, 227, 292, 299, 325] },
    { group: "Fourth Floor · Food Court", name: "Facing 60ft Road & Corner", rate: 41400, sizes: [266] },
    { group: "Fourth Floor · Food Court", name: "Main Boulevard", rate: 39600, sizes: [227, 234, 435] },
    { group: "Fourth Floor · Food Court", name: "Main Boulevard & Corner", rate: 41400, sizes: [494] },

    { group: "Apartments (5th–13th)", name: "Standard", rate: 15500, sizes: [533, 539, 591, 650] },
    { group: "Apartments (5th–13th)", name: "Facing 60ft Road", rate: 17050, sizes: [397, 442, 546, 559, 572, 624, 663, 702, 708] },
    { group: "Apartments (5th–13th)", name: "Facing 60ft Road & Corner", rate: 17825, sizes: [1209] },
    { group: "Apartments (5th–13th)", name: "Main Boulevard", rate: 17050, sizes: [604, 611] },
    { group: "Apartments (5th–13th)", name: "Main Boulevard & Corner", rate: 17825, sizes: [1274, 1287] },

    { group: "14th Floor · Apartments", name: "Standard", rate: 22500, sizes: [2483] },
    { group: "14th Floor · Apartments", name: "Facing 60ft Road", rate: 24750, sizes: [2993] },
    { group: "14th Floor · Apartments", name: "Main Boulevard & Corner", rate: 25875, sizes: [2330, 2737, 3381] },
  ],
  // Emirates Mall · rate is flat per floor; a +10% corner / Main-Boulevard
  // factor applies to some units (see disclaimer).
  "Emirates Mall & Residency": [
    { name: "Ground Floor · Showrooms", rate: 55000, sizes: [341, 372, 420, 617, 677, 680, 714, 717, 800, 890] },
    { name: "Ground Floor · Shops", rate: 55000, sizes: [101, 107, 138, 145, 157, 167, 168, 173, 174, 175, 181, 205, 228, 292, 295, 315, 332] },
    { name: "Mezzanine · Shops", rate: 40000, sizes: [139, 153, 190, 207, 219, 235, 263, 295, 310, 327, 409, 437, 460] },
    { name: "First Floor · Shops", rate: 35000, sizes: [146, 148, 151, 160, 172, 186, 196, 206, 208, 213, 214, 218, 222, 231, 239, 252, 253, 258, 301, 306, 328, 350, 365, 400, 406, 560, 699] },
    { name: "Second Floor · Shops", rate: 32000, sizes: [146, 148, 151, 160, 172, 186, 196, 206, 208, 213, 214, 218, 222, 231, 239, 252, 253, 258, 301, 306, 328, 350, 365, 400, 406, 560, 699] },
    { name: "Third Floor · Shops", rate: 30000, sizes: [135, 139, 141, 149, 160, 173, 182, 191, 215, 235, 240, 260, 280, 285, 326, 372, 378, 521, 651] },
    { name: "Signature Apartments", rate: 17000, sizes: [343, 402, 412, 451, 463, 492, 502, 513, 599, 613, 630, 795, 1000, 1079, 1084, 1293] },
    { name: "Hotel Suites", rate: 17000, sizes: [284, 296, 303, 315, 338, 405] },
  ],
  "Sky Tree Tower": [
    { name: "Showroom", rate: 75000, sizes: [4600] },
    { name: "Premium Office", rate: 30000, sizes: [850, 1150] },
    { name: "1 BHK Apartment", rate: 30000, sizes: [570] },
    { name: "2 BHK Apartment", rate: 30000, sizes: [690] },
    { name: "3 BHK Apartment", rate: 30000, sizes: [1200] },
  ],
  "Curve – Pine Avenue Downtown": [
    { name: "Ground & Mezzanine", rate: 60000, sizes: [750, 825, 925, 1125] },
    { name: "First Floor", rate: 34000, sizes: [225, 425, 525] },
    { name: "Second Floor", rate: 32000, sizes: [225, 450, 525] },
    { name: "Office (3 to 7 Floor)", rate: 24000, sizes: [750, 950, 1250, 2250] },
    { name: "8th Floor (eArena)", rate: 40000, sizes: [1075, 1650, 2500, 4800] },
  ],
  // Zalmi X · sizes are the published covered areas of office stacks 301-901
  // through 306-906; the commercial outlet spans Ground + 1st + 2nd floor.
  "Zalmi X": [
    { name: "Corporate Offices (3rd–9th Floor)", rate: 30000, sizes: [729, 751, 892, 1073, 1128, 1265] },
    { name: "Commercial Outlet (Ground, 1st & 2nd)", rate: 62000, sizes: [4671] },
  ],
  // Falah Technology Tower · published office sizes from the payment plan,
  // flat 26,000/sqft rate. Co-working is sold per chair (see plan note).
  "Falah Technology Tower": [
    { name: "Corporate Offices", rate: 26000, sizes: [375, 870, 974, 1038, 1149, 1163, 1200, 1316, 1410, 1531, 1620, 1779, 1811, 2003] },
  ],
  // The Ark · published office sizes from the payment plan; the 8,897 sqft
  // unit at the premium rate is the signature restaurant space.
  "The Ark": [
    { name: "Corporate Offices", rate: 31000, sizes: [637, 661, 690, 718, 808, 829, 937, 980, 1033, 1040, 1092, 1302, 1345] },
    { name: "Signature Restaurant", rate: 40000, sizes: [8897] },
  ],
  // Pearl One Capital · residential apartments. Base rate is 26,000/sqft; the
  // location premium is baked into each sub-category's effective rate —
  // Front +10% and Corner +10% → 28,600, Front & Corner +15% → 29,900.
  // Sizes are the gross areas published in the developer's payment plan.
  "Pearl One Capital": [
    { group: "1 Bed Apartment", name: "General", rate: 26000, sizes: [625, 770] },
    { group: "1 Bed Apartment", name: "Front", rate: 28600, sizes: [630, 635, 715, 716.25, 728.75, 731.25, 741.25, 743.75, 768.75] },
    { group: "1 Bed Apartment", name: "Corner", rate: 28600, sizes: [727.5] },

    { group: "2 Bed Apartment", name: "General", rate: 26000, sizes: [1015, 1128.75] },
    { group: "2 Bed Apartment", name: "Front", rate: 28600, sizes: [1083.75, 1093.75, 1095, 1101.25, 1125, 1175, 1187.5] },
    { group: "2 Bed Apartment", name: "Corner", rate: 28600, sizes: [1282.5] },
    { group: "2 Bed Apartment", name: "Front & Corner", rate: 29900, sizes: [1200] },

    { group: "3 Bed Apartment", name: "General", rate: 26000, sizes: [1668.75] },
    { group: "3 Bed Apartment", name: "Front & Corner", rate: 29900, sizes: [1490] },
  ],
  // Pearl One Courtyard · Tower 1 general apartments, flat 30,000/sqft. Sizes
  // are the gross areas published in the developer's payment plans.
  "Pearl One Courtyard": [
    { group: "1 Bed Apartment", name: "General", rate: 30000, sizes: [500] },
    { group: "2 Bed Apartment", name: "General", rate: 30000, sizes: [800, 1000] },
  ],
  // Classic Atrium · residential apartments, flat 18,500/sqft across all types.
  // Sizes are the approximate covered areas published in the payment plan.
  "Classic Atrium": [
    { name: "Studio Apartment", rate: 18500, sizes: [350] },
    { name: "1 Bed Apartment", rate: 18500, sizes: [500] },
    { name: "2 Bed Apartment", rate: 18500, sizes: [800] },
    { name: "3 Bed Apartment", rate: 18500, sizes: [1100] },
    { name: "3 Bed Lawn Apartment", rate: 18500, sizes: [1650] },
    { name: "3 Bed Penthouse", rate: 18500, sizes: [2500] },
  ],
  // Skyline Boulevard · Brother Developers, Al Kabir Downtown, Main Raiwind Road.
  // Rates shown are the general per-sqft rates published per floor; corner /
  // premium ("category") units carry a higher rate (see plan note). Sizes are
  // the gross areas from the developer's payment plan. Ground-floor kiosks and
  // shops are quoted at their own per-sqft rates.
  "Skyline Boulevard": [
    { group: "Lower Ground", name: "Kiosk", rate: 22000, sizes: [100] },
    { group: "Lower Ground", name: "Shops", rate: 22000, sizes: [113, 150, 204, 246, 286, 345] },

    { group: "Ground Floor", name: "Kiosk", rate: 44000, sizes: [110] },
    { group: "Ground Floor", name: "Shops (Facing Downtown)", rate: 40000, sizes: [250, 310, 368, 406, 442, 557, 614] },
    { group: "Ground Floor", name: "Triple-Height Premium Outlets (Main Boulevard)", rate: 35000, sizes: [2255, 2329, 4668] },

    { group: "1st & 2nd Floor", name: "Kiosk", rate: 25000, sizes: [113] },
    { group: "1st & 2nd Floor", name: "Shops", rate: 25000, sizes: [260, 318, 343, 383, 425, 478] },

    { group: "Luxury Apartments", name: "1 Bed", rate: 15000, sizes: [431, 445, 481, 495, 533, 548, 555, 570, 586, 621, 680] },
    { group: "Luxury Apartments", name: "2 Bed", rate: 15000, sizes: [851, 937, 1004] },
    { group: "Luxury Apartments", name: "3 Bed", rate: 15000, sizes: [1381] },
  ],
  // Icon Mall & Tower 1 · Athar Associates, Bahria Town Lahore. Commercial floors
  // are quoted at a flat per-sqft rate per floor; Tower 1 apartments price by
  // bed type & view. Sizes are net areas from the developer's payment plan.
  "Icon Mall & Tower 1": [
    { group: "Ground Floor", name: "Shops", rate: 75000, sizes: [382, 444, 459, 503, 506, 515, 584, 647, 656, 768, 793, 806, 820, 826] },
    { group: "First Floor", name: "Shops", rate: 45000, sizes: [374, 444, 768] },
    { group: "Second Floor", name: "Shops", rate: 37500, sizes: [415, 438, 442, 475, 501, 505, 551, 568, 569, 584, 642, 656, 741, 793, 814, 820, 828, 1022, 1092, 1261, 1318] },
    { group: "Third Floor", name: "Food Court", rate: 65000, sizes: [321, 329, 497, 547, 678] },

    { group: "Tower 1 Apartments", name: "Studio (Standard)", rate: 19000, sizes: [318, 323, 338, 341, 402] },
    { group: "Tower 1 Apartments", name: "Studio (Pool / Courtyard View)", rate: 20500, sizes: [330] },
    { group: "Tower 1 Apartments", name: "1 Bed (Courtyard View)", rate: 20500, sizes: [565, 572, 615, 627, 635, 731] },
    { group: "Tower 1 Apartments", name: "1 Bed (Ring Road)", rate: 20500, sizes: [604] },
    { group: "Tower 1 Apartments", name: "2 Bed (Courtyard View)", rate: 20500, sizes: [881, 949] },
    { group: "Tower 1 Apartments", name: "2 Bed (Ring Road)", rate: 20500, sizes: [865, 906] },
    { group: "Tower 1 Apartments", name: "3 Bed (Pool / Courtyard / Ring Road)", rate: 20500, sizes: [1101] },
    { group: "Tower 1 Apartments", name: "3 Bed (Ring Road)", rate: 20500, sizes: [1272] },
  ],
  // Icon Mall & Tower 2 · Athar Associates, Bahria Town Lahore. Apartments only
  // (non-furnished). Standard units 16,000/sq ft, courtyard-view units 17,500.
  // Sizes are gross areas from the developer's payment plan.
  "Icon Mall & Tower 2": [
    { group: "Tower 2 Apartments", name: "Studio (Standard)", rate: 16000, sizes: [343, 365, 392, 403] },
    { group: "Tower 2 Apartments", name: "Studio (Courtyard View)", rate: 17500, sizes: [343, 392, 438, 442, 449] },
    { group: "Tower 2 Apartments", name: "1 Bed (Standard)", rate: 16000, sizes: [527, 562, 590] },
    { group: "Tower 2 Apartments", name: "1 Bed (Courtyard View)", rate: 17500, sizes: [501, 530, 562, 574] },
    { group: "Tower 2 Apartments", name: "2 Bed (Courtyard View)", rate: 17500, sizes: [836, 838, 933, 945] },
    { group: "Tower 2 Apartments", name: "3 Bed (Standard)", rate: 16000, sizes: [1182] },
  ],
  // Icon Avenue · Athar Associates, Pine Avenue Road. Commercial offices at a flat
  // 25,000/sqft and showrooms at 50,000/sqft. Sizes are the areas published in the
  // developer's 2.5-year payment plan.
  "Icon Avenue": [
    { name: "Offices", rate: 25000, sizes: [384, 424, 559, 567, 603, 624, 658, 732, 908] },
    { name: "Showrooms", rate: 50000, sizes: [1815, 2066, 2861, 3583, 4093, 4301, 4877] },
  ],
};

// Projects whose payment plan differs from the generic builder. Keyed by name.
// All values are % of the total unit price; per-payment amounts are derived.
const PLAN_OVERRIDES: Record<string, Plan> = {
  // Bahria Sky 2: 15 booking + 10 down payment + 10 possession + (30 monthly = 35%)
  // + (5%×6 bi-annual = 30%) = 100%
  "Bahria Sky 2": {
    milestones: [
      { label: "Booking", pct: 15 },
      { label: "Down payment (after 1 month)", pct: 10 },
      { label: "On possession", pct: 10 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 35 / 30,
        count: 30,
        note: "30 monthly installments (35%)",
      },
      {
        label: "Bi-annual installment",
        pct: 5,
        count: 6,
        note: "5% × 6 (bi-annual)",
      },
    ],
  },
  // Emirates Mall: 10 booking + 10 digging + 15 possession + (48 monthly = 25%)
  // + (5% × 8 bi-annual = 40%) = 100%
  "Emirates Mall & Residency": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Payment at confirmation", pct: 10 },
      { label: "On possession", pct: 15 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 25 / 48,
        count: 48,
        note: "48 monthly installments (25%)",
      },
      {
        label: "Bi-annual installment",
        pct: 5,
        count: 8,
        note: "5% × 8 (bi-annual)",
      },
    ],
  },
  // Sky Tree: 10 booking + 10 confirmation + 20 possession + (1%×30) + (6%×5) = 100%
  "Sky Tree Tower": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation (within 30 days)", pct: 10 },
      { label: "On possession", pct: 20 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 1,
        count: 30,
        note: "1% × 30",
      },
      {
        label: "Half-yearly installment",
        pct: 6,
        count: 5,
        note: "6% × 5 (half-yearly)",
      },
    ],
  },
  // Curve: 10 booking + 10 confirmation + 20 possession + (1%×30) + (6%×5) = 100%
  "Curve – Pine Avenue Downtown": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation (within 30 days)", pct: 10 },
      { label: "On possession", pct: 20 },
    ],
    installments: [
      { label: "Monthly installment", pct: 1, count: 30, note: "1% × 30 months" },
      { label: "Half-yearly installment", pct: 6, count: 5, note: "6% × 5" },
    ],
  },
  // The Ark: 10 booking + 10 confirmation + 20 possession + (1%×25 monthly = 25%)
  // + (7%×5 half-yearly balloons = 35%) = 100% over 30 months
  "The Ark": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation", pct: 10 },
      { label: "On possession", pct: 20 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 1,
        count: 25,
        note: "1% × 25 (monthly)",
      },
      {
        label: "Half-yearly balloon payment",
        pct: 7,
        count: 5,
        note: "7% × 5 (half-yearly)",
      },
    ],
  },
  // Falah Technology Tower: 10 booking + 10 confirmation + 25 possession
  // + (1%×31 monthly = 31%) + (4.8%×5 half-yearly balloons = 24%) = 100%
  "Falah Technology Tower": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation", pct: 10 },
      { label: "On possession", pct: 25 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 1,
        count: 31,
        note: "1% × 31 (monthly)",
      },
      {
        label: "Half-yearly balloon payment",
        pct: 4.8,
        count: 5,
        note: "4.8% × 5 (half-yearly)",
      },
    ],
  },
  // Zalmi X: 15 booking + 15 confirmation + (5.5%×10 quarterly = 55%)
  // + 15 balloon after 18 months = 100% over 30 months
  "Zalmi X": {
    milestones: [
      { label: "Booking", pct: 15 },
      { label: "Confirmation (within 30 days)", pct: 15 },
      { label: "Balloon payment (after 18 months)", pct: 15 },
    ],
    installments: [
      {
        label: "Quarterly installment",
        pct: 5.5,
        count: 10,
        note: "5.5% × 10 (quarterly)",
      },
    ],
  },
  // Pearl One Capital: flat PKR 1,000,000 booking + 36 monthly installments
  // + final balloon on possession. The developer quotes a fixed booking amount
  // (not a %), so the 5% shown is indicative; the exact flat figure is in the
  // plan note. 5 + (2.36% × 36 = 85%) + 10 = 100% over 36 months.
  "Pearl One Capital": {
    milestones: [
      { label: "Booking & down payment", pct: 5 },
      { label: "On possession", pct: 10 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 85 / 36,
        count: 36,
        note: "36 monthly installments (85%)",
      },
    ],
  },
  // Pearl One Courtyard: flat-amount schedule (down payment + final instalment
  // are fixed PKR figures, so the percentages shown are based on the entry
  // 1-bed unit — see plan note). Down payment + 11 monthly + yearly instalment
  // + 11 monthly + final instalment over ~24 months.
  "Pearl One Courtyard": {
    milestones: [
      { label: "Down payment (at booking)", pct: 100 / 15 },
      { label: "Yearly instalment (1 Apr 2027)", pct: 100 / 15 },
      { label: "Final instalment (1 Apr 2028)", pct: 9.5 },
    ],
    installments: [
      {
        label: "Monthly instalment · Year 1",
        pct: 3.5,
        count: 11,
        note: "11 monthly (May 2026 – Mar 2027)",
      },
      {
        label: "Monthly instalment · Year 2",
        pct: 3.5,
        count: 11,
        note: "11 monthly (May 2027 – Mar 2028)",
      },
    ],
  },
  // Classic Atrium: down payment + equal payment after 2 months + 48 monthly
  // + 7 half-yearly balloons + final payment on possession. The developer quotes
  // fixed rupee amounts per unit, so the percentages are indicative — derived
  // from the 350 sqft studio (total 6,475,000; ÷100 = 64,750). 9.19 + 9.19 +
  // (0.602%×48 = 28.9%) + (5.56%×7 = 38.9%) + 13.79 = 100%.
  "Classic Atrium": {
    milestones: [
      { label: "Down payment (at booking)", pct: 595000 / 64750 },
      { label: "Payment after 2 months", pct: 595000 / 64750 },
      { label: "Last payment (on possession)", pct: 893000 / 64750 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 39000 / 64750,
        count: 48,
        note: "48 monthly installments (≈29% on the 350 sqft studio)",
      },
      {
        label: "Half-yearly balloon payment",
        pct: 360000 / 64750,
        count: 7,
        note: "7 half-yearly balloons (≈39% on the 350 sqft studio)",
      },
    ],
  },
  // Skyline Boulevard: 15 booking + 15 confirmation + (42 monthly = 25%)
  // + (half-yearly after every 6 months = 20% over 7 payments) + 10 grey
  // structure + 15 possession = 100%. Pay over 3.5 years, possession in 3 years.
  "Skyline Boulevard": {
    milestones: [
      { label: "Booking", pct: 15 },
      { label: "Confirmation (within 45 days)", pct: 15 },
      { label: "On grey structure", pct: 10 },
      { label: "On possession", pct: 15 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 25 / 42,
        count: 42,
        note: "42 monthly installments (25%)",
      },
      {
        label: "Half-yearly installment",
        pct: 20 / 7,
        count: 7,
        note: "after every 6 months (20%)",
      },
    ],
  },
  // Icon Mall & Tower 1: 10 booking + 10 confirmation (after 2 months)
  // + (54 monthly = 60%) + 20 completion = 100%. Pay over 4.5 years (54 months).
  "Icon Mall & Tower 1": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation (after 2 months)", pct: 10 },
      { label: "On completion", pct: 20 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 60 / 54,
        count: 54,
        note: "54 monthly installments (60%)",
      },
    ],
  },
  // Icon Mall & Tower 2: 10 booking + 10 confirmation (after 2 months)
  // + (60 monthly = 60%) + 20 completion = 100%. Pay over 5 years (60 months).
  "Icon Mall & Tower 2": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation (after 2 months)", pct: 10 },
      { label: "On completion", pct: 20 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 1,
        count: 60,
        note: "60 monthly installments (60%)",
      },
    ],
  },
  // Icon Avenue: 10 booking + 10 confirmation (after 2 months) + 20 completion
  // + (1%×25 monthly = 25%) + (7%×5 half-yearly balloons = 35%) = 100% over 2.5 years.
  "Icon Avenue": {
    milestones: [
      { label: "Booking", pct: 10 },
      { label: "Confirmation (after 2 months)", pct: 10 },
      { label: "On completion", pct: 20 },
    ],
    installments: [
      {
        label: "Monthly installment",
        pct: 1,
        count: 25,
        note: "1% × 25 (monthly)",
      },
      {
        label: "Half-yearly balloon payment",
        pct: 7,
        count: 5,
        note: "7% × 5 (half-yearly)",
      },
    ],
  },
};

// Optional plan caveats, shown beneath the breakdown. Keyed by project name.
const PLAN_NOTES: Record<string, string> = {
  "Falah Technology Tower":
    "Co-working space is also available at PKR 2,600,000 per chair on the same payment plan (booking 260,000 / monthly 26,000). Located at Plot 30, Main Defence Road, near Indus Hospital, Lahore.",
  "Bahria Sky 2":
    "Rates shown are the discounted launch rates, with each sub-category's location, corner and atrium premiums already included. Final availability is confirmed by the developer.",
  "Emirates Mall & Residency":
    "A +10% corner factor and +10% Main-Boulevard factor apply to applicable units, so corner / main-boulevard prices may be higher than shown.",
  "Zalmi X":
    "Corner corporate offices (stacks 303-903 & 304-904) are charged 5% extra. 5% discount on full cash payment. Prices are exclusive of taxes and government dues.",
  "The Ark":
    "A 5% premium factor applies to corner units and a further 5% to front-facing units. Prices are subject to change without prior notice.",
  "Pearl One Courtyard":
    "LDA approved · Tower 1, Bahria Town Lahore, Tipu Sultan Main Boulevard. All apartments are sold at a flat PKR 30,000/sq ft; areas are gross & approximate. The down payment and final instalment are fixed rupee amounts that vary by unit, so the percentages shown are indicative (based on the entry 1-bed unit). Down payment at booking is PKR 1,000,000 for the 1-bed and PKR 1,500,000 for the 2-bed units. The schedule runs as a down payment, 11 monthly instalments (1 May 2026 – 1 Mar 2027), a yearly instalment on 1 Apr 2027, 11 more monthly instalments (1 May 2027 – 1 Mar 2028), and a final instalment on 1 Apr 2028. Down payment is due by 30 April 2026, failing which the booking is cancelled.",
  "Classic Atrium": "Tipu Sultan Block, Bahria Town Lahore.",
  "Skyline Boulevard":
    "LDA approved · Al Kabir Downtown, Main Raiwind Road, Lahore, by Brother Developers. Pay over 3.5 years with possession in 3 years. Rates shown are the general per-sqft rates published per floor; corner and premium (“category”) units carry a higher rate — Lower Ground 24,200, Ground Floor shops 44,000, 1st & 2nd Floor 27,500, and apartments 16,500 per sq ft. Triple-height main-boulevard premium outlets are quoted at 35,000 (up to 49,500 for prime positions). The schedule runs as 15% booking, 15% on confirmation within 45 days, 42 monthly installments (25%), a half-yearly installment after every 6 months (20%), 10% on grey structure, and 15% on possession. Areas are gross & approximate and prices are subject to availability of units.",
  "Icon Mall & Tower 1":
    "LDA approved · Bahria Town Lahore, by Athar Associates; delivery in 2031. The 4.5-year payment plan is the same across all floors: 10% booking, 10% confirmation (after 2 months), 54 monthly installments (60%), and 20% on completion. Commercial units are sold at a flat per-sqft rate per floor — Ground 75,000, First 45,000, Second 37,500, and Third-floor food court 65,000. Tower 1 apartments (non-furnished) are 19,000/sq ft for standard studios and 20,500/sq ft for courtyard-view, ring-road and pool-view units. Areas are net & approximate and prices are subject to availability of units.",
  "Icon Mall & Tower 2":
    "LDA approved · Bahria Town Lahore, by Athar Associates; delivery in 2031. Tower 2 offers non-furnished apartments on a 5-year plan: 10% booking, 10% confirmation (after 2 months), 60 monthly installments (60%), and 20% on completion. Standard units are 16,000/sq ft and courtyard-view units 17,500/sq ft. Areas are gross & approximate and prices are subject to availability of units.",
  "Icon Avenue":
    "LDA approved · Pine Avenue Road, Lahore, by Athar Associates; delivery in 2029. The 2.5-year payment plan is the same for offices and showrooms: 10% booking, 10% confirmation (after 2 months), 25 monthly installments (1% each, 25%), 5 half-yearly balloon payments (7% each, 35%), and 20% on completion. Offices are sold at a flat PKR 25,000/sq ft and showrooms at PKR 50,000/sq ft. Areas are approximate and prices are subject to availability of units.",
  "Pearl One Capital":
    "Approved by CDA and DHA. Eid-ul-Fitr offer — valid till Eid-ul-Fitr 2026. Booking & down payment is a flat PKR 1,000,000 across all unit sizes, followed by 36 equal monthly installments and a final balloon payment on possession (the percentages shown are indicative splits of the total). A corner unit adds 10%, a front unit adds 10%, and front & corner adds 15% — already reflected in the per-sqft rate. All areas are gross & approximate. Instalment plan starts from April 2026 and is subject to availability of units. No discount on full cash payment. Commercial units (offices & shops) and luxury single & double-storey penthouses (LA-A, LA-B, LA-C) are also available — payment plans for these on request.",
};

/** Generate an explicit, ascending list of snap sizes between min and max. */
function genSizes(min: number, max: number): number[] {
  if (min >= max) return [min];
  const round = (n: number) => Math.round(n / 25) * 25;
  const out = [
    min,
    round(min + (max - min) / 3),
    round(min + (2 * (max - min)) / 3),
    max,
  ];
  return [...new Set(out)].sort((a, b) => a - b);
}

/** Payments per year implied by an installment frequency label. */
function perYear(freq: string): number {
  if (/quarter/i.test(freq)) return 4;
  if (/6-?month|half/i.test(freq)) return 2;
  if (/month/i.test(freq)) return 12;
  return 4;
}

/** Build a simple booking + installments + possession plan for placeholders. */
function genericPlan(
  book: number,
  dur: number,
  possP: number,
  bfreq: string,
  yrs: number
): Plan {
  const count = Math.max(1, perYear(bfreq) * yrs);
  const pct = Math.round((dur / count) * 100) / 100;
  return {
    milestones: [
      { label: "Booking", pct: book },
      { label: "On possession", pct: possP },
    ],
    installments: [
      {
        label: `${bfreq} installment`,
        pct,
        count,
        note: `${pct}% × ${count}`,
      },
    ],
  };
}

// ---- Native "About developer / About project / Floor plans" content ----
// Rendered in our own brand (we deliberately do NOT embed developers' brochures).
// Developers are keyed by developer name so all of a developer's projects share
// one bio; project copy and floor plans are keyed by project name.

const DEVELOPERS: Record<string, Developer> = {
  "ABS Developers": {
    name: "ABS Developers",
    blurb:
      "ABS is an emerging real-estate developer on a mission to transform the way people live — bringing luxury into everyday residences through state-of-the-art technology and modern amenities. Founded in 2015, ABS Builders set out to create projects that cater to the luxury-living needs of both the middle and elite classes, and has since completed multiple grand developments that mirror that mission. What sets the company apart is its focus on furnishing luxurious dwellings — apartments and buildings equipped with world-class amenities at genuinely affordable rates. Operating in an Islamic state, ABS is proud to be among the first Sharia-compliant real-estate companies, reflecting its commitment to honesty in trade and regard for its clientele. Quality, luxury and affordability are at the heart of everything it builds.",
    stats: [
      { value: "2015", label: "Founded" },
      { value: "Sharia-compliant", label: "First-of-its-kind" },
      { value: "Bahria Town & DHA", label: "Operating markets" },
    ],
  },
  "Classic Living": {
    name: "Classic Living",
    blurb:
      "Classic Living is the real-estate arm of the Classic group — a name that has stood for excellence and innovation for over forty years, spanning auto-parts trading across Pakistan and Afghanistan as well as medical education, electric vehicles and software solutions worldwide. Classic Living takes pride in transforming urban landscapes across Pakistan, leaving an indelible mark on the cities it serves with iconic landmarks built to stand the test of time. Its commitment to excellence and innovation extends beyond construction — it is about creating spaces that resonate with luxury and comfort.",
    stats: [
      { value: "40+", label: "Years of group legacy" },
      { value: "4", label: "Industries served" },
      { value: "Pakistan", label: "Real-estate market" },
    ],
  },
  "HF Developers": {
    name: "HF Developers",
    blurb:
      "HF Developers is a forward-thinking real-estate company dedicated to delivering modern, high-value developments across Lahore. Led by an experienced team of industry experts, the company focuses on innovation, quality and long-term investment potential. With landmark projects such as CURVE, HF Tower and Sky Tree Tower on Pine Avenue, HF Developers is shaping contemporary urban living with thoughtfully planned commercial and residential spaces. The firm's commitment to excellence and strategic growth continues to position it as a trusted name in Pakistan's evolving real-estate landscape.",
    stats: [
      { value: "Pine Avenue", label: "Flagship corridor" },
      { value: "3+", label: "Landmark projects" },
      { value: "Lahore", label: "Operating market" },
    ],
  },
  "Athar Associates": {
    name: "Athar Associates",
    blurb:
      "With 19 years of legacy, Athar Associates is a name built on commitments delivered and excellence in real estate development. Led by Mian Athar, the firm has earned a strong reputation across Bahria Town Karachi and Bahria Town Lahore — establishing itself as a fourth pillar of Lahore's skyline.",
    stats: [
      { value: "19+", label: "Years of legacy" },
      { value: "12+", label: "Projects delivered" },
      { value: "Karachi & Lahore", label: "Operating markets" },
    ],
    trackRecord: [
      "Jinnah Trade Center",
      "Athar Residencia",
      "Athar Aman Castle",
      "Theme Park View",
      "Zaiby Residencia",
      "Kabber Residencia",
      "Mall One",
      "Prime Tower",
      "Meadows Smart Homes",
      "Business Bay Commercial",
      "Athar Homes",
    ],
  },
  "Zalmi Developments": {
    name: "Zalmi Developments",
    blurb:
      "Zalmi Developments is a premier real-estate developer formed through a strategic joint venture between JW-Corporation and Shalimar Group — pairing industrial-manufacturing muscle with a four-decade construction legacy. JW-Corporation is a Lahore-headquartered conglomerate operating across industrial manufacturing, supply-chain management, retail and strategic partnerships in Pakistan, KSA, the UAE and China; it owns the Peshawar Zalmi cricket team, develops industrial parks and special economic zones, and runs manufacturing joint ventures with Haier, Deli, Enviro, Forland, Foton and SAIC/MG Motors. Shalimar Group, established in 1984 and registered with the Pakistan Engineering Council, has delivered projects for major institutions including the NHA, Pak PWD, C&W and NIPDMC, and over the past decade has expanded into real estate — developing housing societies, residential apartments and commercial projects, and currently spearheading the Shalimar Smart City in Sargodha.",
    stats: [
      { value: "JW × Shalimar", label: "Joint venture" },
      { value: "1984", label: "Shalimar Group founded" },
      { value: "Peshawar Zalmi", label: "Owned by the group" },
    ],
  },
};

// Tower 1 & Tower 2 are the same development — they share project copy & renders.
const ICON_MALL_ABOUT: About = {
  description:
    "Icon Mall & Towers is Lahore's first 22-Kanal twin-towers project — a landmark mixed-use development directly facing the Lahore Ring Road near the Bahria Interchange. Commercial brand outlets occupy the Ground, First and Second floors, with residential apartments rising above, all wrapped around a landscaped central courtyard.",
  highlights: [
    "First 22-Kanal twin towers in Lahore",
    "Lahore Ring Road frontage",
    "Brand-outlet retail podium",
    "Landscaped central courtyard",
    "Bahria Interchange access",
    "Mixed-use: retail + residences",
  ],
};

const ICON_MALL_GALLERY = [
  "/images/icon-mall/aerial.webp",
  "/images/icon-mall/night.webp",
  "/images/icon-mall/render-trio.webp",
];

const ABOUT_OVERRIDES: Record<string, About> = {
  "Pearl One Courtyard": {
    description:
      "Pearl One Courtyard Tower 1 is one of the most modern projects by ABS Developers — designed to offer a life full of comfort, peace and luxury. The building rises Ground + 25 storeys, with basement parking, a G+5-storey shopping mall, and 1, 2 and 3-bedroom apartments topped by double-storey penthouses. Set in the heart of Bahria Town Lahore on Tipu Sultan Main Boulevard, it sits just 10 seconds from Winter Land and the Food Court, 3 minutes from Bahria Hospital and Imtiaz Mall, and 5 minutes from Ring Road, Raiwind Road and Canal Road — a prime address that blends comfort, style and convenience for both residents and businesses.",
    highlights: [
      "Tipu Sultan Main Boulevard, Bahria Town Lahore",
      "LDA approved",
      "Ground + 25 storeys with basement parking",
      "G+5 shopping mall podium",
      "1, 2 & 3-bed apartments + double-storey penthouses",
      "Minutes from Ring Road, Raiwind Road & Canal Road",
    ],
  },
  "Curve – Pine Avenue Downtown": {
    description:
      "The Curve is a contemporary commercial landmark on Pine Avenue Road. Positioned along a prominent curve of the avenue, the project benefits from strong frontage and natural exposure, making it an ideal destination for retail outlets, showrooms and modern office spaces. With its smart layout, premium construction and proximity to established residential communities and popular lifestyle destinations, The Curve creates a dynamic environment for both businesses and customers.",
    highlights: [
      "Pine Avenue Road, Lahore",
      "LDA approved",
      "Contemporary commercial landmark",
      "Prominent avenue frontage & exposure",
      "Retail, showrooms & modern offices",
      "Near established residential communities",
    ],
  },
  "Sky Tree Tower": {
    description:
      "Sky Tree Tower offers a refined blend of modern design, functional business spaces and contemporary living on Pine Avenue Road. Positioned at a highly accessible point along the corridor, the project pairs well-planned showrooms and premium offices with 1, 2 and 3 BHK apartments, meeting the needs of growing businesses, established enterprises and residents alike. With its clean architectural identity, efficient layouts and strong connectivity to Ring Road and the surrounding residential communities, Sky Tree Tower provides an ideal environment for productivity, customer engagement and everyday living.",
    highlights: [
      "Pine Avenue Road, Lahore",
      "LDA approved",
      "Showrooms, premium offices & apartments",
      "1, 2 & 3 BHK residential units",
      "Highly accessible corridor location",
      "Strong connectivity to Ring Road",
    ],
  },
  "Icon Mall & Tower 1": ICON_MALL_ABOUT,
  "Icon Mall & Tower 2": ICON_MALL_ABOUT,
  "Zalmi X": {
    description:
      "Zalmi X is a state-of-the-art premium tower on Pine Avenue Road — a symbol of modern excellence that redefines the high-rise through innovative design. Conceived as a vibrant business centre, it offers high-end commercial spaces and top-quality office units built to spark innovation and drive growth. Premium commercial outlets across the Ground, First and Second floors are designed to house both international and national brands, creating a dynamic retail environment, while corporate offices rising from the 3rd to the 9th floor provide custom workspaces for growing companies, new startups and entrepreneurs. Two basement levels add dedicated parking beneath the tower.",
    highlights: [
      "Pine Avenue Road, Lahore",
      "LDA approved",
      "Premium commercial & corporate tower",
      "Commercial outlets — Ground, 1st & 2nd floor",
      "Corporate offices — 3rd to 9th floor",
      "Two basement parking levels",
    ],
  },
  "Classic Atrium": {
    description:
      "Classic Atrium is a residential high-rise by Classic Living in the Tipu Sultan Block of Bahria Town, Lahore. The tower offers a full range of homes — from studio and one-bed apartments to spacious two- and three-bed residences, lawn apartments and duplex penthouses — each finished at a flat PKR 18,500 per sq ft and scheduled for possession in 2030. Floors are arranged around a central atrium with capsule glass lifts and landscaped terraces, blending luxury and comfort into everyday living.",
    highlights: [
      "Tipu Sultan Block, Bahria Town Lahore",
      "LDA approved",
      "Possession in 2030",
      "Flat PKR 18,500 / sq ft",
      "Studio to 3-bed duplex penthouse",
      "Central atrium & landscaped terraces",
    ],
  },
};

// Classic Atrium · curated renders from the project brochure, ordered exterior
// & common areas → amenities → furnished interiors by unit size. The leading
// image is the landscape atrium hero (it fills the gallery's wide first tile).
const CLASSIC_ATRIUM_GALLERY = [
  "/images/classic-atrium/gallery/01-atrium.jpg",
  "/images/classic-atrium/gallery/02-atrium.jpg",
  "/images/classic-atrium/gallery/03-atrium.jpg",
  "/images/classic-atrium/gallery/04-rooftop.jpg",
  "/images/classic-atrium/gallery/05-rooftop.jpg",
  "/images/classic-atrium/gallery/06-lobbies.jpg",
  "/images/classic-atrium/gallery/07-lobbies.jpg",
  "/images/classic-atrium/gallery/08-lobbies.jpg",
  "/images/classic-atrium/gallery/09-masjid.jpg",
  "/images/classic-atrium/gallery/10-gym.jpg",
  "/images/classic-atrium/gallery/11-daycare.jpg",
  "/images/classic-atrium/gallery/12-kids-zone.jpg",
  "/images/classic-atrium/gallery/13-gaming-zone.jpg",
  "/images/classic-atrium/gallery/14-bowling.jpg",
  "/images/classic-atrium/gallery/15-golf.jpg",
  "/images/classic-atrium/gallery/16-studio.jpg",
  "/images/classic-atrium/gallery/17-studio.jpg",
  "/images/classic-atrium/gallery/18-studio.jpg",
  "/images/classic-atrium/gallery/19-one-bed.jpg",
  "/images/classic-atrium/gallery/20-one-bed.jpg",
  "/images/classic-atrium/gallery/21-one-bed.jpg",
  "/images/classic-atrium/gallery/22-two-bed.jpg",
  "/images/classic-atrium/gallery/23-two-bed.jpg",
  "/images/classic-atrium/gallery/24-three-bed.jpg",
  "/images/classic-atrium/gallery/25-three-bed.jpg",
  "/images/classic-atrium/gallery/26-three-bed.jpg",
];

// Pearl One Courtyard · Tower 1 renders from the project brochure, ordered
// shopping-mall podium → furnished apartment interiors by unit size → penthouse.
const PEARL_ONE_COURTYARD_GALLERY = [
  "/images/pearl-one-courtyard/gallery/01-mall-lower-ground.webp",
  "/images/pearl-one-courtyard/gallery/02-mall-ground.webp",
  "/images/pearl-one-courtyard/gallery/03-mall-first.webp",
  "/images/pearl-one-courtyard/gallery/04-one-bed.webp",
  "/images/pearl-one-courtyard/gallery/05-two-bed.webp",
  "/images/pearl-one-courtyard/gallery/06-three-bed.webp",
  "/images/pearl-one-courtyard/gallery/07-three-bed.webp",
  "/images/pearl-one-courtyard/gallery/08-penthouse.webp",
  "/images/pearl-one-courtyard/gallery/09-penthouse.webp",
];

// Zalmi X · renders from the project brochure — branded entrance lobby (the
// wide hero), corporate office interior, and an amenities plate (car parking,
// high-speed lifts & corporate café).
const ZALMI_X_GALLERY = [
  "/images/zalmi-x/gallery/01-lobby.jpg",
  "/images/zalmi-x/gallery/02-corporate-offices.jpg",
  "/images/zalmi-x/gallery/03-amenities.jpg",
];

// Curve · renders from the project brochure, ordered exterior hero →
// street-level facade → twin curved blocks → central courtyard → branded
// retail → aerial.
const CURVE_GALLERY = [
  "/images/curve/gallery/01-facade-dusk.webp",
  "/images/curve/gallery/02-facade-night.webp",
  "/images/curve/gallery/03-street-view.webp",
  "/images/curve/gallery/04-twin-blocks.webp",
  "/images/curve/gallery/05-courtyard-retail.webp",
  "/images/curve/gallery/06-central-courtyard.webp",
  "/images/curve/gallery/07-branded-night.webp",
  "/images/curve/gallery/08-aerial.webp",
];

// Sky Tree Tower · renders from the project brochure, ordered front elevation →
// angled tower → main-road view → podium detail → aerial.
const SKY_TREE_TOWER_GALLERY = [
  "/images/sky-tree-tower/gallery/01-facade.webp",
  "/images/sky-tree-tower/gallery/02-tower-angle.webp",
  "/images/sky-tree-tower/gallery/03-road-view.webp",
  "/images/sky-tree-tower/gallery/04-podium-detail.webp",
  "/images/sky-tree-tower/gallery/05-aerial.webp",
];

const GALLERY_OVERRIDES: Record<string, string[]> = {
  "Curve – Pine Avenue Downtown": CURVE_GALLERY,
  "Sky Tree Tower": SKY_TREE_TOWER_GALLERY,
  "Pearl One Courtyard": PEARL_ONE_COURTYARD_GALLERY,
  "Icon Mall & Tower 1": ICON_MALL_GALLERY,
  "Icon Mall & Tower 2": ICON_MALL_GALLERY,
  "Classic Atrium": CLASSIC_ATRIUM_GALLERY,
  "Zalmi X": ZALMI_X_GALLERY,
};

const FLOORPLAN_OVERRIDES: Record<string, FloorPlan[]> = {
  "Curve – Pine Avenue Downtown": [
    { label: "Ground Floor", img: "/images/curve/floor-ground.jpg" },
    { label: "First Floor", img: "/images/curve/floor-first.jpg" },
  ],
  "Icon Mall & Tower 1": [
    { label: "Tower 1 — Ground Floor", img: "/images/icon-mall/floor-t1-ground.webp" },
    { label: "Tower 1 — First Floor", img: "/images/icon-mall/floor-t1-first.webp" },
  ],
  "Icon Mall & Tower 2": [
    { label: "Tower 2 — Layout Plan", img: "/images/icon-mall/floor-t2-layout.webp" },
  ],
  "Classic Atrium": [
    { label: "1st – 7th Floor", img: "/images/classic-atrium/floor-1-7.jpg" },
    { label: "12th Floor", img: "/images/classic-atrium/floor-12.jpg" },
    { label: "Penthouse — Lower Storey", img: "/images/classic-atrium/penthouse-lower.jpg" },
    { label: "Penthouse — Upper Storey", img: "/images/classic-atrium/penthouse-upper.jpg" },
  ],
  "Zalmi X": [
    { label: "Basement 1", img: "/images/zalmi-x/floor-basement-1.jpg" },
    { label: "Basement 2", img: "/images/zalmi-x/floor-basement-2.jpg" },
    { label: "Ground Floor", img: "/images/zalmi-x/floor-ground.jpg" },
    { label: "First Floor", img: "/images/zalmi-x/floor-first.jpg" },
    { label: "Second Floor", img: "/images/zalmi-x/floor-second.jpg" },
    { label: "Third & Typical Floor (up to 9th)", img: "/images/zalmi-x/floor-typical.jpg" },
  ],
};

export const PROJECTS: Project[] = rows.map(
  ([name, dev, area, type, poss, lda, book, dur, possP, bfreq, yrs, rate, minU, maxU, img]) => ({
    name,
    dev,
    city: CITY_OVERRIDES[name] ?? "Lahore",
    area,
    type,
    poss,
    lda,
    plan: PLAN_OVERRIDES[name] ?? genericPlan(book, dur, possP, bfreq, yrs),
    categories:
      CATEGORY_OVERRIDES[name] ??
      [{ name: "Standard", rate, sizes: genSizes(minU, maxU) }],
    ...(PLAN_NOTES[name] ? { planNote: PLAN_NOTES[name] } : {}),
    ...(img ? { img } : {}),
    ...(GALLERY_OVERRIDES[name] ? { gallery: GALLERY_OVERRIDES[name] } : {}),
    ...(DEVELOPERS[dev] ? { developer: DEVELOPERS[dev] } : {}),
    ...(ABOUT_OVERRIDES[name] ? { about: ABOUT_OVERRIDES[name] } : {}),
    ...(FLOORPLAN_OVERRIDES[name] ? { floorPlans: FLOORPLAN_OVERRIDES[name] } : {}),
  })
);

// ---- Routing (slugs) ----

/**
 * URL-safe slug derived from a project's (unique) name — lowercased, with every
 * run of non-alphanumerics collapsed to a single hyphen. e.g.
 * "Curve – Pine Avenue Downtown" -> "curve-pine-avenue-downtown".
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Slug -> project lookup, built once. Project names are unique, and slugify is
// stable, so the slugs are too — a collision here would mean two projects share
// a name, which the directory already disallows (name is the React key).
const PROJECTS_BY_SLUG = new Map(PROJECTS.map((p) => [slugify(p.name), p]));

/** The route slug for a project (what its card links to). */
export function slugOf(p: Project): string {
  return slugify(p.name);
}

/** Resolve a route slug back to its project, or undefined if none matches. */
export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS_BY_SLUG.get(slug);
}

/** All project slugs — used to prerender the detail routes. */
export const PROJECT_SLUGS = [...PROJECTS_BY_SLUG.keys()];

/**
 * Projects most related to `project`, for the "Related projects" rail. Ranked by
 * shared developer (strongest), then area, then city; the project itself is
 * excluded and only genuine matches (score > 0) are returned. Ties keep dataset
 * order, so results are deterministic at build time.
 */
export function relatedProjects(project: Project, limit = 3): Project[] {
  const score = (p: Project) =>
    (p.dev === project.dev ? 4 : 0) +
    (p.area === project.area ? 2 : 0) +
    (p.city === project.city ? 1 : 0);

  return PROJECTS.filter((p) => p.name !== project.name)
    .map((p) => ({ p, s: score(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.p);
}

// ---- Derived helpers (categories are the source of truth) ----

/** Project types as an array (handles single or mixed-use projects). */
export function typesOf(p: Project): ProjectType[] {
  return Array.isArray(p.type) ? p.type : [p.type];
}

// Unit configurations grouped by family, in the order they appear in the
// filter dropdown. The flattened list is also the canonical sort order.
const CONFIG_GROUPS: { group: UnitConfigGroup; configs: UnitConfig[] }[] = [
  {
    group: "Residential",
    configs: ["Studio", "1 Bed", "2 Bed", "3 Bed", "4 Bed", "Penthouse"],
  },
  {
    group: "Commercial",
    configs: ["Corporate Office", "Shop", "Showroom", "Kiosk", "Food Court", "Outlet"],
  },
];
const CONFIG_ORDER: UnitConfig[] = CONFIG_GROUPS.flatMap((g) => g.configs);

/**
 * Unit configurations a project offers, parsed from its category names/groups
 * (the source of truth for layouts). Residential: "Studio", "N Bed"/"N BHK"
 * and "Penthouse" (a "3 Bed Penthouse" counts as both "3 Bed" and "Penthouse").
 * Commercial: office, shop, showroom, kiosk, food court and outlet units.
 */
export function configsOf(p: Project): UnitConfig[] {
  const found = new Set<UnitConfig>();
  for (const c of p.categories) {
    const s = `${c.group ?? ""} ${c.name}`;
    // Residential layouts
    if (/studio/i.test(s)) found.add("Studio");
    if (/penthouse/i.test(s)) found.add("Penthouse");
    for (const m of s.matchAll(/(\d+)\s*(?:bed|bhk)\b/gi)) {
      const key = `${m[1]} Bed` as UnitConfig;
      if (CONFIG_ORDER.includes(key)) found.add(key);
    }
    // Commercial unit types
    if (/office/i.test(s)) found.add("Corporate Office");
    if (/showroom/i.test(s)) found.add("Showroom");
    if (/shop/i.test(s)) found.add("Shop");
    if (/kiosk/i.test(s)) found.add("Kiosk");
    // "eArena" / "Dine Arena" is Curve's dining floor — treat as a food court.
    if (/food court|arena|dine/i.test(s)) found.add("Food Court");
    if (/outlet/i.test(s)) found.add("Outlet");
  }
  return CONFIG_ORDER.filter((k) => found.has(k));
}

// Words that name the kind of unit a project sells but rarely appear verbatim
// in its category labels. A commercial project's ground floor is, in a buyer's
// words, "shops" / "retail" even when the developer calls it "Commercial
// Outlet" (Zalmi X) or "Ground & Mezzanine" (Curve) — so we fold those synonyms
// into the searchable text of every Commercial project.
const COMMERCIAL_SYNONYMS = ["shop", "shops", "retail", "store", "outlet"];

/**
 * The lowercased blob a free-text search is matched against. Beyond the obvious
 * name/developer/location, it folds in the project's types, derived unit
 * configs, raw category labels, and retail synonyms for commercial projects, so
 * a search like "shops on pine avenue road" finds every commercial tower there
 * — not just the ones whose categories literally spell out "shop".
 */
export function searchText(p: Project): string {
  const parts: string[] = [p.name, p.dev, p.city, p.area];
  parts.push(...typesOf(p));
  parts.push(...configsOf(p));
  for (const c of p.categories) parts.push(c.group ?? "", c.name);
  if (typesOf(p).includes("Commercial")) parts.push(...COMMERCIAL_SYNONYMS);
  return parts.join(" ").toLowerCase();
}

/** Lowest per-sqft rate across a project's categories. */
export function lowestRate(p: Project): number {
  return Math.min(...p.categories.map((c) => c.rate));
}

/** Cheapest possible total price (PKR) · smallest size of the cheapest entry. */
export function lowestTotal(p: Project): number {
  return Math.min(...p.categories.map((c) => Math.min(...c.sizes) * c.rate));
}

/** The sqft size of the cheapest unit · i.e. the size the entry price is for. */
export function entrySize(p: Project): number {
  let best = Infinity;
  let size = 0;
  for (const c of p.categories) {
    for (const s of c.sizes) {
      const total = s * c.rate;
      if (total < best) {
        best = total;
        size = s;
      }
    }
  }
  return size;
}

/** Most expensive total price (PKR) across all categories & sizes. */
export function highestTotal(p: Project): number {
  return Math.max(...p.categories.map((c) => Math.max(...c.sizes) * c.rate));
}

/** Entry price in millions · used by the budget filter. */
export function entryPriceMillions(p: Project): number {
  return lowestTotal(p) / 1_000_000;
}

// Milestones whose label marks a back-loaded payment (due at/near possession,
// not part of the upfront cash a prospect needs to book). These are excluded
// from the down-payment figure, and held fixed when a custom down payment is
// redistributed across the installments (see lib/customPlan).
export const BACKLOADED_MILESTONE = /possession|completion|grey structure|handover|final/i;

/**
 * Fraction of a unit's total price due upfront to book it · the lump-sum
 * milestones (booking + down payment + confirmation, etc.), excluding payments
 * back-loaded to possession/completion. Constant across a project's units, so
 * any unit's down payment is its price times this.
 */
export function downPaymentFraction(p: Project): number {
  const pct = p.plan.milestones
    .filter((m) => !BACKLOADED_MILESTONE.test(m.label))
    .reduce((sum, m) => sum + m.pct, 0);
  return pct / 100;
}

/** Upfront down payment (PKR) for the cheapest entry unit. */
export function entryDownPayment(p: Project): number {
  return lowestTotal(p) * downPaymentFraction(p);
}

/** Entry down payment in millions · used by the down-payment budget filter. */
export function entryDownPaymentMillions(p: Project): number {
  return entryDownPayment(p) / 1_000_000;
}

// Months between payments for a recurring stream, inferred from its label/note.
// "month" is checked first so a monthly stream split across years (e.g.
// "Monthly instalment · Year 1") isn't mistaken for a yearly one.
export function cadenceMonths(ins: Installment): number {
  const s = `${ins.label} ${ins.note ?? ""}`.toLowerCase();
  if (/month/.test(s)) return 1;
  if (/quarter/.test(s)) return 3;
  if (/bi-?annual|biannual|half-?year/.test(s)) return 6;
  if (/year|annual/.test(s)) return 12;
  return 1; // default to monthly cadence
}

/**
 * Monthly installment (PKR) for the cheapest entry unit. Prefers the project's
 * actual monthly installment line; for schedules without one (e.g. quarterly),
 * the most frequent recurring stream is normalised to a per-month figure so
 * every project compares on the same basis. One-off balloon lump sums are
 * excluded — they aren't part of the steady monthly burden. 0 if no recurring
 * installments exist.
 */
export function monthlyInstallmentFraction(p: Project): number {
  const recurring = p.plan.installments.filter(
    (ins) => !/balloon/i.test(ins.label)
  );
  if (recurring.length === 0) return 0;
  const monthly = recurring.filter((ins) => cadenceMonths(ins) === 1);
  const pool = monthly.length > 0 ? monthly : recurring;
  return Math.max(...pool.map((ins) => ins.pct / 100 / cadenceMonths(ins)));
}

/** Monthly installment (PKR) for the cheapest entry unit. */
export function entryMonthlyInstallment(p: Project): number {
  return lowestTotal(p) * monthlyInstallmentFraction(p);
}

// Fallback cover used until a project gets its own photo (set `img` on the row).
export const DEFAULT_PROJECT_IMG = "/images/hero-tower.jpg";

// Cities, with Lahore (the home market) pinned first and the rest sorted.
export const CITIES = [
  ...new Set(PROJECTS.map((p) => p.city)),
].sort((a, b) =>
  a === "Lahore" ? -1 : b === "Lahore" ? 1 : a.localeCompare(b)
);
export const AREAS = [...new Set(PROJECTS.map((p) => p.area))].sort();
export const TYPES = [...new Set(PROJECTS.flatMap(typesOf))].sort();
// Unit configurations offered across all projects, grouped (Residential /
// Commercial) for the dropdown. Only families/configs actually present in the
// data are listed, so empty groups never render.
const PRESENT_CONFIGS = new Set(PROJECTS.flatMap(configsOf));
export const CONFIG_OPTIONS: { group: UnitConfigGroup; configs: UnitConfig[] }[] =
  CONFIG_GROUPS.map((g) => ({
    group: g.group,
    configs: g.configs.filter((c) => PRESENT_CONFIGS.has(c)),
  })).filter((g) => g.configs.length > 0);
export const POSSESSION_YEARS = [...new Set(PROJECTS.map((p) => p.poss))].sort();

// Budget slider runs from the cheapest entry up to a fixed PKR 200 M ceiling.
export const MIN_ENTRY_PRICE = Math.floor(
  Math.min(...PROJECTS.map(entryPriceMillions))
);
export const MAX_ENTRY_PRICE = 200;

// Down-payment slider runs from the smallest entry down payment up to the
// largest, rounded out to clean half-million steps (PKR millions).
export const MIN_DOWN_PAYMENT =
  Math.floor(Math.min(...PROJECTS.map(entryDownPaymentMillions)) * 2) / 2;
export const MAX_DOWN_PAYMENT =
  Math.ceil(Math.max(...PROJECTS.map(entryDownPaymentMillions)) * 2) / 2;

// Monthly-installment slider (raw PKR), snapped out to clean 10k steps.
export const MONTHLY_STEP = 10_000;
export const MIN_MONTHLY =
  Math.floor(Math.min(...PROJECTS.map(entryMonthlyInstallment)) / MONTHLY_STEP) *
  MONTHLY_STEP;
export const MAX_MONTHLY =
  Math.ceil(Math.max(...PROJECTS.map(entryMonthlyInstallment)) / MONTHLY_STEP) *
  MONTHLY_STEP;

// Hero stat: overall price band across every project/category/size (PKR M).
export const PRICE_BAND_MIN =
  Math.round(Math.min(...PROJECTS.map(lowestTotal)) / 100_000) / 10;
export const PRICE_BAND_MAX = Math.round(
  Math.max(...PROJECTS.map(highestTotal)) / 1_000_000
);

// ---------------------------------------------------------------------------
// Budget matching · single source of truth shared by the grid filter and the
// card's "from" price. A buyer's budget is matched at the UNIT level (one size
// of one category), not against the project's single entry price — so a project
// with units inside the range still shows even when its cheapest unit sits
// below the floor, and the card advertises the cheapest unit that actually fits
// the range rather than one the buyer ruled out.
// ---------------------------------------------------------------------------

/** The active budget window · the slider state the matchers care about. */
export type BudgetFilter = {
  budgetMode: "price" | "down";
  minEntryPrice: number; // millions
  maxEntryPrice: number; // millions
  minDownPayment: number; // millions
  maxDownPayment: number; // millions
  minMonthly: number; // raw PKR
  maxMonthly: number; // raw PKR
};

/** Every purchasable unit · one size from one category, with its total price. */
export function projectUnits(p: Project): { price: number; size: number }[] {
  const out: { price: number; size: number }[] = [];
  for (const c of p.categories) {
    for (const s of c.sizes) out.push({ price: s * c.rate, size: s });
  }
  return out;
}

/**
 * Does a unit at this total price (PKR) fall inside the budget window? Down
 * payment and monthly installment scale linearly with the total, so each is the
 * price times the project's fixed fraction. A max sitting at the slider ceiling
 * means "and up" — no upper bound. The lower bound always applies.
 */
export function unitInBudget(p: Project, price: number, b: BudgetFilter): boolean {
  if (b.budgetMode === "down") {
    const d = (price * downPaymentFraction(p)) / 1_000_000;
    if (d < b.minDownPayment) return false;
    if (b.maxDownPayment < MAX_DOWN_PAYMENT && d > b.maxDownPayment) return false;
  } else {
    const e = price / 1_000_000;
    if (e < b.minEntryPrice) return false;
    if (b.maxEntryPrice < MAX_ENTRY_PRICE && e > b.maxEntryPrice) return false;
  }
  const m = price * monthlyInstallmentFraction(p);
  if (m < b.minMonthly) return false;
  if (b.maxMonthly < MAX_MONTHLY && m > b.maxMonthly) return false;
  return true;
}

/** A project matches the budget when at least one of its units fits the window. */
export function matchesBudget(p: Project, b: BudgetFilter): boolean {
  return projectUnits(p).some((u) => unitInBudget(p, u.price, b));
}

/**
 * The cheapest unit that fits the budget window — its price (millions) and
 * size — for the card's "from" line. Falls back to the absolute cheapest unit
 * when nothing fits (e.g. no budget set, or the project is shown for a
 * non-budget reason), so the card always has something to show.
 */
export function entryInBudget(
  p: Project,
  b: BudgetFilter
): { millions: number; size: number } {
  const units = projectUnits(p);
  const fitting = units.filter((u) => unitInBudget(p, u.price, b));
  const pool = fitting.length > 0 ? fitting : units;
  const cheapest = pool.reduce((a, u) => (u.price < a.price ? u : a));
  return { millions: cheapest.price / 1_000_000, size: cheapest.size };
}
