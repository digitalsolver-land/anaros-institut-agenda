import { api, APIError } from "encore.dev/api";
import { servicesDB } from "./db";

export interface GetServiceParams {
  id: number;
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

// Retrieves a specific service by ID.
export const get = api<GetServiceParams, Service>(
  { expose: true, method: "GET", path: "/services/:id" },
  async (params) => {
    const service = await servicesDB.queryRow<Service>`
      SELECT id, name, category, duration_minutes, price_dzd, description, created_at
      FROM services
      WHERE id = ${params.id}
    `;

    if (!service) {
      throw APIError.notFound("Service not found");
    }

    return service;
  }
);
