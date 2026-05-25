import { useMemo } from 'react';
import { RadioButtonGroup } from '../../../../../components/common/RadioButton';
import { REWARD_TYPE_OPTIONS } from '../../../config/constants';

interface RewardTypeSelectorProperties {
    value: string;
    onChange: (value: string) => void;
    sponsorshipType?: string;
}

function RewardTypeSelector({ value, onChange, sponsorshipType }: RewardTypeSelectorProperties) {
    const filteredOptions = useMemo(() => {
        if (sponsorshipType === 'Studio Show') {
            return REWARD_TYPE_OPTIONS.filter(option => option.value !== 'voucher-coupon');
        }
        return REWARD_TYPE_OPTIONS;
    }, [sponsorshipType]);

    return (
        <fieldset className="flex flex-col gap-2 border-0 p-0">
            <legend className="text-base font-medium text-black mb-[9px]">
                Select Reward type<span className="text-red-600">*</span>
            </legend>
            <RadioButtonGroup
                name="rewardType"
                value={value}
                className="text-base"
                onChange={v => onChange(String(v))}
                options={filteredOptions}
                layout="horizontal"
            />
        </fieldset>
    );
}

export default RewardTypeSelector;
