/**
 * LegendItem Component
 * ----------------------
 * A reusable, dynamic legend indicator used for showing statuses
 * like "Available", "Unavailable", or "Your Selection".
 *
 * Props:
 * - boxClass:     Tailwind classes applied to the small square box.
 * - textClass:    Tailwind classes applied to the label text.
 * - label:        Text to display next to the box.
 *
 */

interface LegendItemProperties {
    boxClass?: string;
    textClass?: string;
    label: string;
}

function LegendItem({ boxClass = '', textClass = '', label }: LegendItemProperties) {
    return (
        <div className="flex items-center gap-2">
            {/* Status color box */}
            <div className={`w-5 h-5 rounded-xs ${boxClass}`} />

            {/* Label text */}
            <span className={`${textClass}`}>{label}</span>
        </div>
    );
}

export default LegendItem;
