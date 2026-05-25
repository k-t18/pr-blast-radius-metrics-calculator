import { CustomDropdown } from '../../../../components/common/Dropdown';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import type { DurationDropdownProperties } from '../../../../interfaces/blanketSponsorship/blanketSponsorship.types';
import { usePeriodOptions } from '../../../../hooks/blanketSponsorship/useBlanketOrders';

export function DurationDropdown({ label, value, onChange }: DurationDropdownProperties) {
    const { options: MONTH_OPTIONS, isLoading } = usePeriodOptions();
    const selectedOption = MONTH_OPTIONS.find(option => String(option.value) === value);

    return (
        <>
            <HeaderTitle text={label} size="sm" weight="medium" disabled={false} className="leading-[22px]" />
            <div className="mt-3">
                <CustomDropdown
                    value={selectedOption?.value as any}
                    options={MONTH_OPTIONS}
                    width="173px"
                    onChange={value => {
                        onChange(value as any);
                    }}
                    placeholder="Number of months"
                    dropDownClass="blanket-dropdown w-full text-xs font-normal leading-5"
                    disabled={isLoading}
                />
            </div>
        </>
    );
}
