import { api, APIError } from "encore.dev/api";
import { employeesDB } from "./db";

export interface GetEmployeeParams {
  id: number;
}

export interface Employee {
  id: number;
  name: string;
  specialties: string[];
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: Date;
}

// Retrieves a specific employee by ID.
export const get = api<GetEmployeeParams, Employee>(
  { expose: true, method: "GET", path: "/employees/:id" },
  async (params) => {
    const employee = await employeesDB.queryRow<Employee>`
      SELECT id, name, specialties, phone, email, is_active, created_at
      FROM employees
      WHERE id = ${params.id}
    `;

    if (!employee) {
      throw APIError.notFound("Employee not found");
    }

    return employee;
  }
);
