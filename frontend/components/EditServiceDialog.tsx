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
import type { Service } from '~backend/services/get';

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  serviceId: number | null;
}

const categoryOptions = [
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'esthetique', label: 'Soins Esthétiques' },
  { id: 'manucure', label: 'Beauté des Mains/Pieds' },
  { id: 'maquillage', label: 'Maquillage' },
];

export function EditServiceDialog({ open, onOpenChange, onSuccess, serviceId }: EditServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    duration_minutes: '',
    price_dzd: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingService, setIsLoadingService] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && serviceId) {
      loadService();
    }
  }, [open, serviceId]);

  const loadService = async () => {
    if (!serviceId) return;
    
    setIsLoadingService(true);
    try {
      const service = await backend.services.get({ id: serviceId });
      setFormData({
        name: service.name,
        category: service.category,
        duration_minutes: service.duration_minutes.toString(),
        price_dzd: service.price_dzd.toString(),
        description: service.description || '',
      });
    } catch (error) {
      console.error('Error loading service:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données du service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingService(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceId) return;

    setIsLoading(true);

    try {
      await backend.services.update({
        id: serviceId,
        name: formData.name,
        category: formData.category,
        duration_minutes: parseInt(formData.duration_minutes),
        price_dzd: parseInt(formData.price_dzd),
        description: formData.description || undefined,
      });

      toast({
        title: 'Service modifié',
        description: 'Les informations du service ont été mises à jour.',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le service. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingService) {
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
          <DialogTitle>Modifier le service</DialogTitle>
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
              {isLoading ? 'Modification...' : 'Modifier le service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
