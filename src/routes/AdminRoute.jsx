import { Link, Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-deep">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary-violet/30 border-t-primary-violet" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user?.role === 'ADMIN' || user?.roles?.includes('ADMIN');

  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-bg-deep px-4 py-16">
        <div className="w-full max-w-lg rounded-[2rem] border border-main bg-bg-card p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-red-500">403 · Permission denied</p>
          <h1 className="text-3xl font-black tracking-tight text-main">Admin access required</h1>
          <p className="mt-3 text-muted">Your current account is authenticated, but it does not have the ADMIN role needed to view this area.</p>
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary-violet px-6 py-3 font-black text-white transition hover:bg-primary-purple">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;

