/**
 * A reusable, lightweight text component used for displaying paragraph or secondary text.
 * Supports dynamic font size, weight, and color customization using Tailwind classes or raw values.
 *
 * @component
 * @param {string} text - The text content to display.
 * @param {'xs' | 'sm' | 'md' | 'lg'} [size='sm'] - Controls the text size.
 * @param {'normal' | 'medium' | 'semibold'} [weight='normal'] - Sets the font weight.
 * @param {string} [color='text-secondary-text'] - Text color (Tailwind class or custom color value).
 * @param {string} [className] - Optional additional CSS classes.
 *
 */

import { getColorValue } from '../../utils/colorHelper';

interface DescriptionProperties {
    text: string;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    weight?: 'normal' | 'medium' | 'semibold';
    color?: string;
    className?: string;
}

/** Tailwind text size map */
const SIZE_MAP = {
    xxs: 'text-[10px]',
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
};

/** Tailwind font weight map */
const WEIGHT_MAP = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
};

function DescriptionText({ text, size = 'sm', weight = 'normal', color = 'text-secondary-text', className = '' }: DescriptionProperties) {
    const colorProperties = getColorValue(color, 'text');

    return (
        <p
            className={`
                ${SIZE_MAP[size]} 
                ${WEIGHT_MAP[weight]} 
                ${className} 
                ${colorProperties.className ?? ''}
            `}
            style={colorProperties.style}
        >
            {text}
        </p>
    );
}

export default DescriptionText;
