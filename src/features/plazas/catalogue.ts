export const LAHORE_PLAZAS_PATH = "/commercial-plazas/lahore";
export const LAHORE_PLAZAS_URL = `https://clearstoreys.com${LAHORE_PLAZAS_PATH}`;

const TALWAR_CHOWK_VIDEO_URL = "https://youtube.com/shorts/kfXgdGIhpMk?feature=share";

export const LAHORE_PLAZAS = [
  {
    slug: "bahria-town-talwar-chowk",
    name: "Talwar Chowk Commercial Plaza",
    area: "Bahria Town, Lahore",
    floors: 6,
    sizeMarla: 5.3,
    askingPricePkr: 240_000_000,
    monthlyRentEstimatePkr: { min: 1_200_000, max: 1_400_000 },
    mapUrl: "https://maps.app.goo.gl/PAgfUjPSrrqw2KBv9",
    videoUrl: TALWAR_CHOWK_VIDEO_URL,
    photo: {
      src: "/images/plazas/bahria-town-talwar-chowk/frontage.jpg",
      alt: "Talwar Chowk plaza frontage above the Gloria Jean’s storefront",
      sourceUrl: TALWAR_CHOWK_VIDEO_URL,
    },
    logo: {
      src: "/images/plazas/bahria-town-talwar-chowk/gloria-jeans.png",
      alt: "Gloria Jean’s Coffees",
      width: 1974,
      height: 432,
      sourceUrl: "https://gloriajeanscoffees.com.pk/",
    },
  },
];

export function lahorePlazaPath(slug: string) {
  return `${LAHORE_PLAZAS_PATH}/${slug}`;
}

export function lahorePlazaUrl(slug: string) {
  return `${LAHORE_PLAZAS_URL}/${slug}`;
}
