export interface Pet {
  id: string;
  refugio_id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  size: 'pequeño' | 'mediano' | 'grande';
  description: string;
  image_url?: string;
}
