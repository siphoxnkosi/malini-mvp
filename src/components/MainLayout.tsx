// src/components/MainLayout.tsx
import { Link, Outlet } from 'react-router-dom';
import { Button } from './ui/button';
import { getCurrentUser } from '@/services/mockApi';

const MainLayout = () => {
  const user = getCurrentUser();

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="text-xl font-bold">
            <Link to="/home">Malini</Link>
        </div>
        <div className="flex items-center gap-4">
          {user?.role === 'waiter' && <Link to="/history">Past Bills</Link>}
          <span>{user?.name}</span>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
