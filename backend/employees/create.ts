import { api, APIError } from "encore.dev/api";
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
    try {
      // Validate required fields
      if (!req.name || req.name.trim() === '') {
        throw APIError.invalidArgument("Le nom de l'employé est requis");
      }

      if (!req.specialties || req.specialties.length === 0) {
        throw APIError.invalidArgument("Au moins une spécialité est requise");
      }

      const employee = await employeesDB.queryRow<Employee>`
        INSERT INTO employees (name, specialties, phone, email)
        VALUES (${req.name}, ${req.specialties}, ${req.phone || null}, ${req.email || null})
        RETURNING id, name, specialties, phone, email, is_active, created_at
      `;
      
      if (!employee) {
        throw APIError.internal("Échec de la création de l'employé");
      }
      
      return employee;
    } catch (error) {
      // Re-throw APIError as-is
      if (error instanceof APIError) {
        throw error;
      }
      
      // Log the actual error for debugging
      console.error("Error creating employee:", error);
      
      throw APIError.internal("Erreur interne lors de la création de l'employé");
    }
  }
);
