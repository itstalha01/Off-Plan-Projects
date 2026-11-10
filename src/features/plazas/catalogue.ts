export const LAHORE_PLAZAS_PATH = "/commercial-plazas/lahore";
export const LAHORE_PLAZAS_URL = `https://clearstoreys.com${LAHORE_PLAZAS_PATH}`;

const TALWAR_CHOWK_VIDEO_URL = "https://youtube.com/shorts/kfXgdGIhpMk?feature=share";

export const LAHORE_PLAZAS = [
  {
    slug: "bahria-town-talwar-chowk",
    name: "Talwar Chowk Commercial Plaza",
    area: "Bahria Town, Lahore",
    whatsappNumber: "923077342438",
    floors: 6,
    sizeMarla: 5.3,
    askingPricePkr: 240_000_000,
    monthlyRentEstimatePkr: { min: 1_200_000, max: 1_400_000 },
    mapUrl: "https://maps.app.goo.gl/PAgfUjPSrrqw2KBv9",
    videoUrl: TALWAR_CHOWK_VIDEO_URL,
    photo: {
      src: "/images/plazas/bahria-town-talwar-chowk/for-sale-poster.jpg",
      alt: "Gloria Jean’s Plaza for sale in Talwar Chowk, Bahria Town, Lahore. 5.3 marla, 6 floors, PKR 24 crore, with estimated monthly rent of PKR 12–14 lakh.",
    },
    logo: {
      src: "/images/plazas/bahria-town-talwar-chowk/gloria-jeans.png",
      alt: "Gloria Jean’s Coffees",
      width: 1974,
      height: 432,
      sourceUrl: "https://gloriajeanscoffees.com.pk/",
    },
  },
  {
    slug: "pine-avenue-road",
    name: "Main Pine Avenue Commercial Plaza",
    area: "Main Pine Avenue Road, Lahore",
    sizeMarla: 10,
    description: "The whole plaza is for sale in grey-structure condition. The concept render illustrates a possible single-tenant restaurant layout.",
    askingPricePkr: 420_000_000,
    monthlyRentEstimatePkr: { min: 2_400_000, max: 2_400_000 },
    mapUrl: "https://maps.app.goo.gl/kdNzDjD8RT9KVXDp8",
    videoUrl: "https://youtube.com/shorts/EBRLjOR_Aq0?feature=share",
    photo: {
      src: "/images/plazas/pine-avenue-road/restaurant-concept.jpg",
      alt: "Concept render of the Pine Avenue plaza as a single-tenant restaurant",
    },
  },
  {
    slug: "mei-kong",
    name: "Mei Kong Commercial Plaza",
    area: "Bahria Town, Lahore",
    whatsappNumber: "923077342438",
    sizeMarla: 5.3,
    description: "A corner commercial plaza with the Mei Kong restaurant at street level. The poster previews the façade after painting.",
    askingPricePkr: 220_000_000,
    monthlyRentEstimatePkr: { min: 1_000_000, max: 1_000_000 },
    mapUrl: "https://maps.app.goo.gl/1UzAdGcRBDZUkzHb6",
    photo: {
      src: "/images/plazas/mei-kong/poster-red-yellow.jpg",
      alt: "Mei Kong plaza poster previewing the repainted beige façade above the red restaurant signage",
    },
  },
];

export function lahorePlazaPath(slug: string) {
  return `${LAHORE_PLAZAS_PATH}/${slug}`;
}

export function lahorePlazaUrl(slug: string) {
  return `${LAHORE_PLAZAS_URL}/${slug}`;
}
