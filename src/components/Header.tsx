import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GraduationCap, LogOut, User, Building2 } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleSaveName = () => {
    if (user && newName.trim()) {
      const updatedUser = { ...user, name: newName.trim() };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.location.reload(); // Quick way to update context everywhere
    }
    setEditing(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ScholarPay</h1>
              <p className="text-xs text-gray-500">Scholarship Portal</p>
            </div>
          </div>

          {/* Only show sign in button if user is not logged in */}
          {!user && (
            <Button className="ml-4" variant="default">
              Sign In with Payman
            </Button>
          )}

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                {user.role === 'government' ? (
                  <Building2 className="h-4 w-4 text-blue-600" />
                ) : (
                  <User className="h-4 w-4 text-green-600" />
                )}
                <span className="text-gray-700 capitalize">{user.role}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {editing ? (
                        <>
                          <input
                            className="border rounded px-2 py-1 text-sm mb-1"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveName}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="font-medium flex items-center gap-2">{user.name}
                            <Button size="icon" variant="ghost" className="p-1" onClick={() => setEditing(true)}>
                              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11-11a2.828 2.828 0 0 0-4-4L5 17v4z"/></svg>
                            </Button>
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {user.studentId && (
                            <p className="text-xs text-blue-600">ID: {user.studentId}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
