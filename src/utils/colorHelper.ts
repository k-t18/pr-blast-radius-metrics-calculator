/**
 * Checks if the given color value is a custom (raw) color like hex, rgb(), or hsl().
 */
export const isCustomColor = (value?: string): boolean => {
    if (!value) return false;
    return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
};

/**
 * Returns appropriate class name or inline style for a given color input.
 * If Tailwind class → returns { className: "..." }
 * If custom hex/rgb/hsl → returns { style: { color: ... or backgroundColor: ... } }
 */
export const getColorValue = (value?: string, type: 'text' | 'bg' | 'border' = 'text'): { className?: string; style?: React.CSSProperties } => {
    if (!value) return {};

    if (isCustomColor(value)) {
        let cssProperty: keyof React.CSSProperties;

        switch (type) {
            case 'text': {
                cssProperty = 'color';
                break;
            }
            case 'bg': {
                cssProperty = 'backgroundColor';
                break;
            }
            default: {
                cssProperty = 'borderColor';
            }
        }

        return { style: { [cssProperty]: value } };
    }

    // Tailwind or CSS class
    return { className: value };
};
