import { CaretUpIcon } from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

/**
 * @param size - Controls the icon's dimensions (width & height in pixels). Default is set to 20.
 * @param color - Sets the icon color. By default, it uses `"currentColor"`,
 *                which makes the icon inherit the text color (`color` CSS property)
 *                of its parent element — allowing it to automatically match text or theme color.
 */

export default function CaretUp({ size = 20, color = 'currentColor', weight = 'regular' }: { size?: number; color?: string; weight?: IconWeight }) {
    return <CaretUpIcon size={size} color={color} weight={weight} />;
}
