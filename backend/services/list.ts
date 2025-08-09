import { api } from "encore.dev/api";
import { servicesDB } from "./db";

export interface Service {
  id: number;
  name: string;
  category: string;
  duration_minutes: number;
  price_dzd: number;
  description?: string;
}

export interface ListServicesResponse {
  services: Service[];
}

// Retrieves all available services, grouped by category.
export const list = api<void, ListServicesResponse>(
  { expose: true, method: "GET", path: "/services" },
  async () => {
    const services = await servicesDB.queryAll<Service>`
      SELECT id, name, category, duration_minutes, price_dzd, description
      FROM services
      ORDER BY category, name
    `;
    return { services };
  }
);
