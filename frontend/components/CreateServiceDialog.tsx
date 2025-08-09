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

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const categoryOptions = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'esthetique', label: 'Soins Esthétiques' },
  { id: 'manucure', label: 'Beauté des Mains/Pieds' },
  { id: 'maquillage', label: 'Maquillage' },
];

export function CreateServiceDialog({ open, onOpenChange, onSuccess }: CreateServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration_minutes: '',
    price_dzd: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await backend.services.create({
        name: formData.name,
        category: formData.category,
        duration_minutes: parseInt(formData.duration_minutes),
        price_dzd: parseInt(formData.price_dzd),
        description: formData.description || undefined,
      });

      toast({
        title: 'Service créé',
        description: 'Le nouveau service a été ajouté avec succès.',
      });

      setFormData({
        name: '',
        category: '',
        duration_minutes: '',
        price_dzd: '',
        description: '',
      });
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le service. Veuillez réessayer.',
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
          <DialogTitle>Nouveau service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du service *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Durée (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Prix (DZD) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price_dzd}
                onChange={(e) => setFormData({ ...formData, price_dzd: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du service..."
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
            <Button type="submit" disabled={isLoading || !formData.category}>
              {isLoading ? 'Création...' : 'Créer le service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
