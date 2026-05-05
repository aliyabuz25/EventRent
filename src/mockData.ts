import { Product, TeambuildingConcept } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'LED Screen P2.5 Indoor',
    category: 'LED Monitor',
    description: 'Yüksək keyfiyyətli qapalı məkan LED ekranı.',
    technicalSpecs: {
      'Resolution': 'P2.5',
      'Brightness': '1200 nits',
      'Refresh Rate': '3840Hz'
    },
    images: ['https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800'],
    tags: ['indoor', 'high-res', 'visual'],
    relatedProducts: ['4']
  },
  {
    id: '2',
    name: 'Line Array Səs Sistemi',
    category: 'Səs Sistemləri',
    description: 'Böyük tədbirlər üçün peşəkar səs sistemi.',
    technicalSpecs: {
      'Power': '10000W',
      'Coverage': '100m',
      'Components': '8x Tops, 4x Subs'
    },
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'],
    tags: ['outdoor', 'pro-audio', 'concert'],
    relatedProducts: ['5']
  },
  {
    id: '3',
    name: 'Moving Head Beam 230',
    category: 'İşıq Avadanlıqları',
    description: 'Dinamik səhnə işıqlandırması üçün peşəkar işıq.',
    technicalSpecs: {
      'Lamp': '7R 230W',
      'Control': 'DMX 512',
      'Weight': '17kg'
    },
    images: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800'],
    tags: ['stage', 'lighting', 'dynamic'],
    relatedProducts: ['6']
  },
  {
    id: '4',
    name: 'LED Screen P3.9 Outdoor',
    category: 'LED Monitor',
    description: 'Açıq hava tədbirləri üçün parlaq LED ekran.',
    technicalSpecs: {
      'Resolution': 'P3.9',
      'Brightness': '5500 nits',
      'IP Rating': 'IP65'
    },
    images: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800'],
    tags: ['outdoor', 'bright', 'visual'],
    relatedProducts: ['1']
  },
  {
    id: '5',
    name: 'Digital Mikşer Pultu',
    category: 'Səs Sistemləri',
    description: '32 kanallı peşəkar rəqəmsal mikşer.',
    technicalSpecs: {
      'Channels': '32',
      'Effects': 'Built-in DSP',
      'Connectivity': 'Dante/USB'
    },
    images: ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800'],
    tags: ['digital', 'audio', 'mixer'],
    relatedProducts: ['2']
  },
  {
    id: '6',
    name: 'LED Par 18x12W RGBW',
    category: 'İşıq Avadanlıqları',
    description: 'Rəngarəng səhnə boyama üçün LED par.',
    technicalSpecs: {
      'LEDs': '18x12W',
      'Colors': 'RGBW 4-in-1',
      'Beam Angle': '25°'
    },
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800'],
    tags: ['wash', 'lighting', 'led'],
    relatedProducts: ['3']
  },
  {
    id: '7',
    name: 'Səhnə Podiumu 2x1m',
    category: 'Podium',
    description: 'Modul tipli peşəkar səhnə podiumu.',
    technicalSpecs: {
      'Size': '2x1m',
      'Max Load': '750kg/m²',
      'Height': '20cm - 100cm'
    },
    images: ['https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800'],
    tags: ['stage', 'podium', 'modular'],
    relatedProducts: ['8']
  },
  {
    id: '8',
    name: 'Alüminium Trust Sistemi',
    category: 'Trust – Ferma',
    description: 'Avadanlıqların asılması üçün möhkəm trust sistemi.',
    technicalSpecs: {
      'Material': 'Aluminum 6082-T6',
      'Type': 'Square 290mm',
      'Length': '3m sections'
    },
    images: ['https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=800'],
    tags: ['truss', 'support', 'aluminum'],
    relatedProducts: ['7']
  }
];

export const MOCK_CONCEPTS: TeambuildingConcept[] = [
  {
    id: 'c1',
    name: 'Survivor Challenge',
    description: 'Outdoor survival game with various physical and mental tasks.',
    participantCount: '20-100',
    isIndoor: false,
    purpose: 'Team Spirit',
    tags: ['active', 'outdoor', 'competitive']
  },
  {
    id: 'c2',
    name: 'Office Escape Room',
    description: 'Portable escape room experience for indoor office environments.',
    participantCount: '5-50',
    isIndoor: true,
    purpose: 'Problem Solving',
    tags: ['logic', 'indoor', 'cooperative']
  },
  {
    id: 'c3',
    name: 'Culinary Battle',
    description: 'Teams compete to create the best dish under professional guidance.',
    participantCount: '10-40',
    isIndoor: true,
    purpose: 'Creativity',
    tags: ['food', 'indoor', 'creative']
  },
  {
    id: 'c4',
    name: 'City Treasure Hunt',
    description: 'Interactive GPS-based treasure hunt through the city streets.',
    participantCount: '30-200',
    isIndoor: false,
    purpose: 'Exploration',
    tags: ['gps', 'outdoor', 'adventure']
  }
];
