// eslint-disable-next-line import/no-extraneous-dependencies
import { Pie, PieChart, Sector, Cell } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';
import type { PieLabelRenderProps } from 'recharts';
import type { TooltipIndex } from 'recharts/types/state/tooltipSlice';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface CirclePieChartDataPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface CirclePieChartProperties {
    data: CirclePieChartDataPoint[];
    title: string;
    colors?: string[];
    isAnimationActive?: boolean;
    defaultIndex?: TooltipIndex;
    innerRadius?: string | number;
    outerRadius?: string | number;
    height?: number;
}

const RADIAN = Math.PI / 180;

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    if (cx === undefined || cy === undefined || innerRadius === undefined || outerRadius === undefined) {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
    }
    const ncx = Number(cx);
    const ncy = Number(cy);
    const radius = Number(outerRadius);
    const midAngleRad = (midAngle ?? 0) * RADIAN;

    // Calculate position with 22px padding from the outer edge of the donut
    const padding = 22;
    const x = ncx + (radius + padding) * Math.cos(-midAngleRad);
    const y = ncy + (radius + padding) * Math.sin(-midAngleRad);

    // Determine text anchor based on position
    const textAnchor = x > ncx ? 'start' : 'end';

    return (
        <text
            x={x}
            y={y}
            fill={Colors.text.black}
            textAnchor={textAnchor}
            dominantBaseline="central"
            fontSize={14}
            fontWeight={600}
            style={{ pointerEvents: 'none' }}
        >
            {`${((percent ?? 0) * 100).toFixed(0)}%`}
        </text>
    );
};

const renderActiveShape = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
}: PieSectorDataItem) => {
    const sin = Math.sin(-RADIAN * (midAngle ?? 1));
    const cos = Math.cos(-RADIAN * (midAngle ?? 1));
    const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
    const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
    const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
    const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} fontSize={14} fontWeight={600}>
                {payload.name}
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={(outerRadius ?? 0) + 6}
                outerRadius={(outerRadius ?? 0) + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={Colors.text.charcoal} fontSize={12} fontWeight={600}>
                {`${value.toLocaleString()}`}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={Colors.gray.medium} fontSize={11}>
                {`(${((percent ?? 1) * 100).toFixed(1)}%)`}
            </text>
        </g>
    );
};

export default function CirclePieChart({
    data,
    title,
    colors = [Colors.brand[500], Colors.sunshine[500], Colors.teal.lightSeaGreen, Colors.coral[500]],
    isAnimationActive = true,
    defaultIndex: _defaultIndex,
    innerRadius = '60%',
    outerRadius = '80%',
    height: _height = 500,
}: CirclePieChartProperties) {
    // Fixed circle size: 300px diameter = 150px radius
    const CIRCLE_SIZE = 300;
    const CIRCLE_RADIUS = CIRCLE_SIZE / 2; // 150px

    // Convert percentage to pixel values if needed
    const getInnerRadius = () => {
        if (typeof innerRadius === 'number') return innerRadius;
        if (typeof innerRadius === 'string' && innerRadius.endsWith('%')) {
            const percent = Number.parseFloat(innerRadius) / 100;
            return CIRCLE_RADIUS * percent; // 60% of 150px = 90px
        }
        return CIRCLE_RADIUS * 0.6; // Default 60%
    };

    const getOuterRadius = () => {
        if (typeof outerRadius === 'number') return outerRadius;
        if (typeof outerRadius === 'string' && outerRadius.endsWith('%')) {
            const percent = Number.parseFloat(outerRadius) / 100;
            return CIRCLE_RADIUS * percent; // 80% of 150px = 120px, but we want 150px for 300px circle
        }
        return CIRCLE_RADIUS; // Default to full 150px for 300px circle
    };

    return (
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm h-full flex flex-col rounded-lg">
            <style>
                {`
                    .chart-container,
                    .chart-container:focus,
                    .chart-container:focus-visible,
                    .chart-container:active,
                    .chart-container *:focus,
                    .chart-container *:focus-visible,
                    .chart-container *:active {
                        outline: none !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                `}
            </style>
            <HeaderTitle text={title} size="xl" weight="medium" disabled={false} className="mb-6 font-ubuntu" />
            <div className="chart-container flex-1 flex items-center justify-center relative">
                <div style={{ width: '400px', height: '400px' }}>
                    <PieChart width={425} height={425}>
                        <Pie
                            activeShape={renderActiveShape}
                            data={data}
                            cx={200}
                            cy={200}
                            innerRadius={getInnerRadius()}
                            outerRadius={getOuterRadius()}
                            fill={Colors.brand.lavender}
                            dataKey="value"
                            isAnimationActive={isAnimationActive}
                            label={renderLabel}
                            labelLine={false}
                        >
                            {data.length > 0 && data.map((entry, index) => <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />)}
                        </Pie>
                    </PieChart>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-start gap-4 pb-2">
                    {data.length > 0 &&
                        data.map((entry, index) => (
                            <div key={`legend-${entry.name}`} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                                <span className="text-[12px] text-black">{entry.name}</span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
