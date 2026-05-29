import { AdoptionRequest } from '../entities/AdoptionRequest';

export interface IRequestRepository {
  getByAdoptante(adoptanteId: string): Promise<AdoptionRequest[]>;
  getByRefugio(refugioId: string): Promise<AdoptionRequest[]>;
  getRequests(userId: string, role: string): Promise<any[]>;
  create(request: Omit<AdoptionRequest, 'id'>): Promise<AdoptionRequest>;
  updateStatus(id: string, status: 'pendiente' | 'aprobada' | 'rechazada'): Promise<void>;
  createRequest(petId: string, adoptanteId: string): Promise<void>;
  updateRequestStatus(requestId: string, newStatus: 'aprobada' | 'rechazada'): Promise<void>;
}
