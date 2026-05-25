import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '../useApiMutation';
import { getAccessApiToken, type GetAccessApiTokenResponse, type LoginPayload } from '../../services/auth/login/getAccessApiToken.api';
import { useAuthStore } from '../../stores/authStore';
import { useSponsorPortalSettingsData } from '../../stores/useSponsorPortalSettingsData';
import { PERIOD_FILTER_QUERY_KEY } from '../period/usePeriodFilterData';
import { usePdfDocumentsData } from '../../stores/storeOfAllPdfDocumentsData';

export const useLogin = () => {
    const setAuthToken = useAuthStore(state => state.setToken);
    const setCsrfToken = useAuthStore(state => state.setCsrfToken);
    const setEmail = useAuthStore(state => state.setEmail);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Get store actions for refetching app data after login
    const { clearSponsorPortalSettings, fetchSponsorPortalSettings } = useSponsorPortalSettingsData();
    const { clearTermsAndConditionData, fetchTermsAndConditionData } = usePdfDocumentsData();

    return useApiMutation<GetAccessApiTokenResponse, LoginPayload>({
        mutationFn: payload => getAccessApiToken(payload),
        showSuccessToast: true,
        successMessage: 'Login successful',
        onSuccess: async data => {
            const loginData = data?.data;
            if (loginData) {
                const sanitizedToken = loginData.token.replace(/^token\s+/i, '');
                setAuthToken(sanitizedToken);
                setCsrfToken(loginData.csrf_token);
                setEmail(loginData.user);

                // Clear and refetch app data for the logged-in user
                clearSponsorPortalSettings();
                clearTermsAndConditionData();

                // Fetch fresh sponsor portal settings
                await fetchSponsorPortalSettings();
                await fetchTermsAndConditionData();

                // Invalidate period filter query to trigger fresh fetch
                queryClient.invalidateQueries({ queryKey: PERIOD_FILTER_QUERY_KEY });

                navigate('/dashboard');
            }
        },
    });
};
export default useLogin;
