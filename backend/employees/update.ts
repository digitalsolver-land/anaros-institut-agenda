import { api, APIError } from "encore.dev/api";
import { employeesDB } from "./db";

export interface UpdateEmployeeRequest {
  id: number;
  name?: string;
  specialties?: string[];
  phone?: string;
  email?: string;
  is_active?: boolean;
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

// Updates an existing employee.
export const update = api<UpdateEmployeeRequest, Employee>(
  { expose: true, method: "PUT", path: "/employees/:id" },
  async (req) => {
    // Check if employee exists
    const existingEmployee = await employeesDB.queryRow`
      SELECT id FROM employees WHERE id = ${req.id}
    `;

    if (!existingEmployee) {
      throw APIError.notFound("Employee not found");
    }

    const employee = await employeesDB.queryRow<Employee>`
      UPDATE employees
      SET 
        name = COALESCE(${req.name || null}, name),
        specialties = COALESCE(${req.specialties || null}, specialties),
        phone = COALESCE(${req.phone || null}, phone),
        email = COALESCE(${req.email || null}, email),
        is_active = COALESCE(${req.is_active !== undefined ? req.is_active : null}, is_active)
      WHERE id = ${req.id}
      RETURNING id, name, specialties, phone, email, is_active, created_at
    `;

    if (!employee) {
      throw new Error("Failed to update employee");
    }

    return employee;
  }
);
