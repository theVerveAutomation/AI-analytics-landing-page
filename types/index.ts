// Profile type matching the profiles table schema
export interface Profile {
  id: string;
  org_id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  full_name: string;
  organization_logo?: string | null;
  organization_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Feature type matching the features table schema
export interface Feature {
  id: string;
  name: string;
  description: string;
  icon?: string;
  enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  org_id: string;
  created_at?: string;
}