export interface Pet {
  id: string;
  refugio_id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  size: 'Pequeño' | 'Mediano' | 'Grande';
  description: string;
  image_url?: string;
}
