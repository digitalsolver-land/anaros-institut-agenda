import { api } from "encore.dev/api";
import { clientsDB } from "./db";

export interface CreateClientRequest {
  name: string;
  phone: string;
  email?: string;
  allergies?: string;
  preferences?: string;
  notes?: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  allergies?: string;
  preferences?: string;
  notes?: string;
  created_at: Date;
}

// Creates a new client profile.
export const create = api<CreateClientRequest, Client>(
  { expose: true, method: "POST", path: "/clients" },
  async (req) => {
    const client = await clientsDB.queryRow<Client>`
      INSERT INTO clients (name, phone, email, allergies, preferences, notes)
      VALUES (${req.name}, ${req.phone}, ${req.email || null}, ${req.allergies || null}, ${req.preferences || null}, ${req.notes || null})
      RETURNING id, name, phone, email, allergies, preferences, notes, created_at
    `;
    
    if (!client) {
      throw new Error("Failed to create client");
    }
    
    return client;
  }
);
