import { useMemo, useRef } from 'react';
import type { MouseEvent } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FunnelSimpleIcon, XIcon } from '@phosphor-icons/react';
import type { TableFilterProperties } from '../../interfaces/common/filter.types';

/**
 * Renders a Figma-inspired filter control with a toggle button and overlay menu.
 *
 * @param options - Filter values presented in the overlay list.
 * @param selected - Currently active filter value or `null` when cleared.
 * @param onSelect - Invoked when a filter is chosen.
 * @param onClear - Invoked when the active filter should reset.
 */
export function TableFilter<Value extends string>({ options, selected, onSelect, onClear, className }: TableFilterProperties<Value>) {
    const overlayReference = useRef<OverlayPanel>(null);
    const optionLookup = useMemo(() => new Map(options.map(option => [option.value, option.label])), [options]);
    const activeCount = selected ? 1 : 0;

    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        overlayReference.current?.toggle(event);
    };

    const handleSelect = (value: Value) => {
        if (!onSelect) return;
        onSelect(value);
        overlayReference.current?.hide();
    };

    const handleClear = () => {
        onClear();
        overlayReference.current?.hide();
    };

    return (
        <div className={`flex items-center mb-2 ${className}`}>
            <div className="inline-flex items-center border border-[#D6D6D6] rounded-[4px] overflow-hidden bg-white h-[36px]">
                <button
                    type="button"
                    onClick={handleToggle}
                    className={`flex items-center gap-2 p-2 text-sm transition-colors cursor-pointer ${
                        activeCount > 0 ? 'bg-[#A7A7A7]' : 'bg-white hover:bg-gray-50'
                    }`}
                >
                    <FunnelSimpleIcon size={20} className="text-black" strokeWidth={2} />
                    <span className="text-black text-xs">Filters</span>
                    {activeCount > 0 ? (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-gray-800 text-xs font-medium">
                            {activeCount}
                        </span>
                    ) : undefined}
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className={`flex items-center justify-center px-2 py-3 cursor-pointer transition-colors
            ${activeCount > 0 ? 'bg-[#ebebeb]' : 'bg-white'}
            hover:bg-gray-200 border-l border-[#D6D6D6]
        `}
                >
                    <XIcon size={16} className="text-black" strokeWidth={2} />
                </button>
            </div>
            <OverlayPanel ref={overlayReference} className="custom-filter-overlay-panel">
                <div className="flex flex-col gap-2 p-2">
                    {options.map(option => (
                        <button
                            type="button"
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`text-left px-3 py-2 text-xs rounded transition-colors ${
                                selected === option.value ? 'text-black' : 'text-black hover:bg-gray-100'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                    {selected ? <span className="px-3 text-xs text-gray-500">Selected: {optionLookup.get(selected)}</span> : undefined}
                </div>
            </OverlayPanel>
        </div>
    );
}
