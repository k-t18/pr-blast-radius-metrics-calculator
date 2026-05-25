import { EyeSlashIcon } from '@phosphor-icons/react';

/**
 * Password-hidden state icon wrapper.
 *
 * @param size - Controls the icon dimensions (px). Defaults to 20.
 * @param color - Icon color; defaults to `currentColor` so it inherits parent text color.
 */
export default function EyeOff({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
    return <EyeSlashIcon size={size} color={color} />;
}
