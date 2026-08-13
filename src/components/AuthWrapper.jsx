import { Navigate, Outlet } from 'react-router-dom';

export default function AuthWrapper() {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    let user = null;

    try {
        if (userStr) user = JSON.parse(userStr);
    } catch (e) {
        // skip
    }

    // If no token or user object is missing admin privileges/role
    if (!token || !user) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
