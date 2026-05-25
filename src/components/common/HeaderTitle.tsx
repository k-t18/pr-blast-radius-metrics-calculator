/**
 * A reusable heading component for consistent typography across the app.
 * Supports multiple text sizes, weights, colors, and disabled state.
 *
 * @component
 * @param {string} text - The title text to display.
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'} [size='lg'] - Text size.
 * @param {'normal' | 'medium' | 'semibold' | 'bold'} [weight='semibold'] - Font weight.
 * @param {string} [color='text-primary-text'] - Text color (Tailwind or custom).
 * @param {boolean} [disabled=false] - If true, renders the text in gray and lowers emphasis.
 * @param {string} [className] - Additional Tailwind or custom CSS classes.
 *
 */

interface HeaderTitleProperties {
    text: string | React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: string;
    disabled?: boolean;
    className?: string;
}

const SIZE_MAP = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
};

const WEIGHT_MAP = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
};

function HeaderTitle({
    text,
    size = 'lg',
    weight = 'semibold',
    color = 'text-primary-text',
    disabled = false,
    className = 'font-ubuntu',
}: HeaderTitleProperties) {
    return (
        <h3
            className={`
                ${SIZE_MAP[size]} 
                ${WEIGHT_MAP[weight]} 
                ${disabled ? 'text-gray-400' : color} 
                ${className}
            `}
        >
            {text}
        </h3>
    );
}

export default HeaderTitle;
