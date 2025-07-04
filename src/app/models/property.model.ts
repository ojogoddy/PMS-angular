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
    createdAt: string; 
    updatedAt: string; 
  }