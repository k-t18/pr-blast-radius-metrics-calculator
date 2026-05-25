import { DeviceMobileCamera as DeviceMobileCameraIcon } from '@phosphor-icons/react';

/**
 * Mobile device with camera icon wrapper.
 */
function DeviceMobileCamera({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
    return <DeviceMobileCameraIcon size={size} color={color} />;
}

export default DeviceMobileCamera;
