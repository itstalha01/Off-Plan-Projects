export const SQFT_PER_MARLA = 225;
export const MARLA_PER_KANAL = 20;

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function sqftToMarla(sqft: number): number {
  return sqft / SQFT_PER_MARLA;
}

export function marlaKanalToSqft(kanal: number, marla: number): number {
  return round2((kanal * MARLA_PER_KANAL + marla) * SQFT_PER_MARLA);
}

export function marlaToKanalMarla(marla: number): { kanal: number; marla: number } {
  let kanal = Math.floor(marla / MARLA_PER_KANAL);
  let remainder = round2(marla - kanal * MARLA_PER_KANAL);

  // A remainder that rounds up to exactly 20 must carry into another Kanal
  // rather than display as "N Kanal 20 Marla".
  if (remainder >= MARLA_PER_KANAL) {
    kanal += 1;
    remainder = round2(remainder - MARLA_PER_KANAL);
  }

  return { kanal, marla: remainder };
}

export function formatSize(sqft: number): string {
  const marla = sqftToMarla(sqft);
  const { kanal, marla: remainder } = marlaToKanalMarla(marla);

  if (kanal === 0) return `${round2(marla)} Marla`;
  if (remainder === 0) return `${kanal} Kanal`;
  return `${kanal} Kanal ${remainder} Marla`;
}
