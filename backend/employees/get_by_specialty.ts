import { api } from "encore.dev/api";
import { employeesDB } from "./db";

export interface GetBySpecialtyParams {
  specialty: string;
}

export interface GetBySpecialtyResponse {
  employees: Employee[];
}

interface Employee {
  id: number;
  name: string;
  specialties: string[];
  phone?: string;
  email?: string;
}

// Retrieves employees who specialize in a specific service category.
export const getBySpecialty = api<GetBySpecialtyParams, GetBySpecialtyResponse>(
  { expose: true, method: "GET", path: "/employees/specialty/:specialty" },
  async (params) => {
    const employees = await employeesDB.queryAll<Employee>`
      SELECT id, name, specialties, phone, email
      FROM employees
      WHERE is_active = true AND ${params.specialty} = ANY(specialties)
      ORDER BY name
    `;
    return { employees };
  }
);
