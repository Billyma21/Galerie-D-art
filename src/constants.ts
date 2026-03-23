import { Work, Exhibition } from './types';

export const MOCK_WORKS: Work[] = [
  {
    id: '1',
    title: 'Éclat du Silence',
    year: 2024,
    collection: 'Murmures',
    technique: 'Huile sur toile',
    dimensions: '120 x 100 cm',
    description: 'Une exploration de la lumière dans le vide, capturant l\'instant précis où le silence devient visible.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1000',
    status: 'available',
    category: 'Abstrait',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Horizon Perdu',
    year: 2023,
    collection: 'Espaces',
    technique: 'Acrylique et pigments naturels',
    dimensions: '150 x 150 cm',
    description: 'La limite entre le ciel et la mer s\'efface pour laisser place à une méditation chromatique.',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1000',
    status: 'sold',
    category: 'Paysage',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Genèse',
    year: 2024,
    collection: 'Origines',
    technique: 'Technique mixte',
    dimensions: '80 x 80 cm',
    description: 'Le premier souffle de la création, traduit par des textures organiques et des contrastes profonds.',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1000',
    status: 'available',
    category: 'Abstrait',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Ombre Portée',
    year: 2022,
    collection: 'Murmures',
    technique: 'Fusain et huile',
    dimensions: '100 x 120 cm',
    description: 'Une étude sur la dualité de l\'être, entre présence et absence.',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=1000',
    status: 'exhibited',
    category: 'Portrait',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_EXHIBITIONS: Exhibition[] = [
  {
    id: 'e1',
    title: 'Lumières Intérieures',
    date: 'Mai 2024',
    location: 'Galerie Vivienne, Paris',
    description: 'Une exposition personnelle explorant la spiritualité à travers l\'abstraction.',
    isPast: false,
    imageUrl: 'https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?auto=format&fit=crop&q=80&w=1000',
  },
  {
    id: 'e2',
    title: 'Rétrospective 2020-2023',
    date: 'Décembre 2023',
    location: 'Musée d\'Art Moderne, Lyon',
    description: 'Trois années de recherche sur la matière et le mouvement.',
    isPast: true,
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=1000',
  }
];
