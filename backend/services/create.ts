import { api, APIError } from "encore.dev/api";
import { servicesDB } from "./db";

export interface CreateServiceRequest {
  name: string;
  category: string;
  duration_minutes: number;
  price_dzd: number;
  description?: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  duration_minutes: number;
  price_dzd: number;
  description?: string;
  created_at: Date;
}

// Creates a new service.
export const create = api<CreateServiceRequest, Service>(
  { expose: true, method: "POST", path: "/services" },
  async (req) => {
    try {
      // Validate required fields
      if (!req.name || req.name.trim() === '') {
        throw APIError.invalidArgument("Le nom du service est requis");
      }

      if (!req.category || req.category.trim() === '') {
        throw APIError.invalidArgument("La catégorie du service est requise");
      }

      if (!req.duration_minutes || req.duration_minutes <= 0) {
        throw APIError.invalidArgument("La durée du service doit être supérieure à 0");
      }

      if (!req.price_dzd || req.price_dzd < 0) {
        throw APIError.invalidArgument("Le prix du service doit être positif");
      }

      const service = await servicesDB.queryRow<Service>`
        INSERT INTO services (name, category, duration_minutes, price_dzd, description)
        VALUES (${req.name}, ${req.category}, ${req.duration_minutes}, ${req.price_dzd}, ${req.description || null})
        RETURNING id, name, category, duration_minutes, price_dzd, description, created_at
      `;
      
      if (!service) {
        throw APIError.internal("Échec de la création du service");
      }
      
      return service;
    } catch (error) {
      // Re-throw APIError as-is
      if (error instanceof APIError) {
        throw error;
      }
      
      // Log the actual error for debugging
      console.error("Error creating service:", error);
      
      throw APIError.internal("Erreur interne lors de la création du service");
    }
  }
);
