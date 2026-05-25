import { API_BASE_URL } from '../../../constants/apiConstants';

/**
 * Calls the Frappe built-in logout endpoint.
 *
 * This is a fire-and-forget call — it asks the server to expire its session
 * cookies (sid, system_user, user_id, user_image) on the backend domain.
 * HttpOnly cookies can only be cleared by the server, not by JS directly.
 *
 * credentials: 'include' is required so the browser sends the sid cookie
 * with the request, allowing Frappe to identify and invalidate the session.
 */
export const logoutAPI = (): Promise<void> => {
    return fetch(`${API_BASE_URL}/api/method/logout`, {
        method: 'POST',
        credentials: 'include',
    })
        .then(() => {})
        .catch(() => {
            // Non-critical — local token is cleared and the user is redirected
            // to login regardless. Frappe session cookies will expire on their
            // own via TTL, and the next login will overwrite them.
        });
};
