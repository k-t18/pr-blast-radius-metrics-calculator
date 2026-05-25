import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * PublicRoute Component
 *
 * Wraps routes that should only be accessible to unauthenticated users.
 * Redirects to dashboard if user is already logged in.
 */
function PublicRoute() {
    const token = useAuthStore(state => state.token);

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default PublicRoute;
