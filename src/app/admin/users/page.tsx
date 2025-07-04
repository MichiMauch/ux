'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-new";
import { Button } from "@/components/ui/button-new";
import { Input } from "@/components/ui/input-new";
import { UserPlus, Trash2, Edit, X } from 'lucide-react';

interface User {
  id: number;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/admin/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserPassword) return;

    await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newUserEmail, password: newUserPassword }),
    });
    fetchUsers();
    setNewUserEmail('');
    setNewUserPassword('');
  };

  const handleDeleteUser = async (id: number) => {
    await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };
  
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditEmail(user.email);
    setEditPassword('');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingUser.id, email: editEmail, password: editPassword }),
    });
    fetchUsers();
    setEditingUser(null);
  };

  return (
    <div className="p-8">
        <Card variant="default">
          <CardHeader>
            <CardTitle>Benutzerverwaltung</CardTitle>
            <CardDescription>Fügen Sie neue Benutzer hinzu oder bearbeiten und entfernen Sie bestehende.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex-grow space-y-2">
                 <label className="text-sm font-medium text-gray-700">Neue E-Mail</label>
                <Input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="benutzer@beispiel.com"
                  required
                />
              </div>
               <div className="flex-grow space-y-2">
                <label className="text-sm font-medium text-gray-700">Neues Passwort</label>
                <Input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit">
                <UserPlus className="h-4 w-4" />
                Benutzer hinzufügen
              </Button>
            </form>
            
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-800">{user.email}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openEditModal(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Benutzer bearbeiten</CardTitle>
                <CardDescription>Ändern Sie die E-Mail oder das Passwort.</CardDescription>
                 <Button variant="ghost" size="icon" className="absolute top-4 right-4" onClick={() => setEditingUser(null)}>
                    <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateUser} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">E-Mail</label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Neues Passwort (optional)</label>
                    <Input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leer lassen, um nicht zu ändern"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                     <Button type="button" variant="ghost" onClick={() => setEditingUser(null)}>
                        Abbrechen
                    </Button>
                    <Button type="submit">Änderungen speichern</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
}
