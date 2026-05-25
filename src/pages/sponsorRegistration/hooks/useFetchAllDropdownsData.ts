import { useMemo } from 'react';
import { useApiQuery } from '../../../hooks/useApiQuery';
import { getCACVerification } from '../../../services/registration/getCacVerification.api';
import { getCountryList } from '../../../services/registration/getCountryList.api';
import { getIndustryTypes } from '../../../services/registration/getIndustryTypes.api';
import { getPrizePledgeList } from '../../../services/registration/getPrizePledgeList.api';
import { getSponsorshipFocusAreaList } from '../../../services/registration/getSponsorshipFocusAreaList.api';
import { getSponsorshipIntentList } from '../../../services/registration/getSponsorshipIntentList.api';
import { getTINVerification } from '../../../services/registration/getTinVerification.api';
import useDebounce from '../../../hooks/useDebounce';
import type { MultiSelectOption } from '../../../components/form-fields/multiSelect/MultiSelect';

/**
 * Transform API response data to MultiSelectOption format
 * Uses `name` as the value (unique identifier) and `label` as the display text
 */
function transformToMultiSelectOptions(data: Array<{ name: string; label: string }> | undefined): MultiSelectOption[] {
    if (!data || !Array.isArray(data)) {
        return [];
    }
    return data.map(item => ({
        label: item.label, // Display text from API
        value: item.name, // Unique identifier from API
    }));
}

const useFetchAllDropdownsData = (tinNumber?: string, cacNumber?: string) => {
    // Debounce the input values to avoid too many API calls
    const debouncedTinNumber = useDebounce(tinNumber || '', 700);
    const debouncedCacNumber = useDebounce(cacNumber || '', 700);

    // Minimum length required before making API call
    const MIN_LENGTH = 3;
    const shouldVerifyTin = debouncedTinNumber.trim().length >= MIN_LENGTH;
    const shouldVerifyCac = debouncedCacNumber.trim().length >= MIN_LENGTH;

    const { data: countryListData } = useApiQuery({
        queryKey: ['countryList'],
        queryFn: () => getCountryList(),
    });
    const { data: industryTypeListData } = useApiQuery({
        queryKey: ['industryTypeList'],
        queryFn: () => getIndustryTypes(),
    });
    const { data: sponsorshipIntentListData } = useApiQuery({
        queryKey: ['sponsorshipIntentList'],
        queryFn: () => getSponsorshipIntentList(),
    });
    const { data: sponsorshipFocusAreaListData } = useApiQuery({
        queryKey: ['sponsorshipFocusAreaList'],
        queryFn: () => getSponsorshipFocusAreaList(),
    });
    const { data: prizePledgeListData } = useApiQuery({
        queryKey: ['prizePledgeList'],
        queryFn: () => getPrizePledgeList(),
    });

    // Transform API data to MultiSelectOption format (all dropdowns use this format)
    // Note: API functions are incorrectly typed as ApiResponse<string[]>, but actual response is Array<{ name: string; label: string }>
    // We type-assert the data property directly to avoid the need for 'unknown' intermediate cast
    const countryList = useMemo(
        () => transformToMultiSelectOptions(countryListData?.data as Array<{ name: string; label: string }> | undefined),
        [countryListData]
    );
    const industryTypeList = useMemo(
        () => transformToMultiSelectOptions(industryTypeListData?.data as Array<{ name: string; label: string }> | undefined),
        [industryTypeListData]
    );
    const sponsorshipIntentList = useMemo(
        () => transformToMultiSelectOptions(sponsorshipIntentListData?.data as Array<{ name: string; label: string }> | undefined),
        [sponsorshipIntentListData]
    );
    const sponsorshipFocusAreaList = useMemo(
        () => transformToMultiSelectOptions(sponsorshipFocusAreaListData?.data as Array<{ name: string; label: string }> | undefined),
        [sponsorshipFocusAreaListData]
    );
    const prizePledgeList = useMemo(
        () => transformToMultiSelectOptions(prizePledgeListData?.data as Array<{ name: string; label: string }> | undefined),
        [prizePledgeListData]
    );

    // TIN Verification - only runs when debounced value meets minimum length
    const {
        data: tinVerification,
        isLoading: isVerifyingTin,
        error: tinVerificationError,
    } = useApiQuery({
        queryKey: ['tin-verify', debouncedTinNumber],
        queryFn: () => getTINVerification(debouncedTinNumber),
        enabled: shouldVerifyTin,
    });

    // CAC Verification - only runs when debounced value meets minimum length
    const {
        data: cacVerification,
        isLoading: isVerifyingCac,
        error: cacVerificationError,
    } = useApiQuery({
        queryKey: ['cac-verify', debouncedCacNumber],
        queryFn: () => getCACVerification(debouncedCacNumber),
        enabled: shouldVerifyCac,
    });

    return {
        countryList,
        industryTypeList,
        sponsorshipIntentList,
        sponsorshipFocusAreaList,
        prizePledgeList,
        tinVerification,
        cacVerification,
        isVerifyingTin,
        isVerifyingCac,
        tinVerificationError,
        cacVerificationError,
    };
};

export default useFetchAllDropdownsData;
