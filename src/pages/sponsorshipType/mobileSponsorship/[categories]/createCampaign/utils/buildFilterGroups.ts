import type { MultiSelectOption } from '../../../../../../components/form-fields/multiSelect';
import type { DropdownOption } from '../../../../../../components/common/Dropdown';
import type { FilterSection } from '../../../../../../interfaces/mobileSponsorship/filters';

/**
 * Example:
 * Input target audience filter response (truncated):
 * {
 *   "status": "success",
 *   "data": [
 *     { "name": "12-18", "children": [] },
 *     { "name": "Beverage Brands (Soft Drinks, Juices)", "children": [] },
 *     {
 *       "name": "target_audience-0170",
 *       "title": "Where are they located?",
 *       "type": "",
 *       "children": [
 *         {
 *           "name": "target_audience-0171",
 *           "title": "Country",
 *           "type": "dropdown",
 *           "children": [
 *             { "name": "target_audience-0172", "title": "Nigeria", "type": "" },
 *             { "name": "target_audience-0173", "title": "Uganda", "type": "" }
 *           ]
 *         },
 *         {
 *           "name": "target_audience-0174",
 *           "title": "Region / Zone",
 *           "type": "checkbox",
 *           "children": [
 *             { "name": "target_audience-0175", "title": "All regions", "type": "" },
 *             {
 *               "name": "target_audience-0176",
 *               "title": "North Central",
 *               "type": "checkbox",
 *               "children": [
 *                 { "name": "target_audience-0184", "title": "Ghatkopar", "type": "" },
 *                 { "name": "target_audience-0185", "title": "Ghatkopar west", "type": "" }
 *               ]
 *             }
 *           ]
 *         },
 *         {
 *           "name": "target_audience-0181",
 *           "title": "Cities / Local Areas",
 *           "type": "multiselect",
 *           "children": [
 *             { "name": "target_audience-0182", "title": "Ahuja Metro", "type": "" },
 *             { "name": "target_audience-0183", "title": "Mumbai", "type": "" }
 *           ]
 *         }
 *       ]
 *     },
 *     {
 *       "name": "target_audience-0177",
 *       "title": "Who are they?",
 *       "type": "",
 *       "children": [
 *         {
 *           "name": "target_audience-0178",
 *           "title": "Gender",
 *           "type": "checkbox",
 *           "children": [
 *             { "name": "Female", "title": "Female", "type": "" },
 *             { "name": "Male", "title": "Male", "type": "" }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * Example usage and output:
 * const selectedFilters = new Set(['target_audience-0176', 'target_audience-0184', 'Female']);
 * const fieldValues = {
 *   'target_audience-0171': { label: 'Nigeria', value: 'target_audience-0172' }, // dropdown
 *   'target_audience-0181': [
 *     { label: 'Ahuja Metro', value: 'target_audience-0182' },
 *     { label: 'Mumbai', value: 'target_audience-0183' }
 *   ] // multiselect
 * };
 * buildFilterGroups(selectedFilters, fieldValues, targetAudienceFilterData);
 * // Output:
 * // [
 * //   { optionId: 'target_audience-0171', optionLabel: 'Country', options: [{ id: 'target_audience-0171', label: 'Nigeria' }] },
 * //   { optionId: 'target_audience-0174', optionLabel: 'Region / Zone', options: [
 * //       { id: 'target_audience-0176', label: 'North Central' },
 * //       { id: 'target_audience-0184', label: 'Ghatkopar' }
 * //     ]
 * //   },
 * //   { optionId: 'target_audience-0181', optionLabel: 'Cities / Local Areas', options: [
 * //       { id: 'target_audience-0181-target_audience-0182', label: 'Ahuja Metro' },
 * //       { id: 'target_audience-0181-target_audience-0183', label: 'Mumbai' }
 * //     ]
 * //   },
 * //   { optionId: 'target_audience-0178', optionLabel: 'Gender', options: [{ id: 'Female', label: 'Female' }] }
 * // ]
 */
export type FilterGroup = {
    optionId: string;
    optionLabel: string;
    options: Array<{ id: string; label: string }>;
};

/**
 * Process and group selected filters by option type
 * Handles dropdown, multiselect, radio, checkbox, and nested checkbox selections
 * Returns an array of filter groups with their selected options
 *
 * @param selectedFilters - Set of selected checkbox filter IDs
 * @param fieldValues - Record of field values for dropdowns, multiselects, and radios
 * @param targetAudienceFilterData - Array of filter sections containing all filter options
 * @returns Array of filter groups with their selected options
 */
export function buildFilterGroups(
    selectedFilters: Set<string>,
    fieldValues: Record<string, DropdownOption | undefined | MultiSelectOption[] | string | number>,
    targetAudienceFilterData: FilterSection[]
): FilterGroup[] {
    const groups: FilterGroup[] = [];

    const sectionsLength = targetAudienceFilterData.length;
    for (let sectionIndex = 0; sectionIndex < sectionsLength; sectionIndex += 1) {
        const section = targetAudienceFilterData[sectionIndex];
        const optionsLength = section.options.length;
        for (let optionIndex = 0; optionIndex < optionsLength; optionIndex += 1) {
            const option = section.options[optionIndex];
            const selectedOptions: Array<{ id: string; label: string }> = [];

            // Handle dropdown - show selected value
            if (option.inputType === 'dropdown' && fieldValues[option.id] && option.dropdownOptions) {
                const storedValue = fieldValues[option.id];
                let labelToShow: string | undefined;

                // Check if stored value is an object with label property
                if (typeof storedValue === 'object' && storedValue !== null && !Array.isArray(storedValue) && 'label' in storedValue) {
                    labelToShow = (storedValue as { label: string; value: string | number }).label;
                }
                // If no label, find it from dropdownOptions using the value
                else if (typeof storedValue === 'object' && storedValue !== null && 'value' in storedValue) {
                    const valueToFind = (storedValue as { value: string | number }).value;
                    const foundOption = option.dropdownOptions.find(opt => opt.value === valueToFind);
                    labelToShow = foundOption?.label;
                }
                // If stored value is just a string/number, find the matching option
                else if (typeof storedValue === 'string' || typeof storedValue === 'number') {
                    const foundOption = option.dropdownOptions.find(opt => opt.value === storedValue);
                    labelToShow = foundOption?.label;
                }

                if (labelToShow) {
                    selectedOptions.push({ id: option.id, label: labelToShow });
                }
            }
            // Handle multiselect - show all selected values
            else if (option.inputType === 'multiselect' && fieldValues[option.id]) {
                const values = fieldValues[option.id] as MultiSelectOption[];
                const valuesLength = values.length;
                if (valuesLength > 0) {
                    for (let valueIndex = 0; valueIndex < valuesLength; valueIndex += 1) {
                        const value = values[valueIndex];
                        selectedOptions.push({ id: `${option.id}-${value.value}`, label: value.label });
                    }
                }
            }
            // Handle radio buttons - show selected value
            else if (option.inputType === 'radio' && fieldValues[option.id] && option.radioOptions) {
                const selectedValue = fieldValues[option.id];
                const foundOption = option.radioOptions.find(opt => opt.value === selectedValue);
                if (foundOption) {
                    selectedOptions.push({ id: option.id, label: foundOption.label as string });
                }
            }
            // Handle checkbox options with children (recursive)
            else if (option.children && option.inputType === 'checkbox') {
                // Recursively collect selected children
                const collectSelectedChildren = (children: typeof option.children): void => {
                    if (!children) return;
                    const childrenLength = children.length;
                    for (let childIndex = 0; childIndex < childrenLength; childIndex += 1) {
                        const child = children[childIndex];
                        if (selectedFilters.has(child.id)) {
                            selectedOptions.push({ id: child.id, label: child.label });
                        }
                        // Recursively check grandchildren
                        if (child.children) {
                            collectSelectedChildren(child.children);
                        }
                    }
                };
                collectSelectedChildren(option.children);
            }
            // Handle direct checkbox selection (no children or parent checkbox selected)
            else if (selectedFilters.has(option.id) && option.inputType === 'checkbox') {
                selectedOptions.push({ id: option.id, label: option.label });
            }

            // Only add group if there are selected options
            if (selectedOptions.length > 0) {
                groups.push({ optionId: option.id, optionLabel: option.label, options: selectedOptions });
            }
        }
    }

    return groups;
}
