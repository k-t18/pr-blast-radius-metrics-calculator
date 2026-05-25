import { Link, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { SignOut } from '@phosphor-icons/react';
import NotificationDropdown from './NotificationDropdown';
import { ShoppingCart } from '../icons';
import LinkButton from '../common/LinkButton';
import { useAuthStore } from '../../stores/authStore';
import { logoutAPI } from '../../services/auth/logout/logout.api';
import { PERIOD_FILTER_QUERY_KEY } from '../../hooks/period/usePeriodFilterData';
import { useSponsorPortalSettingsData } from '../../stores/useSponsorPortalSettingsData';

function Navbar() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const clearToken = useAuthStore(state => state.clearToken);
    const clearEmail = useAuthStore(state => state.clearEmail);
    const clearSponsorPortalSettings = useSponsorPortalSettingsData(state => state.clearSponsorPortalSettings);
    return (
        <header className="h-14 bg-white flex items-center justify-between px-6 gap-6">
            <Link to="/">
                <img src="/assets/images/chances-logo.webp" alt="Chances Logo" className="h-12 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-6">
                <LinkButton to="/cart" textColor="text-black" width="auto" className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                    <ShoppingCart size={20} />
                    <span className="text-sm">Cart</span>
                </LinkButton>

                <NotificationDropdown />
                <button
                    type="button"
                    className="flex items-center gap-2 hover:text-gray-900"
                    onClick={() => {
                        logoutAPI();
                        clearToken();
                        clearEmail();
                        // Invalidate period filter query cache on logout
                        queryClient.invalidateQueries({ queryKey: PERIOD_FILTER_QUERY_KEY });
                        clearSponsorPortalSettings();
                        navigate('/login');
                    }}
                >
                    <SignOut size={20} />
                    <span className="text-sm">Logout</span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;
