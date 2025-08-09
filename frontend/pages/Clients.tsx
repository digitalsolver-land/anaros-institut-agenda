import { useEffect, useState } from 'react';
import { Plus, Search, Phone, Mail, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateClientDialog } from '../components/CreateClientDialog';
import backend from '~backend/client';
import type { Client } from '~backend/clients/search';

export function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchClients();
    } else {
      setClients([]);
    }
  }, [searchQuery]);

  const searchClients = async () => {
    try {
      const response = await backend.clients.search({ query: searchQuery });
      setClients(response.clients);
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600 mt-2">
            Gestion de la base clients
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Rechercher par nom ou téléphone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {searchQuery.trim() === '' ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Utilisez la barre de recherche pour trouver des clients</p>
              </div>
            </CardContent>
          </Card>
        ) : clients.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun client trouvé</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{client.name}</span>
                  {client.allergies && (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                    {client.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{client.email}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {client.allergies && (
                      <div>
                        <p className="text-sm font-medium text-red-600">Allergies:</p>
                        <p className="text-sm text-red-600">{client.allergies}</p>
                      </div>
                    )}
                    {client.preferences && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Préférences:</p>
                        <p className="text-sm text-gray-600">{client.preferences}</p>
                      </div>
                    )}
                    {client.notes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Notes:</p>
                        <p className="text-sm text-gray-600">{client.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <CreateClientDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          if (searchQuery.trim()) {
            searchClients();
          }
        }}
      />
    </div>
  );
}
