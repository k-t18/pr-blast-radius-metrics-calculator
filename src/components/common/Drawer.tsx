import type { ReactNode, CSSProperties } from 'react';
import { Sidebar } from 'primereact/sidebar';

interface DrawerProperties {
    visible: boolean;
    onHide: () => void;
    children: ReactNode;
    position?: 'left' | 'right' | 'top' | 'bottom';
    className?: string;
    blockScroll?: boolean;
    style?: CSSProperties;
    width?: string;
}

/**
 * Reusable Drawer component that wraps PrimeReact's Sidebar.
 * Can be used for quotes, orders, and other table detail views.
 *
 * @param visible - Controls whether the drawer is visible
 * @param onHide - Callback function when drawer is closed
 * @param children - Content to display inside the drawer
 * @param position - Position of the drawer (default: 'right')
 * @param className - Additional CSS classes
 * @param blockScroll - Whether to block page scrolling when drawer is open (default: true)
 * @param style - Inline styles for the drawer
 * @param width - Width of the drawer (default: '700px')
 */
export function Drawer({ visible, onHide, children, position = 'right', className, blockScroll = true, style, width = '700px' }: DrawerProperties) {
    return (
        <Sidebar visible={visible} position={position} onHide={onHide} className={className} blockScroll={blockScroll} style={{ width, ...style }}>
            {children}
        </Sidebar>
    );
}
