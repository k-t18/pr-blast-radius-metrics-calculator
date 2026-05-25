# Color Token Usage Examples

## 🎨 Tailwind CSS Classes

### Backgrounds

```tsx
// Brand colors
<div className="bg-brand-500 hover:bg-brand-600">
<div className="bg-brand-50">  // Light background

// Semantic colors
<div className="bg-success-500">  // Success state
<div className="bg-warning-500">  // Warning state
<div className="bg-danger-500">   // Error state
<div className="bg-information-500">  // Info state

// Neutral colors
<div className="bg-gray-100">  // Light gray background
<div className="bg-warm-200">  // Warm white background
```

### Text Colors

```tsx
<h1 className="text-brand-900">Primary Heading</h1>
<p className="text-gray-700">Body text</p>
<span className="text-danger-600">Error message</span>
<a className="text-information-500 hover:text-information-700">Link</a>
```

### Borders

```tsx
<div className="border-2 border-brand-500">
<div className="border-t border-gray-300">
<input className="border border-gray-600 focus:border-brand-500" />
```

## 📦 TypeScript/JavaScript

### Import Options

```tsx
// Import everything
import { Colors, SemanticColors } from '@/styles/tokens';

// Or import from specific file
import { Colors, SemanticColors } from '@/styles/tokens/colors';
```

### Using Color Constants

```tsx
import { Colors, SemanticColors } from '@/styles/tokens';

// In component styles
const buttonStyle = {
    backgroundColor: Colors.brand[500],
    color: '#ffffff',
    borderColor: Colors.brand[600],
};

// Using semantic colors
const alertStyles = {
    success: {
        backgroundColor: Colors.success[50],
        borderColor: SemanticColors.success,
        color: Colors.success[900],
    },
    danger: {
        backgroundColor: Colors.danger[50],
        borderColor: SemanticColors.danger,
        color: Colors.danger[900],
    },
};

// Dynamic color selection
function getStatusColor(status: 'success' | 'warning' | 'danger') {
    const colorMap = {
        success: Colors.success[500],
        warning: Colors.warning[500],
        danger: Colors.danger[500],
    };
    return colorMap[status];
}
```

### Component Example

```tsx
import { Colors } from '@/styles/tokens';

interface BadgeProps {
    variant: 'success' | 'warning' | 'danger' | 'info';
    children: React.ReactNode;
}

export function Badge({ variant, children }: BadgeProps) {
    const colorMap = {
        success: Colors.success,
        warning: Colors.warning,
        danger: Colors.danger,
        info: Colors.information,
    };

    const colors = colorMap[variant];

    return (
        <span
            style={{
                backgroundColor: colors[50],
                color: colors[900],
                border: `1px solid ${colors[500]}`,
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                fontWeight: 500,
            }}
        >
            {children}
        </span>
    );
}
```

## 🎯 CSS Files

### Using CSS Variables

```css
/* Component styles */
.my-button {
    background-color: var(--color-brand-500);
    color: #ffffff;
    border: 2px solid var(--color-brand-600);
    transition: all 0.2s;
}

.my-button:hover {
    background-color: var(--color-brand-600);
}

.my-button:disabled {
    background-color: var(--color-gray-400);
    border-color: var(--color-gray-500);
    color: var(--color-gray-700);
}

/* Alert variants */
.alert-success {
    background-color: var(--color-success-50);
    border-left: 4px solid var(--color-success-500);
    color: var(--color-success-900);
}

.alert-warning {
    background-color: var(--color-warning-50);
    border-left: 4px solid var(--color-warning-500);
    color: var(--color-warning-900);
}

.alert-danger {
    background-color: var(--color-danger-50);
    border-left: 4px solid var(--color-danger-500);
    color: var(--color-danger-900);
}
```

## 🔧 Advanced Patterns

### Creating Theme Variants

```tsx
import { Colors } from '@/styles/tokens';

export const themes = {
    light: {
        background: '#ffffff',
        text: '#000000',
        primary: Colors.brand[500],
        secondary: Colors.gray[600],
    },
    dark: {
        background: Colors.gray[900],
        text: '#ffffff',
        primary: Colors.brand[400],
        secondary: Colors.gray[400],
    },
};
```

### Dynamic Color Utilities

```tsx
import { Colors, type ColorPalette, type ColorScale } from '@/styles/tokens';

/**
 * Get a color from any palette
 */
export function getColor(palette: ColorPalette, scale: ColorScale = 500) {
    return Colors[palette][scale];
}

/**
 * Get lighter/darker shade of a color
 */
export function getLighterShade(palette: ColorPalette, currentScale: ColorScale) {
    const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const currentIndex = scales.indexOf(currentScale);
    const lighterScale = scales[Math.max(0, currentIndex - 1)] as ColorScale;
    return Colors[palette][lighterScale];
}

/**
 * Get color with opacity
 */
export function getColorWithOpacity(hex: string, opacity: number) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Usage
const lightBrand = getLighterShade('brand', 500); // Returns brand-400
const transparentBrand = getColorWithOpacity(Colors.brand[500], 0.5);
```

### Status Color Helper

```tsx
import { Colors, SemanticColors } from '@/styles/tokens';

export type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export function getStatusColors(status: Status) {
    const colorMap = {
        success: {
            bg: Colors.success[50],
            border: Colors.success[500],
            text: Colors.success[900],
            icon: SemanticColors.success,
        },
        warning: {
            bg: Colors.warning[50],
            border: Colors.warning[500],
            text: Colors.warning[900],
            icon: SemanticColors.warning,
        },
        danger: {
            bg: Colors.danger[50],
            border: Colors.danger[500],
            text: Colors.danger[900],
            icon: SemanticColors.danger,
        },
        info: {
            bg: Colors.information[50],
            border: Colors.information[500],
            text: Colors.information[900],
            icon: SemanticColors.info,
        },
        neutral: {
            bg: Colors.gray[100],
            border: Colors.gray[400],
            text: Colors.gray[900],
            icon: Colors.gray[600],
        },
    };

    return colorMap[status];
}

// Usage in component
function Alert({ status, message }: { status: Status; message: string }) {
    const colors = getStatusColors(status);

    return (
        <div
            style={{
                backgroundColor: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                color: colors.text,
                padding: '1rem',
            }}
        >
            {message}
        </div>
    );
}
```

## 📚 Best Practices

### ✅ DO

```tsx
// Use color tokens
<div className="bg-brand-500 text-white">

// Use semantic colors for clarity
const dangerColor = SemanticColors.danger;

// Use consistent scale across similar elements
<div className="border-gray-300 bg-gray-50 text-gray-900">
```

### ❌ DON'T

```tsx
// Don't use hardcoded hex values
<div style={{ backgroundColor: '#6a0dad' }}>

// Don't mix scales inconsistently
<div className="border-gray-900 bg-gray-50">  // Contrast issue

// Don't use random colors outside the system
const customPurple = '#8b5cf6';  // Use Colors.brand instead
```

## 🎨 Color Combinations

### Recommended Pairings

```tsx
// Primary brand combinations
<div className="bg-brand-500 text-white">  // High contrast
<div className="bg-brand-50 text-brand-900">  // Subtle

// Success combinations
<div className="bg-success-500 text-white">  // Success button
<div className="bg-success-50 border-success-500 text-success-900">  // Success alert

// Text on backgrounds
<div className="bg-white text-gray-900">  // Primary text
<div className="bg-gray-50 text-gray-700">  // Secondary text
<div className="bg-brand-500 text-white">  // Text on brand
```
