import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ user, loading, allowedRoles = [] }) => {

    // Render a clean loading interface during authentication checks
    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-50 flex items-center justify-center font-mono text-xs uppercase tracking-wider text-zinc-400">
                🔄 Authenticating credentials...
            </div>
        );
    }

    // 1. Enforce Authentication Guard: Redirect unauthenticated requests to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Normalize current user role for secure comparative evaluation
    const currentRole = user.role ? String(user.role).trim().toLowerCase() : '';

    // 2. Normalize and Evaluate Access Control List (ACL) Permissions
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const isAllowed = rolesArray.map(r => String(r).trim().toLowerCase()).includes(currentRole);

    // 3. Authorization Guard: Handle unauthorized structural access exceptions
    if (!isAllowed) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center font-mono text-xs uppercase tracking-wider p-4">
                <div className="border border-red-200 bg-red-50 text-red-600 p-6 rounded-xl max-w-md text-center shadow-sm">
                    ⚠️ ACCESS DENIED: UNAUTHORIZED SECTOR
                    <p className="lowercase font-sans text-zinc-500 mt-2 text-xs">
                        Your current account role ({user.role || 'Not Assigned'}) does not have permission to access this portal.
                    </p>
                    <a href="/" className="inline-block mt-4 bg-black text-white px-4 py-2 font-bold rounded hover:bg-zinc-800 transition-colors normal-case text-xs">
                        Go Back Home
                    </a>
                </div>
            </div>
        );
    }

    // 4. Permission Granted: Render active child routes safely via Outlet
    return <Outlet />;
};

export default ProtectedRoute;