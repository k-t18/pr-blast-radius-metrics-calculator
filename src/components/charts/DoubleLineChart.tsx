// eslint-disable-next-line import/no-extraneous-dependencies
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import HeaderTitle from '../common/HeaderTitle';
import { Colors } from '../../styles/tokens/colors';

export interface ChartDataPoint {
    date: string;
    [key: string]: string | number;
}

export interface DoubleLineChartProperties {
    data: ChartDataPoint[];
    title: string;
    firstLineKey: string;
    secondLineKey: string;
    firstLineName: string;
    secondLineName: string;
    firstLineColor?: string;
    secondLineColor?: string;
    yAxisDomain?: [number, number];
    height?: number;
}

const formatLegendText = (value: string) => value;

export default function DoubleLineChart({
    data,
    title,
    firstLineKey,
    secondLineKey,
    firstLineName,
    secondLineName,
    firstLineColor = Colors.brand[500],
    secondLineColor = Colors.coral[500],
    yAxisDomain = [0, 100_000],
    height = 500,
}: DoubleLineChartProperties) {
    return (
        <div className="rounded border border-gray-200 bg-white p-8 shadow-sm rounded-lg">
            <style>
                {`
                    .recharts-legend-wrapper .recharts-legend-item-text {
                        color: ${Colors.gray.slate} !important;
                    }
                    .recharts-legend-wrapper {
                        padding-left: 0 !important;
                    }
                    .recharts-default-legend {
                        text-align: left !important;
                        padding-top: 30px !important;
                    }
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
                    .recharts-cartesian-axis-line {
                        stroke: ${Colors.text.black} !important;
                        stroke-width: 1.71px !important;
                    }
                `}
            </style>
            <HeaderTitle text={title} size="xl" weight="medium" disabled={false} className="mb-6 font-ubuntu" />
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" stroke={Colors.gray[900]} strokeWidth={1.5} tickMargin={10} />
                        <YAxis domain={yAxisDomain} stroke={Colors.gray[900]} strokeWidth={1.5} tickMargin={10} />
                        <Tooltip />
                        <Legend iconType="circle" wrapperStyle={{ paddingLeft: 0, textAlign: 'left' }} formatter={formatLegendText} />
                        <Line
                            dataKey={firstLineKey}
                            stroke={firstLineColor}
                            strokeWidth={4}
                            dot={{ fill: firstLineColor, r: 5 }}
                            name={firstLineName}
                            isAnimationActive={false}
                        />
                        <Line
                            dataKey={secondLineKey}
                            stroke={secondLineColor}
                            strokeWidth={4}
                            dot={{ fill: secondLineColor, r: 5 }}
                            // dot={{ fill: 'none', stroke: '#FF6F61', strokeWidth: 2, r: 5 }}
                            name={secondLineName}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
