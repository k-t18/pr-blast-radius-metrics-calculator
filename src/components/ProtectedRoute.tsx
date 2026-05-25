import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * Redirects to login page if no auth token is available.
 */
function ProtectedRoute() {
    const token = useAuthStore(state => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
