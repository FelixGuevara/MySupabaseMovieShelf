// types/db.ts
export type ProfileStatus = 'Active' | 'Inactive';
export type ProfileRole = 'Admin' | 'Enthusiast';

export type Profile = {
  id: string;              // uuid
  email: string;
  name: string;
  role: string;
  status: string;
  avatar_url: string | null;
  last_login: string | null;
  created_at: string;     
};


export type NewProfile = {
  name: string;
  email: string;
  role: string;
  status: string;
  avatar_url?: string | null;
};
