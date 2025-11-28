// src/types/index.ts

// 1. Define the types
export type Role = 'admin' | 'donor' | 'receiver' | 'volunteer';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  organization: string | null;
  is_suspended: number;
  is_verified: number;
  verification_note: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

// 2. Re-export everything so `import { User } from "@/types"` works
export type { User };