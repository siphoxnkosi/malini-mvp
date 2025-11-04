import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import JoinBillPage from './pages/JoinBillPage';
import BillPage from './pages/BillPage';
import RestaurantMenuPage from './pages/RestaurantMenuPage';
import BillReadyPage from './pages/BillReadyPage';
import PastBillsPage from './pages/PastBillsPage';
import PaymentPage from './pages/PaymentPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import { getCurrentUser } from './services/mockApi';
import { Toaster } from "@/components/ui/sonner"

function App() {
  const user = getCurrentUser();

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />

        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['waiter', 'patron']} />}>
            <Route path="/home" element={<DashboardPage />} />
            <Route path="/restaurant/:id" element={<RestaurantMenuPage />} />
            <Route path="/bill/:code" element={<BillPage />} />
            <Route path="/bill/:code/ready" element={<BillReadyPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['waiter']} />}>
              <Route path="/history" element={<PastBillsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['patron']} />}>
            <Route path="/join" element={<JoinBillPage />} />
            <Route path="/pay/:code" element={<PaymentPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
