'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-new";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input-new";
import { Shield, LogIn, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push('/admin');
    } else {
      const data = await response.json();
      setError(data.message || 'Login fehlgeschlagen');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
          <CardTitle className="mt-4">Admin Login</CardTitle>
          <CardDescription>Zugriff auf den geschützten Bereich</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-danger-50 border border-danger-200 text-sm text-danger-700 rounded-lg p-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">E-Mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beispiel.com"
                required
              />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Passwort</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full">
                <LogIn className="h-4 w-4" />
              Anmelden
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
