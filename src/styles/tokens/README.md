# Color Token System

This directory contains the centralized color system from the Figma design. All colors are organized into semantic palettes with consistent naming.

## 📦 Available Palettes

### Brand Colors (Purple)

Primary brand identity color

- `brand-50` through `brand-900`
- Primary: `brand-500` (#6a0dad)

### Accent Colors

- **Sunshine** (`sunshine-*`): Bright yellow accent
- **Coral** (`coral-*`): Warm red accent
- **Teal** (`teal-*`): Cool blue-green accent

### Semantic Colors

- **Success** (`success-*`): Green for positive actions
- **Warning** (`warning-*`): Orange for caution
- **Danger** (`danger-*`): Red for errors/destructive actions
- **Information** (`information-*`): Blue for informational states

### Neutral Colors

- **Gray** (`gray-*`): Neutral grays for text, borders
- **Warm** (`warm-*`): Warm white backgrounds
- **Text** (`text-*`): Dedicated text colors (charcoal, white, black)
- **Other** (`other-*`): Pink/Magenta for additional UI needs

## 🎨 Usage

### In Tailwind CSS (Recommended)

```tsx
// Background colors
<div className="bg-brand-500 hover:bg-brand-600">

// Text colors
<p className="text-text-black">Primary text</p>
<p className="text-text-charcoal">Secondary text</p>
<p className="text-gray-900">Gray text</p>

// Border colors
<div className="border-2 border-success-500">
```

### In TypeScript/JavaScript

```tsx
import { Colors, SemanticColors } from '@/styles/tokens/colors';

// Using color constants
const buttonStyle = {
    backgroundColor: Colors.brand[500],
    color: Colors.text.white,
};

// Using semantic aliases
const alertStyle = {
    backgroundColor: SemanticColors.danger,
    color: SemanticColors.textPrimary,
};

// Text colors
const textStyle = {
    primary: Colors.text.black,
    secondary: Colors.text.charcoal,
    inverse: Colors.text.white,
};
```

### In CSS files

```css
.my-component {
    background-color: var(--color-brand-500);
    border-color: var(--color-gray-600);
}

.my-button:hover {
    background-color: var(--color-brand-600);
}
```

## 🎯 Color Scale

All palettes follow a consistent 50-900 scale:

- **50-200**: Very light shades (backgrounds, hover states)
- **300-400**: Light shades (disabled states, subtle elements)
- **500**: Base color (primary use case)
- **600-700**: Dark shades (hover states, pressed states)
- **800-900**: Very dark shades (text on light backgrounds)

## 🔄 Semantic Aliases

Use semantic color names for better code readability:

```tsx
import { SemanticColors } from '@/styles/tokens/colors';

// ✅ Good - intention is clear
<button style={{ backgroundColor: SemanticColors.danger }}>

// ❌ Avoid - unclear intention
<button style={{ backgroundColor: '#e53935' }}>
```

## 📝 Naming Convention

- **Tailwind**: `bg-{palette}-{scale}` (e.g., `bg-brand-500`)
- **CSS Vars**: `--color-{palette}-{scale}` (e.g., `var(--color-brand-500)`)
- **TypeScript**: `Colors.{palette}[{scale}]` (e.g., `Colors.brand[500]`)

## 🚀 Best Practices

1. **Always use tokens** instead of hardcoded hex values
2. **Use semantic aliases** when the intention is clear (success, danger, etc.)
3. **Prefer Tailwind classes** in JSX for better performance
4. **Use CSS variables** for dynamic theming
5. **Use TypeScript constants** for computed styles or JavaScript logic

## 🔧 Updating Colors

To update colors:

1. Update `src/styles/index.css` (@theme section)
2. Update `src/styles/tokens/colors.ts`
3. Ensure consistency between both files

## 📚 Resources

- [Figma Design System](https://www.figma.com/design/oNHFGJuStD25OOLCZxCdfW/CHANCES-Sponsor-Portal?node-id=1143-9514&p=f&t=ggXQUgBTQTPuwdG4-0)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Color Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
