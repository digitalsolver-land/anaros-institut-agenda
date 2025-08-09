import { api, APIError } from "encore.dev/api";
import { appointmentsDB } from "./db";

export interface UpdateStatusRequest {
  id: number;
  status: string;
  client_present?: boolean;
}

export interface UpdateStatusResponse {
  success: boolean;
}

// Updates appointment status and client presence.
export const updateStatus = api<UpdateStatusRequest, UpdateStatusResponse>(
  { expose: true, method: "PUT", path: "/appointments/:id/status" },
  async (req) => {
    const validStatuses = ['confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
    
    if (!validStatuses.includes(req.status)) {
      throw APIError.invalidArgument("Invalid status value");
    }

    await appointmentsDB.exec`
      UPDATE appointments
      SET status = ${req.status},
          client_present = ${req.client_present || null},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${req.id}
    `;

    return { success: true };
  }
);
