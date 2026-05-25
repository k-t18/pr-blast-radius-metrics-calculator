import type { DropdownOption } from '../../../components/common/Dropdown';
import type { MultiSelectOption } from '../../../components/form-fields/multiSelect';
import type { FilterSection, FilterOption } from '../../../interfaces/mobileSponsorship/filters';

/**
 * Target Audience API payload structure
 *
 * @example
 * {
 *   "group": "banking",
 *   "options": {
 *     "public_sector_banks": { "sub": ["SBI", "Bank of Baroda", "PNB"] },
 *     "private_banks": { "sub": ["HDFC", "ICICI", "Axis Bank"] }
 *   }
 * }
 */
export interface TargetAudienceGroup {
    group: string;
    options: Record<string, { sub: string[] }>;
}

type FieldValues = Record<string, DropdownOption | MultiSelectOption[] | string | number | undefined>;

/**
 * Recursively collect selected leaf labels grouped by their parent option
 */
function collectSelectedLabels(
    options: FilterOption[],
    selectedFilters: Set<string>,
    fieldValues: FieldValues,
    parentLabel: string | null,
    result: Map<string, string[]>
): void {
    options.forEach(option => {
        // Handle dropdown/multiselect field values
        if (option.inputType === 'dropdown' && fieldValues[option.id]) {
            const value = fieldValues[option.id] as DropdownOption;
            if (value?.label) {
                const key = parentLabel || option.label;
                if (!result.has(key)) {
                    result.set(key, []);
                }
                result.get(key)?.push(value.label);
            }
        } else if (option.inputType === 'multiselect' && fieldValues[option.id]) {
            const values = fieldValues[option.id] as MultiSelectOption[];
            if (values?.length > 0) {
                const key = parentLabel || option.label;
                if (!result.has(key)) {
                    result.set(key, []);
                }
                values.forEach(item => {
                    result.get(key)?.push(item.label);
                });
            }
        } else if (option.children && option.children.length > 0) {
            // Recurse into children, using current option as parent
            collectSelectedLabels(option.children, selectedFilters, fieldValues, option.label, result);
        } else if (selectedFilters.has(option.id)) {
            // Leaf checkbox selected
            const key = parentLabel || 'other';
            if (!result.has(key)) {
                result.set(key, []);
            }
            result.get(key)?.push(option.label);
        }
    });
}

/**
 * Build target audience payload in the format required by the API
 *
 * @param selectedFilters - Set of selected checkbox filter IDs
 * @param fieldValues - Record of field values for dropdowns, multiselects, and radios
 * @param filterSections - Array of filter sections containing all filter options
 * @returns Array of TargetAudienceGroup objects for API submission
 *
 * @example
 * // Returns:
 * // [
 * //   {
 * //     "group": "Where are they located?",
 * //     "options": {
 * //       "Country": { "sub": ["Nigeria"] },
 * //       "Region / Zone": { "sub": ["North Central", "South West"] },
 * //       "Cities / Local Areas": { "sub": ["Lagos", "Abuja Metro"] }
 * //     }
 * //   },
 * //   {
 * //     "group": "Who are they?",
 * //     "options": {
 * //       "Gender": { "sub": ["Male", "Female"] },
 * //       "Age Group": { "sub": ["18-25", "26-35"] }
 * //     }
 * //   }
 * // ]
 */
export function buildTargetAudiencePayload(
    selectedFilters: Set<string>,
    fieldValues: FieldValues,
    filterSections: FilterSection[]
): TargetAudienceGroup[] {
    const result: TargetAudienceGroup[] = [];

    filterSections.forEach(section => {
        // Map to collect options -> sub values for this section
        const optionsMap = new Map<string, string[]>();

        // Collect all selected labels grouped by their parent option label
        collectSelectedLabels(section.options, selectedFilters, fieldValues, null, optionsMap);

        // Only add section if there are selections
        if (optionsMap.size > 0) {
            const options: Record<string, { sub: string[] }> = {};

            optionsMap.forEach((subValues, optionKey) => {
                // Convert option label to snake_case key
                const snakeCaseKey = optionKey
                    .toLowerCase()
                    .replaceAll(/[^\d a-z]/g, '')
                    .replaceAll(/\s+/g, '_');

                options[snakeCaseKey] = { sub: subValues };
            });

            result.push({
                group: section.title
                    .toLowerCase()
                    .replaceAll(/[^\d a-z]/g, '')
                    .replaceAll(/\s+/g, '_'),
                options,
            });
        }
    });

    return result;
}
