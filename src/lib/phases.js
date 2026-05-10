// ─────────────────────────────────────────────────────────────────────────────
// Phase system — each era of the Beatles' career has a distinct visual identity.
// CSS custom properties are scoped to .phase-{id} on the page root.
// All five phases are defined here; Timeline and EventDetail read from this map.
// ─────────────────────────────────────────────────────────────────────────────

export const PHASES = {

  // ── ARCHIVE · 1962–63 ────────────────────────────────────────────────────
  // Editorial print annual. Cream paper, Playfair serif, deep red rules.
  archive: {
    id: 'archive',
    label: 'The Archive',
    sublabel: 'Liverpool & Beatlemania',
    years: '1962 – 1963',
    fonts: {
      display: '"Playfair Display", "Times New Roman", serif',
      body: '"Playfair Display", Georgia, serif',
      mono: '"JetBrains Mono", monospace',
    },
    weights: { display: 600, body: 400 },
    headlineCase: 'none',
    headlineSizePx: 92,
    headlineLineHeight: 0.95,
    headlineTracking: '-0.01em',
    decoration: 'asterisks',
  },

  // ── TRANSITIONAL · 1964–65 ────────────────────────────────────────────────
  // Rubber Soul sophistication. Warm tobacco/oxblood, Cormorant Garamond.
  transitional: {
    id: 'transitional',
    label: 'Transitional',
    sublabel: 'Sophistication',
    years: '1964 – 1965',
    fonts: {
      display: '"Cormorant Garamond", "Playfair Display", serif',
      body: '"Cormorant Garamond", Georgia, serif',
      mono: '"JetBrains Mono", monospace',
    },
    weights: { display: 500, body: 400 },
    headlineCase: 'none',
    headlineSizePx: 88,
    headlineLineHeight: 1.0,
    headlineTracking: '0em',
    decoration: 'rule',
  },

  // ── MOPTOP / MATURE SHIFT · 1966 ─────────────────────────────────────────
  // End of touring. High-contrast near-black, razor-clean Inter, one red accent.
  moptop: {
    id: 'moptop',
    label: 'Mature Shift',
    sublabel: 'End of the Tour',
    years: '1966',
    fonts: {
      display: '"Inter", -apple-system, sans-serif',
      body: '"Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    weights: { display: 700, body: 400 },
    headlineCase: 'uppercase',
    headlineSizePx: 84,
    headlineLineHeight: 0.92,
    headlineTracking: '-0.025em',
    decoration: 'line',
  },

  // ── PSYCHEDELIC · 1967 ────────────────────────────────────────────────────
  // Sgt. Pepper / MMT. MMT red bg, marigold sidebar, sky blue accent, Chicle.
  psychedelic: {
    id: 'psychedelic',
    label: 'Psychedelic',
    sublabel: 'Sgt. Pepper',
    years: '1967',
    fonts: {
      display: '"Chicle", cursive',
      body: '"Spicy Rice", serif',
      mono: '"JetBrains Mono", monospace',
    },
    weights: { display: 400, body: 400 },
    headlineCase: 'none',
    headlineSizePx: 110,
    headlineLineHeight: 0.92,
    headlineTracking: '0.005em',
    decoration: 'rainbow',
    mmtPalette: ['#FCC419', '#E37817', '#46BDE0', '#8FBFDB', '#ED1C24'],
  },

  // ── BOHEMIAN · 1968–71 ────────────────────────────────────────────────────
  // White Album minimalism. Oat/clay, Cormorant headlines, lots of space.
  bohemian: {
    id: 'bohemian',
    label: 'Bohemian',
    sublabel: 'The White Album',
    years: '1968 – 1971',
    fonts: {
      display: '"Cormorant Garamond", "Playfair Display", serif',
      body: '"Inter", -apple-system, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    weights: { display: 400, body: 300 },
    headlineCase: 'none',
    headlineSizePx: 96,
    headlineLineHeight: 0.95,
    headlineTracking: '-0.015em',
    decoration: 'line',
  },
};

// Map each year to a phase id
export const PHASE_FOR_YEAR = {
  1962: 'archive',      1963: 'archive',
  1964: 'transitional', 1965: 'transitional',
  1966: 'moptop',
  1967: 'psychedelic',
  1968: 'bohemian',     1969: 'bohemian',
  1970: 'bohemian',     1971: 'bohemian',
};

// Returns the full phase object for a given year
export const getPhaseForYear = (year) => PHASES[PHASE_FOR_YEAR[year] ?? 'archive'];

// Year written out as words — for the big editorial year title
export const YEAR_IN_WORDS = {
  1962: 'Nineteen Sixty-Two',
  1963: 'Nineteen Sixty-Three',
  1964: 'Nineteen Sixty-Four',
  1965: 'Nineteen Sixty-Five',
  1966: 'Nineteen Sixty-Six',
  1967: 'Nineteen Sixty-Seven',
  1968: 'Nineteen Sixty-Eight',
  1969: 'Nineteen Sixty-Nine',
  1970: 'Nineteen Seventy',
  1971: 'Nineteen Seventy-One',
};

// Chapter-style headlines for fully-developed years.
// headline = shown after the year number in the h1
// subheading = replaces YEAR_SUBTITLES for this year
// Falls back to YEAR_IN_WORDS + YEAR_SUBTITLES for years not in this map.
export const YEAR_CHAPTER_TITLES = {
  1963: {
    headline: 'Chart Success to Super Stardom',
    subheading: 'The Year Beatlemania Swept the Nation',
  },
};

// Short evocative year subtitles shown below the big year title
export const YEAR_SUBTITLES = {
  1962: 'Hamburg. The Cavern. Pete Best out, Ringo in. Love Me Do.',
  1963: 'Beatlemania erupts. Please Please Me. Ed Sullivan beckons.',
  1964: 'America falls. A Hard Day\'s Night. The world changes.',
  1965: 'Shea Stadium. Help! Royal honours. Songs growing up.',
  1966: 'The last tour. Revolver. The music outgrows the stadiums.',
  1967: 'The Summer of Love. Pepper. A satellite. A funeral.',
  1968: 'The White Album. Apple. India. A year of fractures.',
  1969: 'Let It Be. Abbey Road. Rooftop. The beginning of the end.',
  1970: 'The lawsuit. McCartney solo. Let It Be released. It\'s over.',
  1971: 'Imagine. Bangladesh. The Long and Winding Road in court.',
};

// Soft detail-page variants — cream paper for long-form reading
// These override --phase-* vars on the EventDetail root (.phase-X.phase-detail)
export const DETAIL_THEMES = {
  archive: {
    bg: '#F4ECDC', ink: '#1A1614', muted: '#6B5E4F', accent: '#A8231C',
    chipFill: '#EFE6D2', headerBg: '#1A1614', headerInk: '#F4ECDC',
    dropCap: '#A8231C', quoteRule: '2px solid #A8231C',
  },
  transitional: {
    bg: '#F1E6CF', ink: '#2A1D14', muted: '#7A5E3F', accent: '#9C3A1F',
    chipFill: '#E5D6B5', headerBg: '#3C2A1F', headerInk: '#F1E6CF',
    dropCap: '#9C3A1F', quoteRule: '1px solid #9C3A1F',
  },
  moptop: {
    bg: '#F5F5F0', ink: '#0E0E0E', muted: '#6a6a65', accent: '#C8102E',
    chipFill: '#EAEAE3', headerBg: '#0E0E0E', headerInk: '#F5F5F0',
    dropCap: '#C8102E', quoteRule: '2px solid #0E0E0E',
  },
  psychedelic: {
    bg: '#FFF6E0', ink: '#1a0a08', muted: '#7a4a1a', accent: '#ED1C24',
    chipFill: '#FCC419', headerBg: '#ED1C24', headerInk: '#FCC419',
    dropCap: '#ED1C24', quoteRule: '3px solid #ED1C24',
  },
  bohemian: {
    bg: '#F8F4EC', ink: '#1a1814', muted: '#7c7468', accent: '#3E5C3A',
    chipFill: '#EDE7DA', headerBg: '#1a1814', headerInk: '#F8F4EC',
    dropCap: '#3E5C3A', quoteRule: '1px solid #1a1814',
  },
};
