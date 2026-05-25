import { useApiQuery } from '../useApiQuery';
import { getBankDetails, type GetBankDetailsResponse } from '../../services/payments/getBankDetails.api';
import type { DropdownOption } from '../../components/common/Dropdown';

/**
 * Custom hook to fetch bank details
 *
 * @returns Object containing bank options, loading state, and error
 */
export function useBankDetails() {
    const { data, isLoading, error } = useApiQuery<GetBankDetailsResponse>({
        queryKey: ['bank-details'],
        queryFn: getBankDetails,
    });

    // Extract the bank details from the API response
    const bankDetails = data?.data;

    const bankOptions: DropdownOption[] =
        (Array.isArray(bankDetails) &&
            bankDetails?.map(option => {
                return {
                    label: option.name,
                    value: option.label,
                };
            })) ||
        [];

    return {
        bankOptions,
        isLoading,
        error,
    };
}
