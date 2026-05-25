import type { AutoCompleteCompleteEvent, AutoCompleteChangeEvent } from 'primereact/autocomplete';
import { AutoComplete } from 'primereact/autocomplete';
import { OverlayPanel } from 'primereact/overlaypanel';
import type { TableFilterProperties } from '../../../interfaces/common/filter.types';
import ActionButton from '../ActionButton';
import { useCustomTableFilter } from '../../../hooks/tableFilter/useCustomTableFilter';
import { FunnelSimpleIcon, X } from '../../icons';

function FieldItemTemplate({ label }: { label: string }) {
    return <div className="px-3 py-2 text-xs">{label}</div>;
}

function ValueItemTemplate({ value }: { value: string }) {
    return <div className="px-3 py-2 text-xs">{value}</div>;
}

const fieldItemTemplate = (label: string) => <FieldItemTemplate label={label} />;
const valueItemTemplate = (value: string) => <ValueItemTemplate value={value} />;

function CustomTableFilter<Value extends string>({
    options,
    onClear,
    valueOptions,
    onApply,
    initialFilters,
    onValueTextChange,
    className = '',
}: TableFilterProperties<Value>) {
    const {
        rows,
        fieldSuggestions,
        valueSuggestions,
        activeCount,
        overlayReference,
        fieldAutocompleteReferences,
        valueAutocompleteReferences,
        handleToggle,
        handleFieldSearch,
        handleFieldFocus,
        handleFieldChange,
        handleValueSearch,
        handleValueFocus,
        handleValueChange,
        handleClear,
        handleAddFilterRow,
        handleRemoveRow,
        handleApply,
    } = useCustomTableFilter({
        options,
        valueOptions,
        initialFilters,
        onClear,
        onApply,
        onValueTextChange,
    });

    return (
        <div className={`flex items-center mb-2 ${className}`}>
            <div className="inline-flex items-center border border-[#D6D6D6] rounded-sm overflow-hidden bg-white h-9">
                <ActionButton
                    onClick={handleToggle}
                    bgColor={activeCount > 0 ? 'bg-[#A7A7A7]' : 'bg-white'}
                    textColor="text-black"
                    borderColor="border-transparent"
                    borderRadius="rounded-none"
                    width="auto"
                    className={`flex items-center gap-2 p-2 text-sm h-full ${activeCount > 0 ? '' : 'hover:bg-gray-50'}`}
                >
                    <FunnelSimpleIcon size={20} color="text-black" />
                    <span className="text-black text-xs">Filters</span>
                    {activeCount > 0 ? (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-800 text-xs font-medium">
                            {activeCount}
                        </span>
                    ) : undefined}
                </ActionButton>

                <ActionButton
                    onClick={handleClear}
                    bgColor={activeCount > 0 ? 'bg-[#ebebeb]' : 'bg-white'}
                    textColor="text-black"
                    borderColor="border-[#D6D6D6]"
                    borderRadius="rounded-none"
                    width="auto"
                    className="flex items-center justify-center px-2 py-3 h-full border-l hover:bg-gray-200"
                >
                    <X size={16} color="text-black" />
                </ActionButton>
            </div>

            <OverlayPanel ref={overlayReference} className="custom-filter-overlay-panel">
                <div className="w-[500px] p-4 flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        {rows.length > 0 &&
                            rows.map(row => {
                                const fieldSuggestionsForRow = fieldSuggestions.get(row.id) ?? [];
                                const valueSuggestionsForRow = valueSuggestions.get(row.id) ?? [];

                                return (
                                    <div key={row.id} className="flex items-center gap-2 w-full">
                                        <div className="flex flex-1 items-center gap-2 min-w-0">
                                            {/* FIELD AUTOCOMPLETE */}
                                            <AutoComplete
                                                ref={element => {
                                                    if (element) {
                                                        fieldAutocompleteReferences.current.set(row.id, element);
                                                    } else {
                                                        fieldAutocompleteReferences.current.delete(row.id);
                                                    }
                                                }}
                                                value={row.fieldText}
                                                suggestions={fieldSuggestionsForRow}
                                                completeMethod={(event: AutoCompleteCompleteEvent) => handleFieldSearch(row.id, event.query)}
                                                onChange={(event: AutoCompleteChangeEvent) => handleFieldChange(row.id, event.value as string)}
                                                onFocus={() => handleFieldFocus(row.id)}
                                                className="flex-1 min-w-0"
                                                itemTemplate={fieldItemTemplate}
                                                panelClassName="custom-autocomplete-panel rounded-md border border-[#D6D6D6] bg-white shadow-lg"
                                                inputClassName="w-full rounded-md border border-[#D6D6D6] bg-white px-3 py-2 text-xs text-black"
                                                style={{ width: '100%' }}
                                                inputStyle={{ width: '100%' }}
                                            />

                                            {/* VALUE AUTOCOMPLETE */}
                                            <AutoComplete
                                                ref={element => {
                                                    if (element) {
                                                        valueAutocompleteReferences.current.set(row.id, element);
                                                    } else {
                                                        valueAutocompleteReferences.current.delete(row.id);
                                                    }
                                                }}
                                                value={row.valueText}
                                                suggestions={valueSuggestionsForRow}
                                                completeMethod={(event: AutoCompleteCompleteEvent) =>
                                                    handleValueSearch(row.id, row.field, event.query)
                                                }
                                                onChange={(event: AutoCompleteChangeEvent) =>
                                                    handleValueChange(row.id, row.field, (event.value as string) || '')
                                                }
                                                onFocus={() => {
                                                    if (row.field) {
                                                        handleValueFocus(row.id, row.field);
                                                    }
                                                }}
                                                className="flex-1 min-w-0"
                                                itemTemplate={valueItemTemplate}
                                                panelClassName="custom-autocomplete-panel rounded-md border border-[#D6D6D6] bg-white shadow-lg"
                                                inputClassName="w-full rounded-md border border-[#D6D6D6] bg-white px-3 py-2 text-xs text-black"
                                                style={{ width: '100%' }}
                                                inputStyle={{ width: '100%' }}
                                                disabled={!row.field}
                                            />
                                        </div>

                                        <ActionButton
                                            onClick={() => handleRemoveRow(row.id)}
                                            bgColor="bg-transparent"
                                            textColor="text-black"
                                            borderColor="border-transparent"
                                            borderRadius="rounded"
                                            width="auto"
                                            className="p-1 min-w-0"
                                        >
                                            <X size={14} color="text-black" />
                                        </ActionButton>
                                    </div>
                                );
                            })}
                    </div>

                    <hr className="border-[#E5E7EB]" />

                    <div>
                        <ActionButton
                            onClick={handleAddFilterRow}
                            bgColor="bg-transparent"
                            textColor="text-black"
                            borderColor="border-transparent"
                            borderRadius="rounded"
                            width="auto"
                            className="text-xs hover:underline p-0"
                        >
                            + Add a Filter
                        </ActionButton>
                    </div>

                    <div className="flex justify-end gap-2 mt-2">
                        <ActionButton
                            onClick={handleClear}
                            bgColor="bg-white"
                            textColor="text-black"
                            borderColor="border-[#D6D6D6]"
                            borderRadius="rounded-md"
                            width="auto"
                            className="px-3 py-1 text-xs hover:bg-[#F9FAFB]"
                        >
                            Clear Filters
                        </ActionButton>

                        <ActionButton
                            onClick={handleApply}
                            textColor="text-white"
                            borderColor="border-transparent"
                            borderRadius="rounded-md"
                            width="auto"
                            className="px-3 py-1 text-xs"
                        >
                            Apply Filters
                        </ActionButton>
                    </div>
                </div>
            </OverlayPanel>
        </div>
    );
}

export default CustomTableFilter;
