import { api } from "encore.dev/api";
import { appointmentsDB } from "./db";

export interface AddNotesRequest {
  appointment_id: number;
  technical_notes?: string;
  client_satisfaction?: number;
  recommendations?: string;
  products_used?: string;
  next_visit_notes?: string;
}

export interface AddNotesResponse {
  success: boolean;
}

// Adds detailed notes to a completed appointment.
export const addNotes = api<AddNotesRequest, AddNotesResponse>(
  { expose: true, method: "POST", path: "/appointments/:appointment_id/notes" },
  async (req) => {
    await appointmentsDB.exec`
      INSERT INTO appointment_notes (
        appointment_id, technical_notes, client_satisfaction,
        recommendations, products_used, next_visit_notes
      )
      VALUES (
        ${req.appointment_id}, ${req.technical_notes || null}, ${req.client_satisfaction || null},
        ${req.recommendations || null}, ${req.products_used || null}, ${req.next_visit_notes || null}
      )
    `;

    return { success: true };
  }
);
