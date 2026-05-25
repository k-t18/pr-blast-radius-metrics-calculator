import { CurrencyAmount } from '../../../../components/common/CurrencyAmount';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import { Money } from '../../../../components/icons';

interface TotalOrderAmountProperties {
    amount: string | number;
}

function TotalOrderAmount({ amount }: TotalOrderAmountProperties) {
    return (
        <div className="w-96 flex items-center gap-2 border border-gray-600 px-2 py-1 text-sm font-medium text-primary-text bg-white shadow-sm leading-[22px]">
            {/* <PiMoneyBold className="text-xl" /> */}
            <Money size={20} />
            <span>Total Order Amount:</span>
            <span className="font-semibold">
                <CurrencySymbol /> <CurrencyAmount value={Number(amount)} />
            </span>
        </div>
    );
}

export default TotalOrderAmount;
