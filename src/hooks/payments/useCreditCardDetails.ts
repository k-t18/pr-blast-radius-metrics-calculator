import { useApiQuery } from '../useApiQuery';
import { getCreditCardDetails, type GetCreditCardDetailsResponse } from '../../services/payments/getCreditCardDetails.api';
import type { DropdownOption } from '../../components/common/Dropdown';

/**
 * Custom hook to fetch credit card details
 *
 * @returns Object containing credit card details, loading state, and error
 */
export function useCreditCardDetails() {
    const { data, isLoading, error } = useApiQuery<GetCreditCardDetailsResponse>({
        queryKey: ['credit-card-details'],
        queryFn: getCreditCardDetails,
    });

    // Extract the credit card details from the API response
    // The structure of 'data' is unknown, so we'll return it as is for now.
    // Refine this once the actual API response structure is known.
    const creditCardDetails = data?.data;
    const creditCardOptions: DropdownOption[] =
        (Array.isArray(creditCardDetails) &&
            creditCardDetails?.map(option => {
                return {
                    label: option.name,
                    value: option.label,
                };
            })) ||
        [];

    return {
        creditCardOptions,
        isLoading,
        error,
    };
}
