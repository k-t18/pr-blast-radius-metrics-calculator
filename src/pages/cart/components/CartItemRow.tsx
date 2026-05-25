/**
 * ItemRow Component
 *
 * Renders a single item row for:
 * - Cart items (with checkbox, delete button, USP/RV values)
 * - Recommended items (with Add to Cart button, subtitle)
 *
 * Features:
 * - Supports two variants: "cart" | "recommended"
 * - Reusable UI structure with dynamic layout based on variant
 * - Displays icon, title, pricing, USP/RV values and action buttons
 * - Checkbox state handled internally for cart mode
 */

import { type ReactNode } from 'react';
import Checkbox from '../../../components/common/CheckBox';
import IconBadge from '../../../components/common/IconBadge';
import HeaderTitle from '../../../components/common/HeaderTitle';
import DescriptionText from '../../../components/common/DescriptionText';
import { CurrencySymbol } from '../../../components/common/CurrencySymbol';
import ActionButton from '../../../components/common/ActionButton';
import LinkButton from '../../../components/common/LinkButton';
import { Check } from '../../../components/icons';

type ItemVariant = 'cart' | 'recommended';

export interface ItemRowProperties {
    id: string;
    variant: ItemVariant;
    className?: string;

    icon: ReactNode;
    iconBgColor?: string;

    name: string;
    subtitle?: string;

    price: string;
    usp?: string;
    rv?: string;
    episodeName?: string | undefined;
    onDelete?: (id: string) => void;
    onAddToCart?: () => void;
    buttonText?: string;
    isAddedToCart?: boolean;
    showSelectSquareBtn?: boolean;
    isChecked?: boolean;
    onToggleSelection?: (id: string) => void;
}

export function ItemRow({
    id,
    variant,
    className,
    icon,
    iconBgColor,
    name,
    subtitle,
    price,
    usp,
    rv,
    episodeName,
    onDelete,
    onAddToCart,
    buttonText,
    isAddedToCart = false,
    showSelectSquareBtn,
    isChecked = false,
    onToggleSelection,
}: ItemRowProperties) {
    const handleToggle = () => {
        onToggleSelection?.(id);
    };
    const squareLink = episodeName
        ? `/sponsorship-type/studio-show/select-squares?episode_name=${encodeURIComponent(episodeName)}`
        : '/sponsorship-type/studio-show/select-squares';
    return (
        <div className={`flex items-stretch gap-4 px-2 py-1 ${className}`}>
            {/* =========================
                CART MODE → Checkbox
               ========================= */}
            {variant === 'cart' && <Checkbox checked={isChecked} onChange={handleToggle} />}

            {/* =========================
                Left Icon Badge
               ========================= */}
            <IconBadge icon={icon} size="lg" bgColor={iconBgColor} />

            {/* =========================
                Middle Content Section
               ========================= */}
            <div
                className={`flex items-stretch flex-1 gap-1
                    ${variant === 'recommended' ? 'flex-col justify-between py-0.5' : 'flex-row py-1.5'}
                `}
            >
                {/* Content Column */}
                <div
                    className={`flex flex-col gap-1 flex-1 min-w-0
                    ${variant === 'recommended' ? 'justify-start gap-1.5' : 'justify-between'}
                `}
                >
                    {/* Title */}
                    <HeaderTitle text={name} color="text-primary-text" size={variant === 'recommended' ? 'sm' : 'md'} weight="normal" />

                    {/* Recommended-only subtitle */}
                    {subtitle && variant === 'recommended' && (
                        <DescriptionText text={subtitle} size="xxs" color="text-tertiary-text" className="leading-3" />
                    )}

                    {/* Cart-only Delete Action */}
                    {variant === 'cart' && (
                        <ActionButton
                            bgColor="#FFFFFF"
                            textColor="text-primary-text"
                            align="left"
                            className="text-xs font-normal underline p-0!"
                            onClick={() => onDelete?.(id)}
                        >
                            Delete
                        </ActionButton>
                    )}
                </div>

                {/* =========================
                    Right Price Block
                   ========================= */}
                {!showSelectSquareBtn && (
                    <div className="flex flex-col justify-between text-right">
                        {/* Price */}
                        {price !== '0' && (
                            <div
                                className={`flex gap-1
                                ${variant === 'recommended' ? 'justify-start' : 'justify-end'}
                            `}
                            >
                                <CurrencySymbol
                                    className={`text-primary-text font-medium
                                    ${variant === 'recommended' ? 'text-xs' : 'text-sm'}
                                `}
                                />
                                <DescriptionText
                                    text={price}
                                    size={variant === 'recommended' ? 'xs' : 'sm'}
                                    color="text-primary-text"
                                    weight="medium"
                                />
                            </div>
                        )}

                        {/* Cart-only USP + RV */}
                        {variant === 'cart' && !showSelectSquareBtn && (
                            <div className="flex justify-end gap-1 items-center">
                                {usp && (
                                    <div className="flex gap-1">
                                        <DescriptionText text="USP" size="xxs" color="text-secondary-text" />
                                        <CurrencySymbol className="text-secondary-text text-[10px]" />
                                        <DescriptionText text={usp} size="xxs" color="text-secondary-text" />
                                    </div>
                                )}

                                {rv && <DescriptionText text="+" size="xxs" color="text-secondary-text" />}

                                {rv && (
                                    <div className="flex gap-1">
                                        <DescriptionText text="RV" size="xxs" color="text-secondary-text" />
                                        <CurrencySymbol className="text-secondary-text text-[10px]" />
                                        <DescriptionText text={rv} size="xxs" color="text-secondary-text" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* =========================
                Recommended Mode → Add to Cart / View
               ========================= */}
            {variant === 'recommended' && (
                <div className="flex items-center">
                    <ActionButton
                        onClick={onAddToCart}
                        textColor={isAddedToCart ? 'text-brand-primary-800' : 'text-primary-text'}
                        borderColor={isAddedToCart ? 'border-transparent' : 'border-border-gray-600'}
                        borderRadius="rounded-sm"
                        className="py-2 px-1.5! h-fit text-xs! font-normal bg-transparent border rounded whitespace-nowrap"
                    >
                        {isAddedToCart ? (
                            <>
                                <Check />
                                Added to Cart
                            </>
                        ) : (
                            buttonText || 'Add to Cart'
                        )}
                    </ActionButton>
                </div>
            )}
            {variant === 'cart' && showSelectSquareBtn && (
                <div className="flex items-center">
                    <LinkButton
                        to={squareLink}
                        textColor="text-white"
                        className="p-2! h-fit text-sm font-ubuntu font-medium bg-brand-primary-500 border-none border-brand-primary-500 whitespace-nowrap rounded-sm"
                    >
                        Select Squares
                    </LinkButton>
                </div>
            )}
        </div>
    );
}

export default ItemRow;
