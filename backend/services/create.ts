import { api } from "encore.dev/api";
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
    const service = await servicesDB.queryRow<Service>`
      INSERT INTO services (name, category, duration_minutes, price_dzd, description)
      VALUES (${req.name}, ${req.category}, ${req.duration_minutes}, ${req.price_dzd}, ${req.description || null})
      RETURNING id, name, category, duration_minutes, price_dzd, description, created_at
    `;
    
    if (!service) {
      throw new Error("Failed to create service");
    }
    
    return service;
  }
);
