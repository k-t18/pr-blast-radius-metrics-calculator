// eslint-disable-next-line import/no-extraneous-dependencies
import { Cell, Pie, PieChart as RechartsPieChart, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface PieChartDataPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface PieChartProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    title: string;
    colors?: string[];
    isAnimationActive?: boolean;
    height?: number;
    legendPosition?: 'bottom-left' | 'top-right';
}

const renderLabel = ({ percent }: PieLabelRenderProps) => {
    if (percent === undefined) return null;
    return `${(percent * 100).toFixed(0)}%`;
};

export default function PieChart({
    data,
    title,
    colors = [
        Colors.brand[500],
        Colors.coral[500],
        Colors.teal.lightSeaGreen,
        Colors.sunshine[500],
        Colors.warning.orange,
        Colors.teal.lightSeaGreen,
        Colors.text.black,
    ],
    isAnimationActive = true,
    height: _height = 300,
    legendPosition = 'bottom-left',
}: PieChartProperties) {
    const isTopRight = legendPosition === 'top-right';

    // Calculate total for percentage calculations
    const total =
        data && Array.isArray(data) && data.length > 0 ? data.reduce((sum: number, entry: { value: number }) => sum + (entry.value || 0), 0) : 0;

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
            <div className={`chart-container flex flex-col flex-1 justify-center relative ${isTopRight ? 'items-start' : 'items-center'}`}>
                {isTopRight && (
                    <div className="absolute top-0 right-0 flex flex-col items-start gap-2 z-10">
                        {data.length > 0 &&
                            data.map((entry: { name: string; value: number }, index: number) => (
                                <div key={`legend-${entry.name}`} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
                                    <span className="text-[12px] text-black whitespace-nowrap">{entry.name}</span>
                                </div>
                            ))}
                    </div>
                )}
                <div style={{ width: '415px', height: '380px' }}>
                    <RechartsPieChart width={415} height={380}>
                        <Pie
                            dataKey="value"
                            data={data as unknown as PieChartDataPoint[]}
                            fill={Colors.brand.lavender}
                            label={renderLabel}
                            isAnimationActive={isAnimationActive}
                        >
                            {data.length > 0 &&
                                data.map((entry: { name: string; value: number }, index: number) => (
                                    <Cell key={`cell-${entry.name}`} fill={colors[index % colors.length]} />
                                ))}
                        </Pie>
                        <Tooltip
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            formatter={(value: any, name: any) => {
                                if (typeof value === 'number' && total > 0) {
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return [`${value} (${percentage}%)`, name];
                                }
                                return [value, name];
                            }}
                        />
                    </RechartsPieChart>
                </div>
                {!isTopRight && (
                    <div className="mt-4 flex flex-wrap justify-start gap-4 w-full">
                        {data.length > 0 &&
                            data.map((entry: { name: string; value: number }, index: number) => (
                                <div key={`legend-${entry.name}`} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                                    <span className="text-[12px] text-black">{entry.name}</span>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
