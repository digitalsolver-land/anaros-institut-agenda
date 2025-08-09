import { useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const specialtyOptions = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'esthetique', label: 'Esthétique' },
  { id: 'manucure', label: 'Manucure/Pédicure' },
  { id: 'maquillage', label: 'Maquillage' },
];

export function CreateEmployeeDialog({ open, onOpenChange, onSuccess }: CreateEmployeeDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialties: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      await backend.employees.create({
        name: formData.name,
        specialties: formData.specialties,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
      });

      toast({
        title: 'Employé créé',
        description: 'Le nouvel employé a été ajouté avec succès.',
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        specialties: [],
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer l\'employé. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvel employé</DialogTitle>
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer l\'employé'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
