export interface User {
  id: string;
  email: string;
  name: string;
  role: 'adoptante' | 'refugio';
  location?: string;
  expo_push_token?: string;
}
