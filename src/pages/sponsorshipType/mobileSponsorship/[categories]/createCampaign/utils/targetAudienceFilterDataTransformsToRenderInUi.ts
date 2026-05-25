import type { DropdownOption } from '../../../../../../components/common/Dropdown';
import type { RadioButtonOption } from '../../../../../../components/common/RadioButton';
import type { MultiSelectOption } from '../../../../../../components/form-fields/multiSelect';
import type { FilterOption, FilterSection } from '../../../../../../interfaces/mobileSponsorship/filters';
import type { TargetAudienceFilterDataItem } from '../../../../../../services/sponsor_api/getTargetAudienceFilterData.api';

/**
 * Transform API response item to FilterOption
 * Recursively processes children to build the filter option tree
 *
 * Example input (single node):
 * {
 *   name: 'country',
 *   title: 'Country',
 *   sub_title: null,
 *   type: 'Dropdown',
 *   children: [
 *     { name: 'nigeria', title: 'Nigeria', sub_title: null, type: '', children: [] }
 *   ]
 * }
 *
 * Example output (FilterOption):
 * {
 *   id: 'country',
 *   label: 'Country',
 *   inputType: 'dropdown',
 *   dropdownOptions: [{ label: 'Nigeria', value: 'nigeria' }]
 * }
 */
export const transformItemToFilterOption = (item: TargetAudienceFilterDataItem): FilterOption | undefined => {
    // Skip items without title (these are likely just placeholder nodes)
    if (!item.title && item.children.length === 0) {
        return undefined;
    }

    // Determine input type based on API type field
    let inputType: 'checkbox' | 'dropdown' | 'multiselect' | 'radio' | undefined;
    let dropdownOptions: DropdownOption[] | undefined;
    let multiselectOptions: MultiSelectOption[] | undefined;
    let radioOptions: RadioButtonOption[] | undefined;

    const apiType = item.type?.toLowerCase() || '';

    switch (apiType) {
        case 'dropdown': {
            inputType = 'dropdown';
            // For dropdown, children become options
            dropdownOptions = item.children.map(child => ({
                label: child.title || child.name,
                value: child.name,
            }));
            break;
        }
        case 'multiselect': {
            inputType = 'multiselect';
            // For multiselect, children become options
            multiselectOptions = item.children.map(child => ({
                label: child.title || child.name,
                value: child.name,
            }));
            break;
        }
        case 'radio': {
            inputType = 'radio';
            // For radio buttons, children become options
            radioOptions = item.children.map(child => ({
                value: child.name,
                label: child.title || child.name,
            }));
            break;
        }
        default: {
            // Default to checkbox for all other items - all fields are selectable
            inputType = 'checkbox';
            break;
        }
    }

    // Transform children recursively
    // For dropdown/multiselect/radio, children are already converted to options above
    // So we skip adding them as FilterOption children
    const children: FilterOption[] =
        inputType === 'dropdown' || inputType === 'multiselect' || inputType === 'radio'
            ? []
            : item.children.map(child => transformItemToFilterOption(child)).filter((option): option is FilterOption => option !== undefined);

    const filterOption: FilterOption = {
        id: item.name,
        label: item.title || item.name,
        ...(children.length > 0 && { children }),
        ...(inputType && { inputType }),
        ...(dropdownOptions && { dropdownOptions }),
        ...(multiselectOptions && { multiselectOptions }),
        ...(radioOptions && { radioOptions }),
    };

    return filterOption;
};
/**
 * Transform API response to FilterSection array
 * Groups items by sections (items with title and sub_title at root level)
 *
 * Full example input (API response data):
 * [
 *   { "name": "12-18", "title": null, "sub_title": null, "type": null, "children": [] },
 *   {
 *     "name": "target_audience-0170",
 *     "title": "Where are they located?",
 *     "sub_title": "(Country, state, region etc)",
 *     "type": "",
 *     "children": [
 *       {
 *         "name": "target_audience-0171",
 *         "title": "Country",
 *         "type": "dropdown",
 *         "children": [
 *           { "name": "target_audience-0172", "title": "Nigeria", "type": "", "children": [] },
 *           { "name": "target_audience-0173", "title": "Uganda", "type": "", "children": [] }
 *         ]
 *       },
 *       {
 *         "name": "target_audience-0174",
 *         "title": "Region / Zone",
 *         "type": "checkbox",
 *         "children": [
 *           { "name": "target_audience-0175", "title": "All regions", "type": "", "children": [] },
 *           {
 *             "name": "target_audience-0176",
 *             "title": "North Central",
 *             "type": "checkbox",
 *             "children": [
 *               { "name": "target_audience-0184", "title": "Ghatkopar", "type": "", "children": [] },
 *               { "name": "target_audience-0185", "title": "Ghatkopar west", "type": "", "children": [] }
 *             ]
 *           }
 *         ]
 *       },
 *       {
 *         "name": "target_audience-0181",
 *         "title": "Cities / Local Areas",
 *         "type": "multiselect",
 *         "children": [
 *           { "name": "target_audience-0182", "title": "Ahuja Metro", "type": "", "children": [] },
 *           { "name": "target_audience-0183", "title": "Mumbai", "type": "", "children": [] }
 *         ]
 *       }
 *     ]
 *   },
 *   {
 *     "name": "target_audience-0177",
 *     "title": "Who are they? ",
 *     "sub_title": "(Detailed Demographics)",
 *     "type": "",
 *     "children": [
 *       {
 *         "name": "target_audience-0178",
 *         "title": "Gender",
 *         "type": "checkbox",
 *         "children": [
 *           { "name": "Female", "title": "Female", "type": "", "children": [] },
 *           { "name": "Male", "title": "Male", "type": "", "children": [] }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 *
 * Full example output (FilterSection):
 * [
 *   {
 *     id: 'target_audience-0170',
 *     title: 'Where are they located?',
 *     subtitle: '(Country, state, region etc)',
 *     options: [
 *       {
 *         id: 'target_audience-0171',
 *         label: 'Country',
 *         inputType: 'dropdown',
 *         dropdownOptions: [
 *           { label: 'Nigeria', value: 'target_audience-0172' },
 *           { label: 'Uganda', value: 'target_audience-0173' }
 *         ]
 *       },
 *       {
 *         id: 'target_audience-0174',
 *         label: 'Region / Zone',
 *         inputType: 'checkbox',
 *         children: [
 *           { id: 'target_audience-0175', label: 'All regions', inputType: 'checkbox' },
 *           {
 *             id: 'target_audience-0176',
 *             label: 'North Central',
 *             inputType: 'checkbox',
 *             children: [
 *               { id: 'target_audience-0184', label: 'Ghatkopar', inputType: 'checkbox' },
 *               { id: 'target_audience-0185', label: 'Ghatkopar west', inputType: 'checkbox' }
 *             ]
 *           }
 *         ]
 *       },
 *       {
 *         id: 'target_audience-0181',
 *         label: 'Cities / Local Areas',
 *         inputType: 'multiselect',
 *         multiselectOptions: [
 *           { label: 'Ahuja Metro', value: 'target_audience-0182' },
 *           { label: 'Mumbai', value: 'target_audience-0183' }
 *         ]
 *       }
 *     ]
 *   },
 *   {
 *     id: 'target_audience-0177',
 *     title: 'Who are they? ',
 *     subtitle: '(Detailed Demographics)',
 *     options: [
 *       {
 *         id: 'target_audience-0178',
 *         label: 'Gender',
 *         inputType: 'checkbox',
 *         children: [
 *           { id: 'Female', label: 'Female', inputType: 'checkbox' },
 *           { id: 'Male', label: 'Male', inputType: 'checkbox' }
 *         ]
 *       }
 *     ]
 *   }
 * ]
 */
export const transformToFilterSections = (items: TargetAudienceFilterDataItem[]): FilterSection[] => {
    return items
        .filter(item => item.title && item.sub_title)
        .map(item => {
            // Transform children to filter options
            const options = item.children
                .map(child => transformItemToFilterOption(child))
                .filter((option): option is FilterOption => option !== undefined);

            // Type assertion is safe because we filtered for items with title and sub_title
            return {
                id: item.name,
                title: item.title as string,
                subtitle: item.sub_title as string,
                options,
            };
        })
        .filter(section => section.options.length > 0 || section.title);
};
