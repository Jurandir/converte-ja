export type Unit = { label: string; value: string };

export type Category = {
  id: string;
  name: string;
  icon: string;
  units: Unit[];
  convert: (value: number, from: string, to: string) => number;
};

// ── helpers ─────────────────────────────────────────────────────────────────

function linearConvert(
  value: number,
  from: string,
  to: string,
  toBase: Record<string, number>
): number {
  const baseValue = value * toBase[from];
  return baseValue / toBase[to];
}

// ── categories ───────────────────────────────────────────────────────────────

const distanceToBase: Record<string, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  ft: 0.3048,
  in: 0.0254,
  yd: 0.9144,
};

const massToBase: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  t: 1000,
  lb: 0.453592,
  oz: 0.0283495,
};

const volumeToBase: Record<string, number> = {
  l: 1,
  ml: 0.001,
  m3: 1000,
  gal: 3.78541,
  pt: 0.473176,
  floz: 0.0295735,
};

const areaToBase: Record<string, number> = {
  m2: 1,
  km2: 1e6,
  cm2: 0.0001,
  ha: 10000,
  ac: 4046.86,
  ft2: 0.092903,
};

const speedToBase: Record<string, number> = {
  'km/h': 1,
  'm/s': 3.6,
  mph: 1.60934,
  kn: 1.852,
};

const timeToBase: Record<string, number> = {
  s: 1,
  min: 60,
  h: 3600,
  d: 86400,
  wk: 604800,
  mo: 2629800,
  yr: 31557600,
};

const pressureToBase: Record<string, number> = {
  Pa: 1,
  bar: 100000,
  psi: 6894.76,
  atm: 101325,
};

const energyToBase: Record<string, number> = {
  J: 1,
  kJ: 1000,
  cal: 4.184,
  kcal: 4184,
  kWh: 3600000,
};

const dataToBase: Record<string, number> = {
  bit: 1,
  B: 8,
  KB: 8192,
  MB: 8388608,
  GB: 8589934592,
  TB: 8796093022208,
};

function convertTemp(value: number, from: string, to: string): number {
  let celsius: number;
  switch (from) {
    case 'C': celsius = value; break;
    case 'F': celsius = (value - 32) * 5 / 9; break;
    case 'K': celsius = value - 273.15; break;
    default: celsius = value;
  }
  switch (to) {
    case 'C': return celsius;
    case 'F': return celsius * 9 / 5 + 32;
    case 'K': return celsius + 273.15;
    default: return celsius;
  }
}

// ── exported list ─────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: 'distance',
    name: 'Distância',
    icon: '📏',
    units: [
      { label: 'Quilômetro (km)', value: 'km' },
      { label: 'Metro (m)', value: 'm' },
      { label: 'Centímetro (cm)', value: 'cm' },
      { label: 'Milímetro (mm)', value: 'mm' },
      { label: 'Milha (mi)', value: 'mi' },
      { label: 'Pé (ft)', value: 'ft' },
      { label: 'Polegada (in)', value: 'in' },
      { label: 'Jarda (yd)', value: 'yd' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, distanceToBase),
  },
  {
    id: 'mass',
    name: 'Massa',
    icon: '⚖️',
    units: [
      { label: 'Quilograma (kg)', value: 'kg' },
      { label: 'Grama (g)', value: 'g' },
      { label: 'Miligrama (mg)', value: 'mg' },
      { label: 'Tonelada (t)', value: 't' },
      { label: 'Libra (lb)', value: 'lb' },
      { label: 'Onça (oz)', value: 'oz' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, massToBase),
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: '🧪',
    units: [
      { label: 'Litro (L)', value: 'l' },
      { label: 'Mililitro (mL)', value: 'ml' },
      { label: 'Metro cúbico (m³)', value: 'm3' },
      { label: 'Galão (gal)', value: 'gal' },
      { label: 'Pint (pt)', value: 'pt' },
      { label: 'Fl oz', value: 'floz' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, volumeToBase),
  },
  {
    id: 'area',
    name: 'Área',
    icon: '📐',
    units: [
      { label: 'Metro quadrado (m²)', value: 'm2' },
      { label: 'Quilômetro quadrado (km²)', value: 'km2' },
      { label: 'Centímetro quadrado (cm²)', value: 'cm2' },
      { label: 'Hectare (ha)', value: 'ha' },
      { label: 'Acre (ac)', value: 'ac' },
      { label: 'Pé quadrado (ft²)', value: 'ft2' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, areaToBase),
  },
  {
    id: 'temperature',
    name: 'Temperatura',
    icon: '🌡️',
    units: [
      { label: 'Celsius (°C)', value: 'C' },
      { label: 'Fahrenheit (°F)', value: 'F' },
      { label: 'Kelvin (K)', value: 'K' },
    ],
    convert: convertTemp,
  },
  {
    id: 'speed',
    name: 'Velocidade',
    icon: '💨',
    units: [
      { label: 'Km/h', value: 'km/h' },
      { label: 'Metro/s (m/s)', value: 'm/s' },
      { label: 'Milha/h (mph)', value: 'mph' },
      { label: 'Nó (kn)', value: 'kn' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, speedToBase),
  },
  {
    id: 'time',
    name: 'Tempo',
    icon: '⏱️',
    units: [
      { label: 'Segundo (s)', value: 's' },
      { label: 'Minuto (min)', value: 'min' },
      { label: 'Hora (h)', value: 'h' },
      { label: 'Dia (d)', value: 'd' },
      { label: 'Semana (sem)', value: 'wk' },
      { label: 'Mês (mês)', value: 'mo' },
      { label: 'Ano (ano)', value: 'yr' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, timeToBase),
  },
  {
    id: 'pressure',
    name: 'Pressão',
    icon: '🔵',
    units: [
      { label: 'Pascal (Pa)', value: 'Pa' },
      { label: 'Bar', value: 'bar' },
      { label: 'PSI', value: 'psi' },
      { label: 'Atmosfera (atm)', value: 'atm' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, pressureToBase),
  },
  {
    id: 'energy',
    name: 'Energia',
    icon: '⚡',
    units: [
      { label: 'Joule (J)', value: 'J' },
      { label: 'Quilojoule (kJ)', value: 'kJ' },
      { label: 'Caloria (cal)', value: 'cal' },
      { label: 'Quilocaloria (kcal)', value: 'kcal' },
      { label: 'Quilowatt-hora (kWh)', value: 'kWh' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, energyToBase),
  },
  {
    id: 'data',
    name: 'Dados Digitais',
    icon: '💾',
    units: [
      { label: 'Bit', value: 'bit' },
      { label: 'Byte (B)', value: 'B' },
      { label: 'Kilobyte (KB)', value: 'KB' },
      { label: 'Megabyte (MB)', value: 'MB' },
      { label: 'Gigabyte (GB)', value: 'GB' },
      { label: 'Terabyte (TB)', value: 'TB' },
    ],
    convert: (v, f, t) => linearConvert(v, f, t, dataToBase),
  },
];
