import type { SummaryCardProperties } from '../../interfaces/adsCampaign/adsCampaign.types';
import HeaderTitle from '../common/HeaderTitle';
import { CaretUp, CaretDown } from '../icons';

const formatPercentage = (percentageValue: number | undefined): string => {
    if (typeof percentageValue !== 'number') return String(percentageValue || '');
    return percentageValue % 1 === 0 ? percentageValue.toString() : percentageValue.toFixed(2);
};

function PerformanceMetricsCard({ icon, value, label, changePercentage, changeType }: SummaryCardProperties) {
    let colorClass = '';
    if (changeType === 'increase') {
        colorClass = 'text-green-600';
    } else if (changeType === 'decrease') {
        colorClass = 'text-red-600';
    }

    return (
        <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-4">{icon}</div>
            <div className="mb-2 flex items-baseline gap-4 text-[32px] leading-10 font-medium font-ubuntu">{value}</div>
            <div className="mb-2 flex flex-col">
                <HeaderTitle text={label} size="md" weight="normal" color="text-gray-850" disabled={false} className="leading-6 mb-2 font-ubuntu" />
                {changePercentage !== undefined && changeType && (
                    <div className={`flex items-center gap-1 ${colorClass}`}>
                        {changeType === 'increase' && <CaretUp size={24} weight="fill" />}
                        {changeType === 'decrease' && <CaretDown size={24} weight="fill" />}
                        <span className="text-xl font-regular font-ubuntu">{formatPercentage(changePercentage)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PerformanceMetricsCard;
