import { api, Query } from "encore.dev/api";
import { appointmentsDB } from "./db";
import { SQLDatabase } from "encore.dev/storage/sqldb";

// Reference the clients database
const clientsDB = SQLDatabase.named("clients");

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
    
    // First get appointments
    const appointments = await appointmentsDB.queryAll<{
      id: number;
      client_id: number;
      service_name: string;
      appointment_date: string;
      start_time: string;
      end_time: string;
      status: string;
      client_present?: boolean;
      special_instructions?: string;
    }>`
      SELECT 
        id, client_id, service_name, appointment_date, start_time, end_time,
        status, client_present, special_instructions
      FROM appointments
      WHERE employee_id = ${params.employee_id}
        AND appointment_date = ${targetDate}
        AND status NOT IN ('cancelled')
      ORDER BY start_time
    `;

    // Then get client details for each appointment
    const appointmentsWithClients: AppointmentWithClient[] = [];
    
    for (const appointment of appointments) {
      const client = await clientsDB.queryRow<{
        name: string;
        phone: string;
        allergies?: string;
        preferences?: string;
      }>`
        SELECT name, phone, allergies, preferences
        FROM clients
        WHERE id = ${appointment.client_id}
      `;

      if (client) {
        appointmentsWithClients.push({
          ...appointment,
          client_name: client.name,
          client_phone: client.phone,
          allergies: client.allergies,
          preferences: client.preferences,
        });
      }
    }

    return { appointments: appointmentsWithClients };
  }
);
