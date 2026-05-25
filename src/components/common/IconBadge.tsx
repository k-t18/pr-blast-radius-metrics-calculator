/**
 * A reusable badge-style wrapper for icons with customizable size, shape, and background color.
 * Supports both Tailwind-based and custom color values using `getColorValue`.
 *
 * @component
 * @param {React.ReactNode} icon - The icon element to render inside the badge.
 * @param {'sm' | 'md' | 'lg'} [size='md'] - The size of the badge (affects width and height).
 * @param {'square' | 'rounded'} [shape='square'] - Defines whether the badge has rounded or square corners.
 * @param {string} [bgColor='bg-gray-200'] - Background color, supports Tailwind or custom hex/rgb values.
 * @param {string} [className] - Additional CSS classes for custom styling.
 *
 */

import React from 'react';
import { getColorValue } from '../../utils/colorHelper';

type IconBadgeProperties = {
    icon: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    shape?: 'square' | 'rounded';
    bgColor?: string;
    className?: string;
};

const SIZE_CONFIG = {
    sm: 28,
    md: 32,
    lg: 64,
};

function IconBadge({ icon, size = 'md', shape = 'square', bgColor = 'bg-gray-200', className = '' }: IconBadgeProperties) {
    const wrapperSize = SIZE_CONFIG[size];
    const borderRadiusClass = shape === 'rounded' ? 'rounded-full' : 'rounded-[4px]';
    const bg = getColorValue(bgColor, 'bg');

    return (
        <div
            className={`${borderRadiusClass} flex items-center justify-center ${bg.className || ''} ${className}`}
            style={{
                width: wrapperSize,
                height: wrapperSize,
                ...bg.style,
            }}
        >
            {icon}
        </div>
    );
}

export default IconBadge;
