import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { Service } from '~backend/services/list';
import type { Employee } from '~backend/employees/list';
import type { Client } from '~backend/clients/search';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateAppointmentDialog({ open, onOpenChange, onSuccess }: CreateAppointmentDialogProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [formData, setFormData] = useState({
    client_id: '',
    employee_id: '',
    service_id: '',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    special_instructions: '',
  });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadServices();
      loadEmployees();
    }
  }, [open]);

  useEffect(() => {
    if (clientSearch.trim().length >= 2) {
      searchClients();
    } else {
      setClients([]);
    }
  }, [clientSearch]);

  useEffect(() => {
    if (formData.service_id) {
      const service = services.find(s => s.id.toString() === formData.service_id);
      setSelectedService(service || null);
      
      if (service) {
        loadEmployeesBySpecialty(service.category);
      }
    }
  }, [formData.service_id, services]);

  const loadServices = async () => {
    try {
      const response = await backend.services.list();
      setServices(response.services);
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les services.',
        variant: 'destructive',
      });
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await backend.employees.list();
      setEmployees(response.employees);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les employés.',
        variant: 'destructive',
      });
    }
  };

  const loadEmployeesBySpecialty = async (specialty: string) => {
    try {
      const response = await backend.employees.getBySpecialty({ specialty });
      setEmployees(response.employees);
    } catch (error) {
      console.error('Error loading employees by specialty:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les employés spécialisés.',
        variant: 'destructive',
      });
    }
  };

  const searchClients = async () => {
    try {
      const response = await backend.clients.search({ query: clientSearch });
      setClients(response.clients);
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rechercher les clients.',
        variant: 'destructive',
      });
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un service.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.client_id) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un client.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.employee_id) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un employé.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const endTime = calculateEndTime(formData.start_time, selectedService.duration_minutes);
      
      await backend.appointments.create({
        client_id: parseInt(formData.client_id),
        employee_id: parseInt(formData.employee_id),
        service_id: parseInt(formData.service_id),
        service_name: selectedService.name,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: endTime,
        special_instructions: formData.special_instructions || undefined,
      });

      toast({
        title: 'Rendez-vous créé',
        description: 'Le nouveau rendez-vous a été programmé avec succès.',
      });

      setFormData({
        client_id: '',
        employee_id: '',
        service_id: '',
        appointment_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        special_instructions: '',
      });
      setClientSearch('');
      setClients([]);
      setSelectedService(null);
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      
      let errorMessage = 'Impossible de créer le rendez-vous. Veuillez réessayer.';
      
      if (error?.message?.includes('Time slot is already booked')) {
        errorMessage = 'Ce créneau horaire est déjà réservé pour cet employé.';
      } else if (error?.message?.includes('not found')) {
        errorMessage = 'Données manquantes. Vérifiez que le client, l\'employé et le service existent.';
      }
      
      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="client-search">Rechercher un client *</Label>
            <Input
              id="client-search"
              value={clientSearch}
              onChange={(e) => setClientSearch(e.target.value)}
              placeholder="Nom ou téléphone du client..."
            />
            {clients.length > 0 && (
              <Select value={formData.client_id} onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name} - {client.phone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div>
            <Label htmlFor="service">Service *</Label>
            <Select value={formData.service_id} onValueChange={(value) => setFormData({ ...formData, service_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id.toString()}>
                    {service.name} ({Math.floor(service.duration_minutes / 60)}h{service.duration_minutes % 60 > 0 ? `${service.duration_minutes % 60}min` : ''})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="employee">Employé *</Label>
            <Select value={formData.employee_id} onValueChange={(value) => setFormData({ ...formData, employee_id: value })}>
              <SelectTrigger>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Heure de début *</Label>
              <Input
                id="time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
          </div>

          {selectedService && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Durée:</strong> {Math.floor(selectedService.duration_minutes / 60)}h{selectedService.duration_minutes % 60 > 0 ? `${selectedService.duration_minutes % 60}min` : ''}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Fin prévue:</strong> {calculateEndTime(formData.start_time, selectedService.duration_minutes)}
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="instructions">Instructions spéciales</Label>
            <Textarea
              id="instructions"
              value={formData.special_instructions}
              onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
              placeholder="Instructions particulières pour ce rendez-vous..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !formData.client_id || !formData.service_id || !formData.employee_id}>
              {isLoading ? 'Création...' : 'Créer le RDV'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
