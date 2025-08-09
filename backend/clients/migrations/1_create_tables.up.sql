-- Clients table
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  allergies TEXT,
  preferences TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Client history/notes for each visit
CREATE TABLE client_visit_notes (
  id BIGSERIAL PRIMARY KEY,
  client_id BIGINT REFERENCES clients(id) ON DELETE CASCADE,
  appointment_id BIGINT, -- Will reference appointments table
  employee_id BIGINT,
  service_name VARCHAR(255) NOT NULL,
  technical_notes TEXT,
  client_satisfaction INTEGER CHECK (client_satisfaction >= 1 AND client_satisfaction <= 5),
  recommendations TEXT,
  products_used TEXT,
  next_visit_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample clients
INSERT INTO clients (name, phone, email, allergies, preferences) VALUES
('Mme Dupont', '+213 555 111 222', 'dupont@email.com', 'Allergie aux sulfates', 'Préfère les produits naturels'),
('Mme Benaissa', '+213 555 333 444', 'benaissa@email.com', NULL, 'Aime les couleurs vives pour les ongles'),
('Mlle Kaci', '+213 555 555 666', 'kaci@email.com', 'Peau sensible', 'Maquillage discret pour le travail');
