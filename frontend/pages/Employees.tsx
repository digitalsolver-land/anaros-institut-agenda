import { useEffect, useState } from 'react';
import { UserCheck, Phone, Mail, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import backend from '~backend/client';
import type { Employee } from '~backend/employees/list';

export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await backend.employees.list();
      setEmployees(response.employees);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'coiffure':
        return 'bg-blue-100 text-blue-800';
      case 'esthetique':
        return 'bg-green-100 text-green-800';
      case 'manucure':
        return 'bg-purple-100 text-purple-800';
      case 'maquillage':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSpecialtyText = (specialty: string) => {
    switch (specialty) {
      case 'coiffure':
        return 'Coiffure';
      case 'esthetique':
        return 'Esthétique';
      case 'manucure':
        return 'Manucure/Pédicure';
      case 'maquillage':
        return 'Maquillage';
      default:
        return specialty;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employés</h1>
        <p className="text-gray-600 mt-2">
          Équipe d'Anaros Institut
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-pink-600" />
                <span>{employee.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {employee.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      className={getSpecialtyColor(specialty)}
                    >
                      {getSpecialtyText(specialty)}
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  {employee.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{employee.phone}</span>
                    </div>
                  )}
                  {employee.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{employee.email}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Statut</span>
                    <Badge className={employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {employee.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
