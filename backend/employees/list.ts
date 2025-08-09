import { api } from "encore.dev/api";
import { employeesDB } from "./db";

export interface Employee {
  id: number;
  name: string;
  specialties: string[];
  phone?: string;
  email?: string;
  is_active: boolean;
}

export interface ListEmployeesResponse {
  employees: Employee[];
}

// Retrieves all active employees with their specialties.
export const list = api<void, ListEmployeesResponse>(
  { expose: true, method: "GET", path: "/employees" },
  async () => {
    const employees = await employeesDB.queryAll<Employee>`
      SELECT id, name, specialties, phone, email, is_active
      FROM employees
      WHERE is_active = true
      ORDER BY name
    `;
    return { employees };
  }
);
