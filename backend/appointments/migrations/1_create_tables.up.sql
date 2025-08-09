-- Appointments table
CREATE TABLE appointments (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT NOT NULL,
  employee_id BIGINT NOT NULL,
  service_id BIGINT NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  client_present BOOLEAN DEFAULT NULL,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment notes (linked to client_visit_notes)
CREATE TABLE appointment_notes (
  id BIGSERIAL PRIMARY KEY,
  appointment_id BIGINT REFERENCES appointments(id) ON DELETE CASCADE,
  technical_notes TEXT,
  client_satisfaction INTEGER CHECK (client_satisfaction >= 1 AND client_satisfaction <= 5),
  recommendations TEXT,
  products_used TEXT,
  next_visit_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_employee_date ON appointments(employee_id, appointment_date);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_date_time ON appointments(appointment_date, start_time);
