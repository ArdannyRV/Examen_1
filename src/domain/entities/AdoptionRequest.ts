export interface AdoptionRequest {
  id: string;
  pet_id: string;
  adoptante_id: string;
  status: 'pendiente' | 'aprobada' | 'rechazada';
  pet_name?: string;
  pet_breed?: string;
  adoptante_name?: string;
  adoptante_experience?: string;
}
