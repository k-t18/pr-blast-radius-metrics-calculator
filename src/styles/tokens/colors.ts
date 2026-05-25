/**
 * Color Tokens
 *
 * Centralized color system from Figma design.
 * All colors are accessible via Tailwind CSS classes or as TypeScript constants.
 *
 * Usage in JSX/TSX:
 * - Tailwind: className="bg-brand-500 text-white"
 * - Inline styles: style={{ backgroundColor: Colors.brand[500] }}
 * - CSS variables: style={{ backgroundColor: 'var(--color-brand-500)' }}
 */

export const Colors = {
    /** Brand Colors (Purple) - Primary brand identity */
    brand: {
        50: '#f0e7f7',
        100: '#d1b4e6',
        200: '#ba90d9',
        300: '#9b5dc8',
        400: '#883dbd',
        500: '#6a0dad', // Primary brand color
        600: '#600c9d',
        700: '#4b097b',
        800: '#3a075f',
        900: '#2d0549',
        /** Lavender variant */
        lavender: '#8884d8',
    },

    /** Sunshine Yellow - Bright, energetic accent color */
    sunshine: {
        50: '#fffbe6',
        100: '#fff3b0',
        200: '#ffed8a',
        300: '#ffe454',
        400: '#ffdf33',
        500: '#ffd700',
        600: '#e8c400',
        700: '#b59900',
        800: '#8c7600',
        900: '#6b5a00',
    },

    /** Coral Red - Warm, friendly accent color */
    coral: {
        50: '#fff1ef',
        100: '#ffd2ce',
        200: '#ffbdb6',
        300: '#ff9f95',
        400: '#ff8c81',
        500: '#ff6f61',
        600: '#e86558',
        700: '#b54f45',
        800: '#8c3d35',
        900: '#6b2f29',
    },

    /** Teal Blue - Cool, calming accent color */
    teal: {
        50: '#e6f2f2',
        100: '#b0d8d8',
        200: '#8ac5c5',
        300: '#54aaaa',
        400: '#339999',
        500: '#008080',
        600: '#007474',
        700: '#005b5b',
        800: '#004646',
        900: '#003636',
        /** Light Sea Green variant */
        lightSeaGreen: '#20b2aa',
    },

    /** Success - Positive actions and states */
    success: {
        50: '#edf7ee',
        100: '#c8e6c9',
        200: '#addaaf',
        300: '#87c98a',
        400: '#70bf73',
        500: '#4caf50',
        600: '#459f49',
        700: '#367c39',
        800: '#2a602c',
        900: '#204a22',
    },

    /** Warning - Caution and advisory states */
    warning: {
        50: '#fff7e6',
        100: '#ffe5b0',
        200: '#ffd88a',
        300: '#ffc754',
        400: '#ffbc33',
        500: '#ffab00',
        600: '#e89c00',
        700: '#b57900',
        800: '#8c5e00',
        900: '#6b4800',
        /** Orange variant */
        orange: '#ffa500',
    },

    /** Danger - Error and destructive actions */
    danger: {
        50: '#fcebeb',
        100: '#f7c2c0',
        200: '#f3a4a2',
        300: '#ee7a78',
        400: '#ea615d',
        500: '#e53935',
        600: '#d03430',
        700: '#a32826',
        800: '#7e1f1d',
        900: '#601816',
    },

    /** Information - Informational and neutral states */
    information: {
        50: '#e9f2ff',
        100: '#bbd6ff',
        200: '#9ac2ff',
        300: '#6ca7ff',
        400: '#5095ff',
        500: '#247bff',
        600: '#2170e8',
        700: '#1a57b5',
        800: '#14448c',
        900: '#0f346b',
    },

    /** Other - Additional UI color (Pink/Magenta) */
    other: {
        50: '#fff2ff',
        100: '#ffd6fe',
        200: '#ffc2fd',
        300: '#ffa6fc',
        400: '#ff95fc',
        500: '#ff7afb',
        600: '#e86fe4',
        700: '#b557b2',
        800: '#8c438a',
        900: '#6b3369',
    },

    /** Grays - Neutral colors for text, borders, and backgrounds */
    gray: {
        50: '#fdfdfd',
        100: '#f9f9f9',
        200: '#f6f6f6',
        300: '#f2f2f2',
        400: '#efefef',
        500: '#ebebeb',
        600: '#d6d6d6',
        700: '#a7a7a7',
        800: '#818181',
        900: '#636363',
        /** Medium gray */
        medium: '#999999',
        /** Slate gray */
        slate: '#6b7280',
    },

    /** Warm White - Subtle warm neutral backgrounds */
    warm: {
        50: '#fffefe',
        100: '#fffdfa',
        200: '#fffcf8',
        300: '#fffbf5',
        400: '#fffaf3',
        500: '#fff9f0',
        600: '#e8e3da',
        700: '#b5b1aa',
        800: '#8c8984',
        900: '#6b6965',
    },

    /** Text Colors - Primary text colors for typography */
    text: {
        charcoal: '#333333',
        white: '#ffffff',
        black: '#000000',
    },
} as const;

/** Semantic color aliases for common use cases */
export const SemanticColors = {
    /** Primary brand color */
    primary: Colors.brand[500],
    /** Primary brand dark variant */
    primaryDark: Colors.brand[800],
    /** Primary brand light variant */
    primaryLight: Colors.brand[200],

    /** Success color */
    success: Colors.success[500],
    /** Warning color */
    warning: Colors.warning[500],
    /** Danger/Error color */
    danger: Colors.danger[500],
    /** Information color */
    info: Colors.information[500],

    /** Primary text color (black) */
    textPrimary: Colors.text.black,
    /** Secondary text color (charcoal gray) */
    textSecondary: Colors.text.charcoal,
    /** Text on dark backgrounds (white) */
    textInverse: Colors.text.white,

    /** Border color */
    border: '#c7c7c7',
    /** Input border */
    borderInput: Colors.gray[600],
    /** Divider */
    divider: Colors.gray[400],

    /** Background colors */
    backgroundPrimary: Colors.text.white,
    backgroundSecondary: Colors.warm[100],
    backgroundTertiary: Colors.gray[100],
} as const;

/** Type for color scale values (50-900) */
export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/** Type for all color palette names */
export type ColorPalette =
    | 'brand'
    | 'sunshine'
    | 'coral'
    | 'teal'
    | 'success'
    | 'warning'
    | 'danger'
    | 'information'
    | 'other'
    | 'gray'
    | 'warm'
    | 'text';

export default Colors;
