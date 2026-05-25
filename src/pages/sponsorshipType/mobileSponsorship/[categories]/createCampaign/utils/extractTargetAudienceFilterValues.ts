import type { DropdownOption } from '../../../../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../../../../components/form-fields/multiSelect';
import type { FilterOption, FilterSection } from '../../../../../../interfaces/mobileSponsorship/filters';

/**
 * Recursively collect all leaf filter IDs (filters without children)
 */
function collectLeafFilterIds(options: FilterOption[], leafIds: Set<string>): void {
    const optionsLength = options.length;
    for (let optionIndex = 0; optionIndex < optionsLength; optionIndex += 1) {
        const option = options[optionIndex];
        if (option.children && option.children.length > 0) {
            collectLeafFilterIds(option.children, leafIds);
        } else if (option.inputType === 'checkbox' || option.inputType === undefined) {
            leafIds.add(option.id);
        }
    }
}

/**
 * Extract all filter values (checkboxes, dropdowns, multiselects, radios) - comma-separated format
 * Format: "target_audience-0172,target_audience-0183,value1,value2"
 *
 * @param selectedFilters - Set of selected checkbox filter IDs
 * @param fieldValues - Record of field values for dropdowns, multiselects, and radios
 * @param filterSections - Array of filter sections containing all filter options
 * @returns Comma-separated string of all filter values, or undefined if no filters are selected
 */
export function extractTargetAudienceFilterValues(
    selectedFilters: Set<string>,
    fieldValues: Record<string, DropdownOption | undefined | MultiSelectOption[] | string | number>,
    filterSections: FilterSection[]
): string | undefined {
    const filterValues: string[] = [];

    // Collect all leaf filter IDs (filters without children)
    const leafFilterIds = new Set<string>();
    const sectionsCount = filterSections.length;
    for (let sectionIndex = 0; sectionIndex < sectionsCount; sectionIndex += 1) {
        collectLeafFilterIds(filterSections[sectionIndex].options, leafFilterIds);
    }

    // Add only leaf checkbox filter IDs from selectedFilters
    selectedFilters.forEach(filterId => {
        if (leafFilterIds.has(filterId)) {
            filterValues.push(filterId);
        }
    });

    // Process filter sections to extract dropdown, multiselect, and radio values
    const sectionsLength = filterSections.length;
    for (let sectionIndex = 0; sectionIndex < sectionsLength; sectionIndex += 1) {
        const section = filterSections[sectionIndex];
        const optionsLength = section.options.length;
        for (let optionIndex = 0; optionIndex < optionsLength; optionIndex += 1) {
            const option = section.options[optionIndex];
            const fieldValue = fieldValues[option.id];

            // Handle dropdown - extract value from DropdownOption
            if (option.inputType === 'dropdown' && fieldValue && option.dropdownOptions) {
                if (typeof fieldValue === 'object' && fieldValue !== null && 'value' in fieldValue) {
                    const { value } = fieldValue as DropdownOption;
                    filterValues.push(String(value));
                } else if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
                    filterValues.push(String(fieldValue));
                }
            }

            // Handle multiselect - extract all values from MultiSelectOption[]
            if (option.inputType === 'multiselect' && fieldValue && Array.isArray(fieldValue)) {
                const multiselectValues = fieldValue as MultiSelectOption[];
                const valuesLength = multiselectValues.length;
                for (let valueIndex = 0; valueIndex < valuesLength; valueIndex += 1) {
                    const item = multiselectValues[valueIndex];
                    if (item.value !== undefined) {
                        filterValues.push(String(item.value));
                    }
                }
            }

            // Handle radio - extract value directly
            if (option.inputType === 'radio' && fieldValue !== undefined && fieldValue !== null) {
                filterValues.push(String(fieldValue));
            }
        }
    }

    return filterValues.length > 0 ? filterValues.join(',') : undefined;
}
