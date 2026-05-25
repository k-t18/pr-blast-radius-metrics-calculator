/**
 * CartSection Component
 *
 * Renders a section in the cart page that includes:
 * - Section header with title + "Clear All" button
 * - Optional parent checkbox for selecting all items
 * - List of ItemRow components
 * - Optional children content (e.g., recommendations, notes)
 * - Total section (conditionally shown)
 *
 * Props:
 * - title: Section title
 * - items: List of cart or recommended item rows
 * - onClearAll: Clears all items in this section
 * - onDeleteItem: Handles delete action for individual items
 * - total: Sum of item prices (string)
 * - showTotal: Toggle total visibility
 * - className: Wrapper class for layout control
 */

import { ItemRow, type ItemRowProperties } from './CartItemRow';
import HeaderTitle from '../../../components/common/HeaderTitle';
import Checkbox from '../../../components/common/CheckBox';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import ActionButton from '../../../components/common/ActionButton';

interface CartSectionProperties {
    title: string;
    episodeNameForLink: string;
    items: ItemRowProperties[];
    onClearAll?: () => void;
    onDeleteItem?: (id: string) => void;
    total?: string;
    showTotal?: boolean;
    className: string;
    isEpisodeFullySelected?: boolean;
    onToggleEpisodeSelection?: (selectAll: boolean) => void;
}

export function CartSection({
    title,
    episodeNameForLink,
    items,
    onClearAll,
    onDeleteItem,
    total,
    showTotal = true,
    className,
    isEpisodeFullySelected = false,
    onToggleEpisodeSelection,
}: CartSectionProperties) {
    const handleToggle = (checked: boolean) => {
        onToggleEpisodeSelection?.(checked);
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {/* =========================
                HEADER ROW (Checkbox + Title + Clear All)
               ========================= */}
            <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                    {/* Parent select-all checkbox */}
                    <Checkbox checked={isEpisodeFullySelected} onChange={handleToggle} />

                    {/* Section Title */}
                    <HeaderTitle text={title} color="text-primary-text" size="md" weight="normal" />
                </div>

                {/* Clear All button (only when items exist) */}
                {items.length > 0 && onClearAll && (
                    <ActionButton
                        onClick={onClearAll}
                        bgColor="bg-transparent"
                        width="auto"
                        textColor="text-primary-text"
                        className="text-sm font-normal p-0!"
                    >
                        Clear All
                    </ActionButton>
                )}
            </div>

            {/* =========================
                ITEMS LIST
               ========================= */}
            <div className="flex flex-col gap-2">
                {items.length > 0 ? (
                    items.map(item => <ItemRow key={item.id} {...item} episodeName={episodeNameForLink} onDelete={id => onDeleteItem?.(id)} />)
                ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No items in this section</p>
                )}
            </div>

            {/* =========================
                TOTAL ROW
               ========================= */}
            {showTotal && items.length > 0 && total !== undefined && (
                <div className="flex items-center justify-between p-2">
                    <HeaderTitle text="Episode Total" size="md" color="text-primary-text" weight="medium" />

                    {/* "-" when total is 0 */}
                    {total === '0' ? (
                        <HeaderTitle text="-" size="xl" color="text-primary-text" weight="medium" />
                    ) : (
                        <div className="flex items-center gap-1">
                            <CurrencySymbol className="font-medium text-xl text-gray-900" />
                            <HeaderTitle text={total} size="xl" color="text-primary-text" weight="medium" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
