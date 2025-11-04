// src/pages/LoginPage.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/services/mockApi';

const LoginPage = () => {
  const [role, setRole] = useState<'waiter' | 'patron'>('waiter');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(userId, password);
      console.log('Logged in successfully:', user);
      // In a real app, you'd redirect here
      window.location.href = '/home';
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-4">
            <div className="flex p-1 bg-gray-200 rounded-lg">
              <Button
                variant={role === 'waiter' ? 'secondary' : 'ghost'}
                onClick={() => setRole('waiter')}
                className="w-24"
              >
                Waiter
              </Button>
              <Button
                variant={role === 'patron' ? 'secondary' : 'ghost'}
                onClick={() => setRole('patron')}
                className="w-24"
              >
                Patron
              </Button>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">Waiter ID / Patron ID</Label>
              <Input
                id="userId"
                placeholder="Enter your ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="text-sm text-center">
              <a href="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
