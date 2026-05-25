import { ProgressSpinner } from 'primereact/progressspinner';

interface CircularLoaderProperties {
    label?: string;
    className?: string;
    size?: number;
}

/**
 * Small circular loader built on top of PrimeReact's ProgressSpinner.
 * Useful for inline async states such as drawers or cards.
 */
export function CircularLoader({ label = 'Loading…', className, size = 40 }: CircularLoaderProperties) {
    return (
        <div className={`flex flex-col items-center justify-center p-6 text-sm text-primary-text ${className ?? ''}`}>
            <ProgressSpinner strokeWidth="4" style={{ width: `${size}px`, height: `${size}px` }} className="circular-loader-brand" />
            {label ? <span className="mt-2">{label}</span> : undefined}
        </div>
    );
}

export default CircularLoader;
