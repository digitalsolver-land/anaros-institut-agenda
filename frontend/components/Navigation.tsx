import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, UserCheck, Briefcase, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: BarChart3 },
  { name: 'Rendez-vous', href: '/appointments', icon: Calendar },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Employés', href: '/employees', icon: UserCheck },
  { name: 'Services', href: '/services', icon: Briefcase },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center mb-1">
                  <svg width="32" height="24" viewBox="0 0 40 30" className="text-pink-600">
                    <g fill="currentColor">
                      {/* Lotus petals */}
                      <path d="M20 5 C15 8, 10 12, 12 18 C14 12, 17 8, 20 5 Z" />
                      <path d="M20 5 C25 8, 30 12, 28 18 C26 12, 23 8, 20 5 Z" />
                      <path d="M20 8 C16 10, 12 14, 14 20 C16 14, 18 10, 20 8 Z" />
                      <path d="M20 8 C24 10, 28 14, 26 20 C24 14, 22 10, 20 8 Z" />
                      <path d="M20 11 C17 12, 14 16, 16 22 C18 16, 19 12, 20 11 Z" />
                      <path d="M20 11 C23 12, 26 16, 24 22 C22 16, 21 12, 20 11 Z" />
                      <path d="M20 14 C18 15, 16 18, 18 24 C19 18, 19.5 15, 20 14 Z" />
                      <path d="M20 14 C22 15, 24 18, 22 24 C21 18, 20.5 15, 20 14 Z" />
                    </g>
                  </svg>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 tracking-wider">ANAROS</div>
                  <div className="text-xs text-gray-600 italic -mt-1">Beauty Lounge</div>
                </div>
              </div>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-pink-100 text-pink-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
