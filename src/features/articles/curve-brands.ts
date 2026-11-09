export const CURVE_ARTICLE_PATH = "/articles/curve-brands-pine-avenue";
export const CURVE_PROJECT_PATH = "/projects/curve-pine-avenue-downtown";
export const CURVE_ARTICLE_TITLE = "Curve Pine Avenue Lahore: 5 Major Brands Sign MOUs (Project Review)";
export const CURVE_ARTICLE_DESCRIPTION = "Review Curve Pine Avenue Lahore by HF Developers: its five-brand MOU lineup, planned food outlets, location and access from nearby residential communities.";

// Original brand assets, downloaded from each official site or its linked CDN.
// Keep the visible credits and asset provenance together when updating a logo.
export const CURVE_BRANDS = [
  {
    id: "rinas",
    name: "Rina’s Kitchenette",
    category: "Café & comfort food",
    logo: "/images/articles/curve-brands/rinas.webp",
    website: "https://rinas.pk/",
    source: "https://assets.ordrz.store/images/44bd4f12-f613-49c7-8e6c-339ef67c32b0/processed.webp",
    background: "#343b36",
    heading: "A familiar favourite, a fresh address.",
    description: "Comfort food, café favourites and custom cakes give Rina’s a place in both everyday plans and celebrations. Its inclusion in Curve’s MOU lineup adds a familiar Lahore name to the project’s emerging food offering.",
  },
  {
    id: "bagh",
    name: "Bagh Restaurant",
    category: "Pakistani dining",
    logo: "/images/articles/curve-brands/bagh.webp",
    website: "https://baghrestaurant.ordrz.com/",
    source: "https://static.tossdown.com/images/77b08522-2d0d-45c8-ad0c-4154b17296ee.webp",
    background: "#233d32",
    heading: "A place to gather around the table.",
    description: "With a menu spanning Pakistani favourites, tandoori dishes and shared meals, Bagh brings a family-dining dimension to the lineup. HF Developers also names Bagh in its published discussion of Curve’s tenants.",
  },
  {
    id: "bonbird",
    name: "BonBird",
    category: "Fried chicken & burgers",
    logo: "/images/articles/curve-brands/bonbird.png",
    website: "https://bonbirdchicken.com/pk/",
    source: "https://bonbirdchicken.com/wp-content/uploads/2025/05/Bonbird-Logo-English.png",
    background: "#fff5dc",
    heading: "A different pace of dining.",
    description: "BonBird’s Pakistan menu centres on fried chicken, tenders, burgers and sharing bundles. Alongside sit-down restaurants and cafés, that fast-casual format could widen the reasons people choose to visit Curve.",
  },
  {
    id: "js-bank",
    name: "JS Bank",
    category: "Banking & financial services",
    logo: "/images/articles/curve-brands/js-bank.webp",
    website: "https://www.jsbl.com/",
    source: "https://www.jsbl.com/wp-content/uploads/2024/07/JS-logo-blue.webp",
    background: "#f5f7fc",
    heading: "An everyday purpose beyond dining.",
    description: "JS Bank adds a financial-services name to a largely food-led lineup. Its participation points towards a broader commercial mix; the exact services and format planned for Curve remain to be announced.",
  },
  {
    id: "contra",
    name: "Contra Coffee",
    category: "Speciality coffee & all-day breakfast",
    logo: "/images/articles/curve-brands/contra.png",
    website: "https://contracoffee.pk/",
    source: "https://contracoffee.pk/brand/contra-logo.png",
    background: "#faf4e9",
    heading: "Coffee gives people a reason to linger.",
    description: "Speciality coffee, breakfast and bakes make Contra a natural part of a social destination. HF Developers publicly identifies Contra as a Curve tenant, adding a café-led experience to the project’s planned mix.",
  },
] as const;

export const CURVE_SOURCES = {
  developer: "https://hfdevelopers.com/about/",
  project: "https://hfdevelopers.com/projects/curve/",
  location: "https://hfdevelopers.com/pine-avenue/",
  tenants: "https://hfdevelopers.com/why-you-should-open-your-business-in-hf-tower-2/",
};
