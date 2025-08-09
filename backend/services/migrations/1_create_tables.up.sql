-- Services table
CREATE TABLE services (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_dzd INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default services
INSERT INTO services (name, category, duration_minutes, price_dzd, description) VALUES
-- Coiffure
('Coloration et balayage', 'coiffure', 180, 8000, 'Coloration et balayage sur-mesure'),
('Lissage colombien', 'coiffure', 240, 12000, 'Lissage colombien professionnel'),
('Extensions capillaires', 'coiffure', 120, 15000, 'Extensions capillaires naturelles'),
('Coupe et brushing', 'coiffure', 90, 3500, 'Coupe et brushing classique'),
('Coiffure événementielle', 'coiffure', 120, 6000, 'Coiffure pour événements spéciaux'),

-- Soins esthétiques
('Soin du visage complet', 'esthetique', 90, 4500, 'Nettoyage, masque et hydratation'),
('Soin du corps', 'esthetique', 120, 6000, 'Gommage et modelage corporel'),
('Conseil beauté', 'esthetique', 30, 2000, 'Conseils beauté personnalisés'),

-- Beauté des mains/pieds
('Manucure classique', 'manucure', 60, 2500, 'Manucure classique avec vernis'),
('Manucure semi-permanent', 'manucure', 90, 4000, 'Manucure avec vernis semi-permanent'),
('Pédicure complète', 'manucure', 75, 3000, 'Pédicure avec soins'),
('Extensions ongulaires', 'manucure', 120, 5500, 'Extensions avec capsules ou chablons'),
('Nail art', 'manucure', 45, 3500, 'Décoration artistique des ongles'),

-- Maquillage
('Maquillage jour', 'maquillage', 45, 3000, 'Maquillage naturel pour la journée'),
('Maquillage soirée', 'maquillage', 60, 4500, 'Maquillage sophistiqué pour soirée'),
('Maquillage mariée', 'maquillage', 90, 8000, 'Maquillage complet pour mariage');
