import { useCallback, memo } from 'react';
import type { JSX } from 'react';
import { CaretRightIcon, CaretDownIcon } from '@phosphor-icons/react';
import Checkbox from '../common/CheckBox';
import { CustomDropdown, type DropdownOption } from '../common/Dropdown';
import { MultiSelect, type MultiSelectOption } from './multiSelect';
import { RadioButtonGroup } from '../common/RadioButton';
import type { FilterOption, FilterSection } from '../../interfaces/mobileSponsorship/filters';
import '../../styles/mobileSponsorshipStyles/step2SelectTargetAudience.css';

/**
 * Props for the HierarchicalFilterPanel component
 */
export interface HierarchicalFilterPanelProperties {
    /** Array of filter sections containing hierarchical options */
    filterSections: FilterSection[];

    /** Set of selected filter IDs */
    selectedFilters: Set<string>;

    /** Field values for special input types (dropdown, multiselect, radio) */
    fieldValues: Record<string, unknown>;

    /** Set of expanded section IDs */
    expandedSections: Set<string>;

    /** Set of expanded option IDs */
    expandedOptions: Set<string>;

    /** Handler for filter selection changes */
    handleFilterChange: (option: FilterOption, checked: boolean) => void;

    /** Handler for field value changes */
    setFieldValues: (value: Record<string, unknown> | ((previous: Record<string, unknown>) => Record<string, unknown>)) => void;

    /** Handler for toggling section expand/collapse */
    toggleSection: (sectionId: string) => void;

    /** Handler for toggling option expand/collapse */
    toggleOption: (optionId: string) => void;

    /** Function to check if an option is fully selected */
    isOptionFullySelected: (option: FilterOption) => boolean;

    /** Function to check if an option is partially selected */
    isOptionPartiallySelected: (option: FilterOption) => boolean;

    /** Optional empty state message */
    emptyMessage?: string;

    /** Optional CSS class name */
    className?: string;
}

/**
 * HierarchicalFilterPanel Component
 *
 * A reusable component for rendering hierarchical filter sections with expandable options.
 * Supports multiple input types: checkbox, dropdown, multiselect, and radio.
 *
 * Features:
 * - Collapsible filter sections with titles and subtitles
 * - Hierarchical checkbox options with parent-child relationships
 * - Indeterminate state for partially selected parent options
 * - Support for dropdown, multiselect, and radio input types
 * - Nested option trees with expand/collapse functionality
 */
function HierarchicalFilterPanel({
    filterSections,
    selectedFilters,
    fieldValues,
    expandedSections,
    expandedOptions,
    handleFilterChange,
    setFieldValues,
    toggleSection,
    toggleOption,
    isOptionFullySelected,
    isOptionPartiallySelected,
    emptyMessage = 'No filters available.',
    className = '',
}: HierarchicalFilterPanelProperties): JSX.Element {
    /**
     * Render nested options recursively
     */
    const renderOption = useCallback(
        (option: FilterOption, level: number = 0): JSX.Element => {
            const hasChildren = option.children && option.children.length > 0;
            const isExpanded = expandedOptions.has(option.id);
            const inputType = option.inputType || 'checkbox';

            // Handle special input types (dropdown, multiselect, radio)
            if (inputType === 'dropdown' && option.dropdownOptions) {
                const currentValue = fieldValues[option.id] as DropdownOption | undefined;
                // Add empty option for deselection at the beginning of options array
                const dropdownOptionsWithEmpty = [{ label: 'None', value: '' }, ...option.dropdownOptions];
                return (
                    <div key={option.id} className="filter-special-field">
                        <div className="filter-field-label">{option.label}</div>
                        <CustomDropdown
                            id={`${option.id}-dropdown`}
                            options={dropdownOptionsWithEmpty}
                            value={currentValue}
                            onChange={value => {
                                // If empty option is selected, set to undefined to clear selection
                                const newValue = value?.value === '' ? undefined : value;
                                setFieldValues(previous => ({
                                    ...previous,
                                    [option.id]: newValue,
                                }));
                            }}
                            placeholder={`Select ${option.label}`}
                            width="100%"
                            className="filter-dropdown"
                        />
                        <div className="filter-field-helper">Default for now</div>
                    </div>
                );
            }

            if (inputType === 'multiselect' && option.multiselectOptions) {
                const currentValue = (fieldValues[option.id] as MultiSelectOption[]) || [];
                return (
                    <div key={option.id} className="filter-special-field">
                        <div className="filter-field-label">{option.label}</div>
                        <MultiSelect
                            id={`${option.id}-multiselect`}
                            name={option.id}
                            value={currentValue}
                            onChange={value => {
                                setFieldValues(previous => ({
                                    ...previous,
                                    [option.id]: value,
                                }));
                            }}
                            options={option.multiselectOptions}
                            placeholder={`Select ${option.label}`}
                            className="filter-multiselect"
                        />
                    </div>
                );
            }

            if (inputType === 'radio' && option.radioOptions) {
                const fieldValue = fieldValues[option.id];
                // RadioButtonGroup requires null, not undefined
                // eslint-disable-next-line unicorn/no-null
                const currentValue: string | number | null = typeof fieldValue === 'string' || typeof fieldValue === 'number' ? fieldValue : null;
                return (
                    <div key={option.id} className="filter-special-field">
                        <div className="filter-field-label">{option.label}</div>
                        <RadioButtonGroup
                            name={option.id}
                            options={option.radioOptions}
                            value={currentValue}
                            onChange={value => {
                                setFieldValues(previous => ({
                                    ...previous,
                                    [option.id]: value,
                                }));
                            }}
                            layout="horizontal"
                            className="filter-radio-group"
                        />
                    </div>
                );
            }

            // All fields are selectable with checkboxes (no subsections)
            const isChecked = selectedFilters.has(option.id) || isOptionFullySelected(option);
            const isIndeterminate = isOptionPartiallySelected(option);

            return (
                <div
                    key={option.id}
                    className={`filter-option ${hasChildren ? 'filter-option-parent' : ''}`}
                    style={{ paddingLeft: `${level * 1.5}rem` }}
                >
                    <div className="filter-option-row">
                        {hasChildren ? (
                            <button
                                type="button"
                                className="filter-expand-button"
                                onClick={() => toggleOption(option.id)}
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            >
                                {isExpanded ? <CaretDownIcon size={24} weight="fill" /> : <CaretRightIcon size={24} weight="fill" />}
                            </button>
                        ) : (
                            <span className="filter-expand-spacer" />
                        )}

                        <Checkbox
                            label={option.label}
                            checked={isChecked}
                            indeterminate={isIndeterminate}
                            onChange={checked => handleFilterChange(option, checked)}
                            className={`filter-checkbox ${hasChildren ? 'filter-checkbox-parent' : ''}`}
                        />
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="filter-option-children">{option.children!.map(child => renderOption(child, level + 1))}</div>
                    )}
                </div>
            );
        },
        [
            expandedOptions,
            selectedFilters,
            isOptionFullySelected,
            isOptionPartiallySelected,
            toggleOption,
            handleFilterChange,
            fieldValues,
            setFieldValues,
        ]
    );

    // Handle empty state
    if (filterSections.length === 0) {
        return (
            <div className={`hierarchical-filter-panel w-full ${className}`}>
                <div style={{ padding: '2rem', textAlign: 'center' }}>{emptyMessage}</div>
            </div>
        );
    }

    return (
        <div className={`hierarchical-filter-panel w-full ${className}`}>
            {filterSections.map(section => {
                const isSectionExpanded = expandedSections.has(section.id);

                return (
                    <div key={section.id} className="filter-section">
                        <button type="button" className="filter-section-header" onClick={() => toggleSection(section.id)}>
                            <div className="filter-section-header-content">
                                <span className="filter-section-icon">
                                    {isSectionExpanded ? <CaretDownIcon size={24} weight="fill" /> : <CaretRightIcon size={24} weight="fill" />}
                                </span>
                                <div className="filter-section-title-group">
                                    <h3 className="filter-section-title">{section.title}</h3>
                                    <p className="filter-section-subtitle">{section.subtitle}</p>
                                </div>
                            </div>
                        </button>

                        {isSectionExpanded && <div className="filter-section-content">{section.options.map(option => renderOption(option))}</div>}
                    </div>
                );
            })}
        </div>
    );
}

export default memo(HierarchicalFilterPanel);
