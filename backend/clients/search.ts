import { api, Query } from "encore.dev/api";
import { clientsDB } from "./db";

export interface SearchClientsParams {
  query: Query<string>;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  allergies?: string;
  preferences?: string;
  notes?: string;
}

export interface SearchClientsResponse {
  clients: Client[];
}

// Searches clients by name or phone number.
export const search = api<SearchClientsParams, SearchClientsResponse>(
  { expose: true, method: "GET", path: "/clients/search" },
  async (params) => {
    const searchTerm = `%${params.query}%`;
    const clients = await clientsDB.queryAll<Client>`
      SELECT id, name, phone, email, allergies, preferences, notes
      FROM clients
      WHERE name ILIKE ${searchTerm} OR phone LIKE ${searchTerm}
      ORDER BY name
      LIMIT 20
    `;
    return { clients };
  }
);
