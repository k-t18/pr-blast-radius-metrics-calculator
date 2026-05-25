import type { DropdownOption } from '../../../../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../../../../components/form-fields/multiSelect';
import type { FilterOption, FilterSection } from '../../../../../../interfaces/mobileSponsorship/filters';

/**
 * Extract filter values from saved filter data
 * Recursively processes filter sections to extract checkbox selections and field values
 *
 * @param savedFilterSections - Array of saved filter sections
 * @param targetAudienceFilterData - Array of target audience filter sections (for matching options)
 * @returns Object containing selectedFilters Set and fieldValues Record
 *
 * @example
 * // INPUT: savedFilterSections (what was saved)
 * [
 *   {
 *     id: 'demographics',
 *     title: 'Demographics',
 *     subtitle: 'Target audience demographics',
 *     options: [
 *       {
 *         id: 'age-group',
 *         label: 'Age Group',
 *         inputType: 'multiselect',
 *         children: [
 *           { id: '18-24', label: '18-24' },
 *           { id: '25-34', label: '25-34' }
 *         ]
 *       },
 *       {
 *         id: 'gender',
 *         label: 'Gender',
 *         inputType: 'dropdown',
 *         children: [{ id: 'female', label: 'Female' }]
 *       },
 *       {
 *         id: 'location',
 *         label: 'Location',
 *         inputType: 'checkbox',
 *         children: [
 *           {
 *             id: 'region-north',
 *             label: 'North',
 *             children: [
 *               { id: 'state-lagos', label: 'Lagos' },
 *               { id: 'state-abuja', label: 'Abuja' }
 *             ]
 *           }
 *         ]
 *       },
 *       {
 *         id: 'device-type',
 *         label: 'Device Type',
 *         inputType: 'radio',
 *         children: [{ id: 'android', label: 'Android' }]
 *       }
 *     ]
 *   }
 * ]
 *
 * // INPUT: targetAudienceFilterData (current filter structure with full options)
 * [
 *   {
 *     id: 'demographics',
 *     title: 'Demographics',
 *     subtitle: 'Target audience demographics',
 *     options: [
 *       {
 *         id: 'age-group',
 *         label: 'Age Group',
 *         inputType: 'multiselect',
 *         multiselectOptions: [
 *           { label: '18-24', value: '18-24' },
 *           { label: '25-34', value: '25-34' },
 *           { label: '35-44', value: '35-44' }
 *         ]
 *       },
 *       {
 *         id: 'gender',
 *         label: 'Gender',
 *         inputType: 'dropdown',
 *         dropdownOptions: [
 *           { label: 'Male', value: 'male' },
 *           { label: 'Female', value: 'female' },
 *           { label: 'Other', value: 'other' }
 *         ]
 *       },
 *       {
 *         id: 'location',
 *         label: 'Location',
 *         inputType: 'checkbox',
 *         children: [
 *           {
 *             id: 'region-north',
 *             label: 'North',
 *             children: [
 *               { id: 'state-lagos', label: 'Lagos' },
 *               { id: 'state-abuja', label: 'Abuja' },
 *               { id: 'state-kano', label: 'Kano' }
 *             ]
 *           }
 *         ]
 *       },
 *       {
 *         id: 'device-type',
 *         label: 'Device Type',
 *         inputType: 'radio',
 *         radioOptions: [
 *           { label: 'iOS', value: 'ios' },
 *           { label: 'Android', value: 'android' },
 *           { label: 'Both', value: 'both' }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 *
 * // OUTPUT: Extracted values
 * {
 *   selectedFilters: Set([
 *     'state-lagos',    // Leaf checkbox from location hierarchy
 *     'state-abuja'     // Leaf checkbox from location hierarchy
 *   ]),
 *   fieldValues: {
 *     'age-group': [                    // Multiselect: array of selected options
 *       { label: '18-24', value: '18-24' },
 *       { label: '25-34', value: '25-34' }
 *     ],
 *     'gender': { label: 'Female', value: 'female' },  // Dropdown: single option object
 *     'device-type': 'android'                         // Radio: selected value (string/number)
 *   },
 *   sectionsToExpand: Set(['demographics']),  // Sections that should be expanded
 *   optionsToExpand: Set(['location', 'region-north'])  // Options with children that should be expanded
 * }
 */
export const extractSavedFilterValues = (
    savedFilterSections: FilterSection[],
    targetAudienceFilterData: FilterSection[]
): {
    selectedFilters: Set<string>;
    fieldValues: Record<string, DropdownOption | undefined | MultiSelectOption[] | string | number>;
    sectionsToExpand: Set<string>;
    optionsToExpand: Set<string>;
} => {
    const selectedFilters = new Set<string>();
    const fieldValues: Record<string, DropdownOption | undefined | MultiSelectOption[] | string | number> = {};
    const sectionsToExpand = new Set<string>();
    const optionsToExpand = new Set<string>();

    /**
     * Recursively process options to extract filter values.
     * Matches saved filter options with target audience filter options to get proper structure.
     */
    const processOption = (savedOption: FilterOption, targetOption: FilterOption, parentSectionId: string): void => {
        // Mark section and option for expansion if they have selections
        if (savedOption.id) {
            sectionsToExpand.add(parentSectionId);
            if (savedOption.children && savedOption.children.length > 0) {
                optionsToExpand.add(savedOption.id);
            }
        }

        // Handle dropdown - match saved value with target option's dropdownOptions
        if (
            savedOption.inputType === 'dropdown' &&
            targetOption.inputType === 'dropdown' &&
            targetOption.dropdownOptions &&
            savedOption.children &&
            savedOption.children.length > 0
        ) {
            const savedValue = savedOption.children[0].id;
            const matchingOption = targetOption.dropdownOptions.find(opt => opt.value === savedValue);
            if (matchingOption) {
                fieldValues[targetOption.id] = matchingOption;
            }
        }

        // Handle multiselect - match saved values with target option's multiselectOptions
        if (
            savedOption.inputType === 'multiselect' &&
            targetOption.inputType === 'multiselect' &&
            targetOption.multiselectOptions &&
            savedOption.children &&
            savedOption.children.length > 0
        ) {
            const selectedValues: MultiSelectOption[] = [];
            const savedChildrenLength = savedOption.children.length;
            for (let childIndex = 0; childIndex < savedChildrenLength; childIndex += 1) {
                const savedChild = savedOption.children[childIndex];
                const matchingOption = targetOption.multiselectOptions.find(opt => opt.value === savedChild.id);
                if (matchingOption) {
                    selectedValues.push(matchingOption);
                }
            }
            if (selectedValues.length > 0) {
                fieldValues[targetOption.id] = selectedValues;
            }
        }

        // Handle radio - match saved value with target option's radioOptions
        if (
            savedOption.inputType === 'radio' &&
            targetOption.inputType === 'radio' &&
            targetOption.radioOptions &&
            savedOption.children &&
            savedOption.children.length > 0
        ) {
            const savedValue = savedOption.children[0].id;
            const matchingOption = targetOption.radioOptions.find(opt => String(opt.value) === savedValue);
            if (matchingOption) {
                fieldValues[targetOption.id] = matchingOption.value;
            }
        }

        // Handle checkbox - add to selectedFilters
        if (savedOption.inputType === 'checkbox' || !savedOption.inputType) {
            // Check if this is a direct selection (no children means it's a leaf checkbox)
            if (!savedOption.children || savedOption.children.length === 0) {
                selectedFilters.add(savedOption.id);
            } else if (targetOption.children && savedOption.children) {
                // Has children - recursively process them
                const targetChildrenLength = targetOption.children.length;
                const savedChildrenLength = savedOption.children.length;
                for (let targetChildIndex = 0; targetChildIndex < targetChildrenLength; targetChildIndex += 1) {
                    const targetChild = targetOption.children[targetChildIndex];
                    for (let savedChildIndex = 0; savedChildIndex < savedChildrenLength; savedChildIndex += 1) {
                        const savedChild = savedOption.children[savedChildIndex];
                        if (targetChild.id === savedChild.id) {
                            // Recursively process matching children
                            processOption(savedChild, targetChild, parentSectionId);
                            // Also add the child to selectedFilters if it's a leaf
                            if (!savedChild.children || savedChild.children.length === 0) {
                                selectedFilters.add(savedChild.id);
                            }
                            break;
                        }
                    }
                }
            }
        }
    };

    // Process each saved filter section
    const savedSectionsLength = savedFilterSections.length;
    for (let savedSectionIndex = 0; savedSectionIndex < savedSectionsLength; savedSectionIndex += 1) {
        const savedSection = savedFilterSections[savedSectionIndex];
        // Find matching section in target audience filter data
        const targetSection = targetAudienceFilterData.find(section => section.id === savedSection.id);
        if (targetSection) {
            // Process each option in the section
            const savedOptionsLength = savedSection.options.length;
            for (let savedOptionIndex = 0; savedOptionIndex < savedOptionsLength; savedOptionIndex += 1) {
                const savedOption = savedSection.options[savedOptionIndex];
                const targetOption = targetSection.options.find(opt => opt.id === savedOption.id);
                if (targetOption) {
                    processOption(savedOption, targetOption, savedSection.id);
                }
            }
        }
    }

    return { selectedFilters, fieldValues, sectionsToExpand, optionsToExpand };
};

export default extractSavedFilterValues;
