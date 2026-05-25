import HeaderTitle from '../../../../components/common/HeaderTitle';
import { InputField } from '../../../../components/form-fields/inputField';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import type { BudgetInputProperties } from '../../../../interfaces/blanketSponsorship/blanketSponsorship.types';

export function BudgetInput({ id, label, value, onChange }: BudgetInputProperties) {
    return (
        <div>
            <HeaderTitle text={label} size="sm" weight="medium" disabled={false} className="leading-[22px]" />
            <div className="w-[173px]">
                <InputField
                    id={id}
                    name={id}
                    type="text"
                    value={value}
                    onChange={(newValue: string) => onChange(newValue)}
                    placeholder="Amount"
                    className="mt-2"
                    inputClassName="w-full custom-budget-input rounded-md border h-[36px]  pr-3 py-2 font-normal"
                    prefixIcon={<CurrencySymbol className={`text-xs font-normal leading-5 ${value ? 'text-primary-text' : ''}`} />}
                    min="0"
                />
            </div>
        </div>
    );
}
