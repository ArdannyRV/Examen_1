import { IRequestRepository } from '../../domain/repositories/IRequestRepository';
import { AdoptionRequest } from '../../domain/entities/AdoptionRequest';
import { supabase } from '../sources/supabaseClient';

export class RequestRepositoryImpl implements IRequestRepository {
  async getByAdoptante(adoptanteId: string): Promise<AdoptionRequest[]> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pet:pets(*)')
      .eq('adoptante_id', adoptanteId);

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.mapRequest);
  }

  async getByRefugio(refugioId: string): Promise<AdoptionRequest[]> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pet:pets!inner(*), adoptante:profiles!adoptante_id(*)')
      .eq('pets.refugio_id', refugioId);

    if (error) throw new Error(error.message);
    return (data ?? []).map(this.mapRequest);
  }

  async getRequests(userId: string, role: string): Promise<any[]> {
    if (role === 'adoptante') {
      const { data, error } = await supabase
        .from('adoption_requests')
        .select('*, pet:pets(*)')
        .eq('adoptante_id', userId);

      if (error) throw new Error(error.message);
      return data ?? [];
    }

    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pet:pets!inner(*), adoptante:profiles!adoptante_id(*)')
      .eq('pets.refugio_id', userId);

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  async create(request: Omit<AdoptionRequest, 'id'>): Promise<AdoptionRequest> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .insert(request)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return this.mapRequest(data);
  }

  async updateStatus(id: string, status: 'pendiente' | 'aprobada' | 'rechazada'): Promise<void> {
    const { error } = await supabase
      .from('adoption_requests')
      .update({ status })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  async createRequest(petId: string, adoptanteId: string): Promise<void> {
    const { error } = await supabase
      .from('adoption_requests')
      .insert({ pet_id: petId, adoptante_id: adoptanteId, status: 'pendiente' });

    if (error) throw new Error(error.message);
  }

  async updateRequestStatus(requestId: string, newStatus: 'aprobada' | 'rechazada'): Promise<void> {
    const { error } = await supabase
      .from('adoption_requests')
      .update({ status: newStatus })
      .eq('id', requestId);

    if (error) throw new Error(error.message);
  }

  private mapRequest(item: any): AdoptionRequest {
    return {
      id: item.id,
      pet_id: item.pet_id,
      adoptante_id: item.adoptante_id,
      status: item.status,
      pet_name: item.pet?.name,
      pet_breed: item.pet?.breed,
      adoptante_name: item.adoptante?.name,
      adoptante_experience: item.adoptante?.experience,
    };
  }
}
