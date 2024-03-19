export type Role = "LANDLORD" | "RESIDENT";

export interface Floor {
  id?: string;
  name: string;
}

export interface Flat {
  id?: string;
  name: string;
  floor_id: string;
}

export interface Device {
  id?: string;
  name: string;
  display_name: string;
  description: string;
  flat_id: string;
}

export interface UserCreate {
  username: string;
  full_name: string;
  role: Role;
  init_password: string;
}

export interface UserUpdate {
  id: string;
  username: string;
  full_name: string;
  role: Role;
}

export interface UserDetail {
  id: string;
  username: string;
  full_name: string;
  role: Role;
  flat: Flat | null;
}
