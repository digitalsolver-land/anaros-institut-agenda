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
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { Employee } from '~backend/employees/get';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  employeeId: number | null;
}

const specialtyOptions = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'esthetique', label: 'Esthétique' },
  { id: 'manucure', label: 'Manucure/Pédicure' },
  { id: 'maquillage', label: 'Maquillage' },
];

export function EditEmployeeDialog({ open, onOpenChange, onSuccess, employeeId }: EditEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialties: [] as string[],
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && employeeId) {
      loadEmployee();
    }
  }, [open, employeeId]);

  const loadEmployee = async () => {
    if (!employeeId) return;
    
    setIsLoadingEmployee(true);
    try {
      const employee = await backend.employees.get({ id: employeeId });
      setFormData({
        name: employee.name,
        phone: employee.phone || '',
        email: employee.email || '',
        specialties: employee.specialties,
        is_active: employee.is_active,
      });
    } catch (error) {
      console.error('Error loading employee:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données de l\'employé.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingEmployee(false);
    }
  };

  const handleSpecialtyChange = (specialtyId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, specialtyId],
      });
    } else {
      setFormData({
        ...formData,
        specialties: formData.specialties.filter(s => s !== specialtyId),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId) return;
    
    if (formData.specialties.length === 0) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner au moins une spécialité.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await backend.employees.update({
        id: employeeId,
        name: formData.name,
        specialties: formData.specialties,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        is_active: formData.is_active,
      });

      toast({
        title: 'Employé modifié',
        description: 'Les informations de l\'employé ont été mises à jour.',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier l\'employé. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingEmployee) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Chargement...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier l'employé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <Label>Spécialités *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {specialtyOptions.map((specialty) => (
                <div key={specialty.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty.id}
                    checked={formData.specialties.includes(specialty.id)}
                    onCheckedChange={(checked) => 
                      handleSpecialtyChange(specialty.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={specialty.id} className="text-sm">
                    {specialty.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Employé actif</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Modification...' : 'Modifier l\'employé'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
