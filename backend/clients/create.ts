import { api, APIError } from "encore.dev/api";
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
    try {
      // Validate required fields
      if (!req.name || req.name.trim() === '') {
        throw APIError.invalidArgument("Le nom du client est requis");
      }

      if (!req.phone || req.phone.trim() === '') {
        throw APIError.invalidArgument("Le numéro de téléphone est requis");
      }

      const client = await clientsDB.queryRow<Client>`
        INSERT INTO clients (name, phone, email, allergies, preferences, notes)
        VALUES (${req.name}, ${req.phone}, ${req.email || null}, ${req.allergies || null}, ${req.preferences || null}, ${req.notes || null})
        RETURNING id, name, phone, email, allergies, preferences, notes, created_at
      `;
      
      if (!client) {
        throw APIError.internal("Échec de la création du client");
      }
      
      return client;
    } catch (error) {
      // Re-throw APIError as-is
      if (error instanceof APIError) {
        throw error;
      }
      
      // Log the actual error for debugging
      console.error("Error creating client:", error);
      
      // Check for specific database errors
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as any).message;
        if (errorMessage.includes('duplicate key') && errorMessage.includes('phone')) {
          throw APIError.alreadyExists("Ce numéro de téléphone est déjà utilisé");
        }
      }
      
      throw APIError.internal("Erreur interne lors de la création du client");
    }
  }
);
