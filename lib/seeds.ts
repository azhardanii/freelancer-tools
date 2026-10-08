export interface SeedData {
  label: string;
  unit: string;
  estHoursPerUnit: number;
  low: number | null;
  high: number | null;
  researchedAt: string | null;
  examples?: string[];
}

export const seeds: Record<string, SeedData> = {
  video_editing: {
    label: 'Editing video pendek (Reels / TikTok / Shorts)',
    unit: 'per video',
    estHoursPerUnit: 2.5,
    low: 100_000,
    high: 350_000,
    researchedAt: '2026-10-08',
    examples: ['video editing', 'reels', 'tiktok', 'youtube shorts', 'editor video', 'cut to cut', 'reels umkm'],
  },
  graphic_design: {
    label: 'Desain grafis (Social Media / Feed / Banner)',
    unit: 'per desain',
    estHoursPerUnit: 2.0,
    low: 75_000,
    high: 250_000,
    researchedAt: '2026-10-08',
    examples: ['desain grafis', 'post instagram', 'feed ig', 'banner', 'poster', 'thumbnail', 'flyer'],
  },
  web_dev: {
    label: 'Landing page / web',
    unit: 'per landing page',
    estHoursPerUnit: 20,
    low: 1_200_000,
    high: 4_500_000,
    researchedAt: '2026-10-08',
    examples: ['coding web', 'landing page', 'bikin website', 'web development', 'frontend', 'wordpress', 'web umkm'],
  },
  data_entry: {
    label: 'Data entry',
    unit: 'per 100 baris',
    estHoursPerUnit: 1.0,
    low: 35_000,
    high: 100_000,
    researchedAt: '2026-10-08',
    examples: ['data entry', 'input data', 'rekap excel', 'input produk', 'data cleaning', 'spreadsheet'],
  },
  copywriting: {
    label: 'Copywriting (Caption / Konten)',
    unit: 'per konten',
    estHoursPerUnit: 1.5,
    low: 60_000,
    high: 200_000,
    researchedAt: '2026-10-08',
    examples: ['copywriting', 'caption sosmed', 'konten caption', 'naskah video', 'artikel blog', 'sales copy'],
  },
};

/**
 * Helper to match user service input against seed categories
 */
export function matchSeedCategory(serviceInput: string): string | null {
  const normalized = serviceInput.toLowerCase().trim();
  for (const [key, seed] of Object.entries(seeds)) {
    if (normalized.includes(key)) return key;
    if (seed.examples) {
      for (const ex of seed.examples) {
        if (normalized.includes(ex.toLowerCase())) {
          return key;
        }
      }
    }
  }
  return null;
}
