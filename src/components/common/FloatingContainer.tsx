import type { ReactNode, CSSProperties } from 'react';

interface FloatingContainerProperties {
    children: ReactNode;
    position?: 'sticky' | 'fixed' | 'absolute';
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
    height?: string;
    bgColor?: string;
    borderColor?: string;
    borderRadius?: string;
    padding?: string;
    shadow?: string;
    zIndex?: number;
    className?: string;
}

function FloatingContainer({
    children,
    position = 'sticky',
    top,
    bottom = '1rem',
    left = '0',
    right = '0',
    width = '100%',
    height,
    bgColor = 'white',
    borderColor = '#e5e7eb',
    borderRadius = '12px',
    padding = '1rem',
    shadow = '2px 4px 6px 0px #CDCDCD40, 0px -2px 6px 0px #B1B1B140',

    zIndex = 50,
    className,
}: FloatingContainerProperties) {
    const style: CSSProperties = {
        position,
        top,
        bottom,
        left,
        right,
        width,
        height,
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius,
        padding,
        boxShadow: shadow,
        zIndex,
    };

    return (
        <div style={style} className={className}>
            {children}
        </div>
    );
}

export default FloatingContainer;
