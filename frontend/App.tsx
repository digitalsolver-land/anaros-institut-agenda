import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { Dashboard } from './pages/Dashboard';
import { Appointments } from './pages/Appointments';
import { Clients } from './pages/Clients';
import { Employees } from './pages/Employees';
import { Services } from './pages/Services';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/services" element={<Services />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
