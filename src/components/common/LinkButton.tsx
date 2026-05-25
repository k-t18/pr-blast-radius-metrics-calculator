/**
 * A reusable, flexible link component styled like a button or text action.
 * Ideal for navigational actions where visual consistency with buttons is desired.
 * Supports Tailwind color classes and custom color values via `getColorValue`.
 * Can also be disabled, rendering a non-clickable span with appropriate styling.
 *
 * @component
 * @param {string} to - The destination path for navigation.
 * @param {string} [textColor='text-brand-primary-500'] - The text color, can be a Tailwind class or raw color.
 * @param {string} [fontSize='text-sm'] - Font size class for text styling.
 * @param {'auto' | 'full'} [width='full'] - Controls the link width layout.
 * @param {'left' | 'center' | 'right'} [align='center'] - Alignment of content inside the link.
 * @param {string} [className] - Optional additional class names.
 * @param {boolean} [disabled=false] - Whether the link is disabled.
 * @param {string} [disabledTextColor] - Optional text color when disabled (overrides opacity).
 * @param {ReactNode} children - Content (usually text or icon) inside the link.
 */

import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { getColorValue } from '../../utils/colorHelper';

export interface LinkButtonProperties {
    to: string;
    textColor?: string;
    fontSize?: string;
    width?: 'auto' | 'full';
    align?: 'left' | 'center' | 'right';
    className?: string;
    children: ReactNode;
    disabled?: boolean;
    disabledTextColor?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    targetBlank?: '_self' | '_blank';
}

function LinkButton({
    to,
    textColor = 'text-brand-primary-500',
    fontSize = 'text-sm',
    width = 'full',
    align = 'center',
    className = '',
    children,
    disabled = false,
    disabledTextColor,
    onClick,
    targetBlank = '_self',
}: LinkButtonProperties) {
    const textProperties = disabled ? getColorValue(disabledTextColor ?? textColor, 'text') : getColorValue(textColor, 'text');

    const alignClass =
        {
            left: 'justify-start',
            right: 'justify-end',
            center: 'justify-center',
        }[align] || 'justify-center';

    const baseClasses = [
        fontSize,
        width === 'full' ? 'w-full' : 'w-auto',
        alignClass,
        'flex transition-colors duration-150 font-medium',
        textProperties.className ?? '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    if (disabled) {
        return (
            <span className={`${baseClasses} ${disabledClasses}`} style={textProperties.style || {}}>
                {children}
            </span>
        );
    }

    return (
        <Link
            to={to}
            target={targetBlank}
            rel="noopener noreferrer"
            className={`${baseClasses} ${disabledClasses}`}
            style={textProperties.style || {}}
            onClick={onClick}
        >
            {children}
        </Link>
    );
}

export default LinkButton;
