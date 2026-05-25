import React from 'react';
import IconBadge from '../../../../components/common/IconBadge';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import DescriptionText from '../../../../components/common/DescriptionText';
import '../../../../styles/mobileSponsorshipStyles/categoryCard.css';

export interface CategoryCardProperties {
    title?: string;
    price: string;
    base_cpc_cpm: string;
    tag?: string;
    description?: string;
    icon: React.ReactNode;
    isSelected?: boolean;
    tagIcon?: React.ReactNode;
    iconBgColor?: string;
    className?: string;
    onClick?: () => void;
}

export default function CategoryCard({
    title,
    price,
    base_cpc_cpm,
    tag,
    description,
    icon,
    isSelected = false,
    tagIcon,
    iconBgColor = '#FFF9F0',
    className = '',
    onClick,
}: CategoryCardProperties) {
    const cardClassName = `category-card ${isSelected ? 'selected' : ''} ${className}`.trim();

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (onClick) {
                onClick();
            }
        }
    };

    return (
        <div
            className={`relative border border-border-gray-600 rounded-lg p-4 flex flex-col justify-between gap-4 ${cardClassName}`}
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className="flex flex-col" style={{ gap: '8px' }}>
                {/* Header with badge */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <IconBadge icon={icon} size="sm" shape="square" bgColor={iconBgColor} />
                        <HeaderTitle text={title} size="md" weight="medium" />
                    </div>
                </div>

                {/* Price */}
                {price && (
                    <div className="flex items-center gap-1">
                        <CurrencySymbol symbol="₦" className="text-tertiary-text text-xs" />
                        <DescriptionText text={price} color="#636363" size="xs" weight="normal" />
                    </div>
                )}
                {base_cpc_cpm && (
                    <div className="flex items-center gap-1">
                        <DescriptionText text={base_cpc_cpm} color="#636363" size="xs" weight="normal" />
                    </div>
                )}
                {tag && (
                    <div className="flex items-center gap-1">
                        {tagIcon || ''}
                        <DescriptionText text={tag} color="#636363" size="xs" weight="normal" />
                    </div>
                )}

                {/* Description */}
                {description && <DescriptionText text={description} color="text-primary-text" size="xs" />}
            </div>
        </div>
    );
}
