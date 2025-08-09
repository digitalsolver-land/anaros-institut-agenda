import { api, APIError } from "encore.dev/api";
import { servicesDB } from "./db";

export interface UpdateServiceRequest {
  id: number;
  name?: string;
  category?: string;
  duration_minutes?: number;
  price_dzd?: number;
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

// Updates an existing service.
export const update = api<UpdateServiceRequest, Service>(
  { expose: true, method: "PUT", path: "/services/:id" },
  async (req) => {
    // Check if service exists
    const existingService = await servicesDB.queryRow`
      SELECT id FROM services WHERE id = ${req.id}
    `;

    if (!existingService) {
      throw APIError.notFound("Service not found");
    }

    const service = await servicesDB.queryRow<Service>`
      UPDATE services
      SET 
        name = COALESCE(${req.name || null}, name),
        category = COALESCE(${req.category || null}, category),
        duration_minutes = COALESCE(${req.duration_minutes || null}, duration_minutes),
        price_dzd = COALESCE(${req.price_dzd || null}, price_dzd),
        description = COALESCE(${req.description || null}, description)
      WHERE id = ${req.id}
      RETURNING id, name, category, duration_minutes, price_dzd, description, created_at
    `;

    if (!service) {
      throw new Error("Failed to update service");
    }

    return service;
  }
);
