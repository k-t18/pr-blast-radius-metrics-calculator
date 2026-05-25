import { useApiQuery } from '../useApiQuery';
import { getLeadUserLogo, type LeadUserLogoData } from '../../services/general/getLeadUserLogo.api';

/**
 * Hook to fetch the lead user logo
 * @returns The logo data (url and file_name) or empty object if not available
 */
export function useLeadUserLogo(): LeadUserLogoData {
    const { data: logoUrlResponse } = useApiQuery({
        queryKey: ['lead-user-logo'],
        queryFn: () => getLeadUserLogo(),
        enabled: true,
    });

    return logoUrlResponse?.data || { url: '', file_name: '' };
}
