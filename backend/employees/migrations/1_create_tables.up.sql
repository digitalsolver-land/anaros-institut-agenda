-- Employees table
CREATE TABLE employees (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialties TEXT[] NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee working hours
CREATE TABLE employee_working_hours (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Employee absences/vacations
CREATE TABLE employee_absences (
  id BIGSERIAL PRIMARY KEY,
  employee_id BIGINT REFERENCES employees(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default employees
INSERT INTO employees (name, specialties, phone, email) VALUES
('Amina Benali', ARRAY['coiffure'], '+213 555 123 456', 'amina@anaros.dz'),
('Fatima Khelifi', ARRAY['esthetique'], '+213 555 234 567', 'fatima@anaros.dz'),
('Yasmine Boudjema', ARRAY['manucure'], '+213 555 345 678', 'yasmine@anaros.dz'),
('Soraya Meziane', ARRAY['maquillage'], '+213 555 456 789', 'soraya@anaros.dz'),
('Leila Hamidi', ARRAY['coiffure', 'maquillage'], '+213 555 567 890', 'leila@anaros.dz');

-- Insert default working hours (Sunday to Thursday, 9:00-17:00)
INSERT INTO employee_working_hours (employee_id, day_of_week, start_time, end_time) 
SELECT id, day_num, '09:00:00', '17:00:00'
FROM employees, generate_series(0, 4) as day_num;
