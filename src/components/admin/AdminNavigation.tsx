'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button-new";
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Mail,
} from 'lucide-react';

const navigation = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Analysen", href: "/admin/analyses", icon: FileText },
  { name: "Benutzer", href: "/admin/users", icon: Users },
  { name: "Leads", href: "/admin/leads", icon: Mail }, // New Leads link
  { name: "Einstellungen", href: "/admin/settings", icon: Settings },
];

export function AdminNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary-500"/>
              <h1 className="text-xl font-bold text-gray-900">
                Admin Panel
              </h1>
            </div>
            <nav className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            ))}
             <div className="pt-4 pb-2 px-4 border-t border-gray-200">
                <Button variant="outline" onClick={handleLogout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Abmelden
                </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}