export interface Property {
    id: string;
    name: string;
    location: string;
  type: 'flat' | 'duplex' | 'bungalow' | 'commercial' | 'land';
    price: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    description: string;
    imageUrl?: string;
    createdAt: string; // ISO date string, e.g., '2025-06-30T14:00:00Z'
    updatedAt: string; // ISO date string
  }