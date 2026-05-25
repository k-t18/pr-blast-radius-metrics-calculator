import { GearIcon, PlayCircleIcon } from '@phosphor-icons/react';

/**
 * Composite icon showing a gear with a play button overlay
 * @param size - Controls the icon's dimensions (width & height in pixels). Default is set to 20.
 * @param color - Sets the icon color. By default, it uses `"currentColor"`,
 *                which makes the icon inherit the text color (`color` CSS property)
 *                of its parent element — allowing it to automatically match text or theme color.
 */

export default function GearPlay({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
    const playSize = Math.round(size * 0.6);
    return (
        <div className="relative inline-block" style={{ width: size, height: size }}>
            <GearIcon size={size} color={color} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <PlayCircleIcon size={playSize} color={color} />
            </div>
        </div>
    );
}
