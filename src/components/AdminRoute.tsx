import { Navigate, Outlet } from 'react-router-dom';
import { isAdminLoggedIn } from '../lib/api/admin';

export default function AdminRoute() {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
