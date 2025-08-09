import { api, APIError } from "encore.dev/api";
import { appointmentsDB } from "./db";

export interface CreateAppointmentRequest {
  client_id: number;
  employee_id: number;
  service_id: number;
  service_name: string;
  appointment_date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  special_instructions?: string;
}

export interface Appointment {
  id: number;
  client_id: number;
  employee_id: number;
  service_id: number;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  special_instructions?: string;
  created_at: Date;
}

// Creates a new appointment after checking for conflicts.
export const create = api<CreateAppointmentRequest, Appointment>(
  { expose: true, method: "POST", path: "/appointments" },
  async (req) => {
    // Check for time conflicts
    const conflict = await appointmentsDB.queryRow`
      SELECT id FROM appointments
      WHERE employee_id = ${req.employee_id}
        AND appointment_date = ${req.appointment_date}
        AND status NOT IN ('cancelled', 'no_show')
        AND (
          (start_time <= ${req.start_time} AND end_time > ${req.start_time})
          OR (start_time < ${req.end_time} AND end_time >= ${req.end_time})
          OR (start_time >= ${req.start_time} AND end_time <= ${req.end_time})
        )
    `;

    if (conflict) {
      throw APIError.alreadyExists("Time slot is already booked for this employee");
    }

    const appointment = await appointmentsDB.queryRow<Appointment>`
      INSERT INTO appointments (
        client_id, employee_id, service_id, service_name,
        appointment_date, start_time, end_time, special_instructions
      )
      VALUES (
        ${req.client_id}, ${req.employee_id}, ${req.service_id}, ${req.service_name},
        ${req.appointment_date}, ${req.start_time}, ${req.end_time}, ${req.special_instructions || null}
      )
      RETURNING id, client_id, employee_id, service_id, service_name,
                appointment_date, start_time, end_time, status, special_instructions, created_at
    `;

    if (!appointment) {
      throw new Error("Failed to create appointment");
    }

    return appointment;
  }
);
