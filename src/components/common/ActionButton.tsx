/**
 * A reusable, theme-aware button used across the application.
 * It supports full customization of:
 * - Background, text, and border colors (via Tailwind classes or custom values)
 * - Border radius shape
 * - Width (auto or full)
 * - Alignment of inner content (left, center, right)
 * - Disabled state
 *
 * This button automatically merges Tailwind and custom color styles using `getColorValue`.
 *
 * @component
 * @param {string} [bgColor='bg-brand-primary-500'] - Background color (Tailwind or custom)
 * @param {string} [textColor='text-white'] - Text color
 * @param {string} [borderColor='border-transparent'] - Border color
 * @param {string} [borderRadius='rounded-lg'] - Border radius shape
 * @param {'left' | 'center' | 'right'} [align='center'] - Content alignment inside the button
 * @param {'auto' | 'full'} [width='full'] - Button width type
 * @param {boolean} [isDisabled=false] - Disabled state
 * @param {ReactNode} children - Button inner content (text, icon, etc.)
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { getColorValue } from '../../utils/colorHelper';

export interface ActionButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    isDisabled?: boolean;
    children: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ActionButton({
    bgColor = 'bg-brand-primary-500',
    textColor = 'text-white',
    borderColor = 'border-transparent',
    borderRadius = 'rounded-lg',
    align = 'center',
    width = 'min-w-[123px]',
    isDisabled = false,
    className = '',
    type = 'button',
    children,
    onClick,
    ...restProperties
}: ActionButtonProperties) {
    const bgProperties = getColorValue(bgColor, 'bg');
    const textProperties = getColorValue(textColor, 'text');
    const borderProperties = getColorValue(borderColor, 'border');

    const alignClass =
        {
            left: 'justify-start',
            right: 'justify-end',
            center: 'justify-center',
        }[align] || 'justify-center';

    return (
        <button
            // eslint-disable-next-line react/button-has-type
            type={type}
            disabled={isDisabled}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProperties}
            className={[
                'flex items-center gap-2 transition-colors border duration-150 font-medium px-2 py-2',
                width === 'full' ? 'w-full' : width,
                alignClass,
                borderRadius,
                isDisabled ? 'cursor-not-allowed disabled:bg-border-gray-600 disabled:text-border-gray-800' : 'cursor-pointer',
                borderProperties.className ?? '',
                bgProperties.className ?? '',
                textProperties.className ?? '',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            style={{
                ...bgProperties.style,
                ...textProperties.style,
                ...borderProperties.style,
            }}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default ActionButton;
