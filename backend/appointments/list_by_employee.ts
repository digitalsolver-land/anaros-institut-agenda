import { api, Query } from "encore.dev/api";
import { appointmentsDB } from "./db";

export interface ListByEmployeeParams {
  employee_id: number;
  date?: Query<string>; // YYYY-MM-DD format, defaults to today
}

export interface AppointmentWithClient {
  id: number;
  client_id: number;
  client_name: string;
  client_phone: string;
  service_name: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  client_present?: boolean;
  special_instructions?: string;
  allergies?: string;
  preferences?: string;
}

export interface ListByEmployeeResponse {
  appointments: AppointmentWithClient[];
}

// Retrieves appointments for a specific employee on a given date.
export const listByEmployee = api<ListByEmployeeParams, ListByEmployeeResponse>(
  { expose: true, method: "GET", path: "/appointments/employee/:employee_id" },
  async (params) => {
    const targetDate = params.date || new Date().toISOString().split('T')[0];
    
    const appointments = await appointmentsDB.queryAll<AppointmentWithClient>`
      SELECT 
        a.id, a.client_id, c.name as client_name, c.phone as client_phone,
        a.service_name, a.appointment_date, a.start_time, a.end_time,
        a.status, a.client_present, a.special_instructions,
        c.allergies, c.preferences
      FROM appointments a
      JOIN clients c ON a.client_id = c.id
      WHERE a.employee_id = ${params.employee_id}
        AND a.appointment_date = ${targetDate}
        AND a.status NOT IN ('cancelled')
      ORDER BY a.start_time
    `;

    return { appointments };
  }
);
