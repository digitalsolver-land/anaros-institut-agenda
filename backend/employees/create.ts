import { api } from "encore.dev/api";
import { employeesDB } from "./db";

export interface CreateEmployeeRequest {
  name: string;
  specialties: string[];
  phone?: string;
  email?: string;
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

// Creates a new employee.
export const create = api<CreateEmployeeRequest, Employee>(
  { expose: true, method: "POST", path: "/employees" },
  async (req) => {
    const employee = await employeesDB.queryRow<Employee>`
      INSERT INTO employees (name, specialties, phone, email)
      VALUES (${req.name}, ${req.specialties}, ${req.phone || null}, ${req.email || null})
      RETURNING id, name, specialties, phone, email, is_active, created_at
    `;
    
    if (!employee) {
      throw new Error("Failed to create employee");
    }
    
    return employee;
  }
);
