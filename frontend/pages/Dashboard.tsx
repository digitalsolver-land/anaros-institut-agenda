import { useEffect, useState } from 'react';
import { Calendar, Users, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import backend from '~backend/client';

interface DashboardStats {
  todayAppointments: number;
  totalClients: number;
  activeEmployees: number;
  completedToday: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    totalClients: 0,
    activeEmployees: 0,
    completedToday: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [employees] = await Promise.all([
        backend.employees.list(),
      ]);

      setStats({
        todayAppointments: 12, // Mock data for now
        totalClients: 156, // Mock data for now
        activeEmployees: employees.employees.length,
        completedToday: 8, // Mock data for now
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const statCards = [
    {
      title: "RDV aujourd'hui",
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Employés actifs',
      value: stats.activeEmployees,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Terminés aujourd\'hui',
      value: stats.completedToday,
      icon: TrendingUp,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">
          Vue d'ensemble de l'activité d'Anaros Institut
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Mme Dupont</p>
                  <p className="text-sm text-gray-600">Coloration - 14:00</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">Amina</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Mme Benaissa</p>
                  <p className="text-sm text-gray-600">Manucure - 15:30</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">Yasmine</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Mlle Kaci</p>
                  <p className="text-sm text-gray-600">Maquillage - 16:00</p>
                </div>
                <span className="text-sm text-blue-600 font-medium">Soraya</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité des employés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Amina Benali</span>
                <span className="text-sm text-gray-600">5 RDV aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fatima Khelifi</span>
                <span className="text-sm text-gray-600">3 RDV aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Yasmine Boudjema</span>
                <span className="text-sm text-gray-600">4 RDV aujourd'hui</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Soraya Meziane</span>
                <span className="text-sm text-gray-600">2 RDV aujourd'hui</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
