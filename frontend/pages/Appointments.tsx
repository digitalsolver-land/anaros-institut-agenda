import { useEffect, useState } from 'react';
import { Plus, Calendar, Clock, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateAppointmentDialog } from '../components/CreateAppointmentDialog';
import backend from '~backend/client';
import type { AppointmentWithClient } from '~backend/appointments/list_by_employee';
import type { Employee } from '~backend/employees/list';

export function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentWithClient[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      loadAppointments();
    }
  }, [selectedDate, selectedEmployeeId]);

  const loadEmployees = async () => {
    try {
      const response = await backend.employees.list();
      setEmployees(response.employees);
      // Auto-select first employee if available
      if (response.employees.length > 0 && !selectedEmployeeId) {
        setSelectedEmployeeId(response.employees[0].id.toString());
      }
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadAppointments = async () => {
    if (!selectedEmployeeId) return;
    
    try {
      const response = await backend.appointments.listByEmployee({ 
        employee_id: parseInt(selectedEmployeeId), 
        date: selectedDate 
      });
      setAppointments(response.appointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      case 'no_show':
        return 'Absent';
      default:
        return status;
    }
  };

  const selectedEmployee = employees.find(emp => emp.id.toString() === selectedEmployeeId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="text-gray-600 mt-2">
            Gestion des rendez-vous clients
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau RDV
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sélectionner un employé" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedEmployee && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">
            Planning de {selectedEmployee.name} - {new Date(selectedDate).toLocaleDateString('fr-FR')}
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            {appointments.length} rendez-vous programmé{appointments.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {!selectedEmployeeId ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Sélectionnez un employé pour voir ses rendez-vous</p>
              </div>
            </CardContent>
          </Card>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun rendez-vous pour cette date</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">
                        {appointment.start_time} - {appointment.end_time}
                      </span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{appointment.client_name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{appointment.client_phone}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Service:</strong> {appointment.service_name}
                    </p>
                  </div>
                  
                  <div>
                    {appointment.allergies && (
                      <p className="text-sm text-red-600 mb-1">
                        <strong>Allergies:</strong> {appointment.allergies}
                      </p>
                    )}
                    {appointment.preferences && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Préférences:</strong> {appointment.preferences}
                      </p>
                    )}
                    {appointment.special_instructions && (
                      <p className="text-sm text-gray-600">
                        <strong>Instructions:</strong> {appointment.special_instructions}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadAppointments}
      />
    </div>
  );
}
