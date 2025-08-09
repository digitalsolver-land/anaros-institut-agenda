import { useEffect, useState } from 'react';
import { Briefcase, Clock, DollarSign, Plus, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreateServiceDialog } from '../components/CreateServiceDialog';
import { EditServiceDialog } from '../components/EditServiceDialog';
import backend from '~backend/client';
import type { Service } from '~backend/services/list';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await backend.services.list();
      setServices(response.services);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleEditService = (serviceId: number) => {
    setSelectedServiceId(serviceId);
    setIsEditDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
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

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'coiffure':
        return 'Coiffure';
      case 'esthetique':
        return 'Soins Esthétiques';
      case 'manucure':
        return 'Beauté des Mains/Pieds';
      case 'maquillage':
        return 'Maquillage';
      default:
        return category;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}min`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h${remainingMinutes}min`;
    }
  };

  const formatPrice = (priceDzd: number) => {
    return `${priceDzd.toLocaleString()} DZD`;
  };

  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600 mt-2">
            Catalogue des prestations d'Anaros Institut
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau service
        </Button>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedServices).map(([category, categoryServices]) => (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {getCategoryText(category)}
              </h2>
              <Badge className={getCategoryColor(category)}>
                {categoryServices.length} service{categoryServices.length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{service.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(service.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.description && (
                        <p className="text-sm text-gray-600">{service.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {formatDuration(service.duration_minutes)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatPrice(service.price_dzd)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadServices}
      />

      <EditServiceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={loadServices}
        serviceId={selectedServiceId}
      />
    </div>
  );
}
