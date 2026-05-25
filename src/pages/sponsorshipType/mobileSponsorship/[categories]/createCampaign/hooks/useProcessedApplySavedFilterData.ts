import { useMemo } from 'react';
import type { DropdownOption } from '../../../../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../../../../components/form-fields/multiSelect';
import { useSavedFilterData } from '../../../../../../hooks/mobileSponsorship/useSavedFilterData';
import { useTargetAudienceFilterData } from '../../../../../../hooks/mobileSponsorship/useTargetAudienceFilterData';
import { extractSavedFilterValues } from '../utils/extractSavedFilterValues';

/**
 * Extract direct selections (items without title/subtitle) from raw API data
 * These are direct checkbox selections like "12-18" age groups
 * Example:
 * ```
 * extractDirectSelections([{ name: '12-18' }, { name: '19-25' }]);
 * // -> Set { '12-18', '19-25' }
 * ```
 * Input:  Array of objects with a `name` field, e.g. [{ name: '12-18' }]
 * Output: Set containing those names, e.g. Set { '12-18' }
 *
 * @param directSelections - Array of direct selection items from API
 * @returns Set of selected filter IDs
 */
const extractDirectSelections = (directSelections: Array<{ name: string }>): Set<string> => {
    const selectedFilters = new Set<string>();
    const directSelectionsLength = directSelections.length;
    for (let index = 0; index < directSelectionsLength; index += 1) {
        selectedFilters.add(directSelections[index].name);
    }
    return selectedFilters;
};

/**
 * Custom hook to apply saved filter data to target audience filters
 * Fetches saved filter data when enabled and extracts filter values to apply
 *
 * @param enabled - Whether to fetch and apply saved filters
 * @returns Object containing extracted filter values and expansion sets
 */
export const useProcessedApplySavedFilterData = (enabled: boolean) => {
    // Fetch saved filter data when enabled
    const { savedFilterData, directSelections, isLoading, error } = useSavedFilterData(enabled);

    // Get target audience filter data for matching options
    const { targetAudienceFilterData } = useTargetAudienceFilterData();

    /**
     * Extract filter values from saved filter data using useMemo
     * Only processes when saved filter data is available and enabled
     */
    const extractedFilters = useMemo(() => {
        if (!enabled || !savedFilterData || savedFilterData.length === 0 || targetAudienceFilterData.length === 0) {
            return {
                selectedFilters: new Set<string>(),
                fieldValues: {} as Record<string, DropdownOption | undefined | MultiSelectOption[] | string | number>,
                sectionsToExpand: new Set<string>(),
                optionsToExpand: new Set<string>(),
            };
        }

        // Extract filter values from saved filter sections
        const extracted = extractSavedFilterValues(savedFilterData, targetAudienceFilterData);

        // Merge direct selections (like "12-18" age groups) into selectedFilters
        const directSelectionsSet = extractDirectSelections(directSelections);
        const mergedSelectedFilters = new Set([...extracted.selectedFilters, ...directSelectionsSet]);

        return {
            selectedFilters: mergedSelectedFilters,
            fieldValues: extracted.fieldValues,
            sectionsToExpand: extracted.sectionsToExpand,
            optionsToExpand: extracted.optionsToExpand,
        };
    }, [enabled, savedFilterData, directSelections, targetAudienceFilterData]);

    return {
        ...extractedFilters,
        isLoading,
        error,
    };
};

export default useProcessedApplySavedFilterData;
