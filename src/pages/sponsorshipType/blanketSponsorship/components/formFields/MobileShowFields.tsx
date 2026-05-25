import { Controller } from 'react-hook-form';
import type { Control, FieldErrors } from 'react-hook-form';
import { BudgetInput } from '../BudgetInput';
import { DurationDropdown } from '../DurationDropdown';
import DateInput from '../../../../../components/common/DateInput';
import type { BlanketSponsorshipFormData } from '../../../../../interfaces/blanketSponsorship/blanketSponsorship.types';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface MobileShowFieldsProperties {
    control: Control<BlanketSponsorshipFormData>;
    showMobileFields: boolean;
    selectedType: string;
    errors: FieldErrors<BlanketSponsorshipFormData>;
}

export function MobileShowFields({ control, showMobileFields, selectedType, errors }: MobileShowFieldsProperties) {
    return (
        <div className="mt-6">
            <Controller
                name="mobile_show_rate"
                control={control}
                rules={{
                    // required: showMobileFields ? 'Mobile budget is required' : false,
                    required: false,
                    validate: value => {
                        if (showMobileFields && (!value || Number(value.replaceAll(',', '')) <= 0)) {
                            return 'Budget must be greater than 0';
                        }
                        return true;
                    },
                }}
                render={({ field }) => (
                    <BudgetInput
                        id="mobile-budget"
                        label={
                            selectedType === 'Both' ? (
                                <>
                                    Tell us your total budget for <span className="italic font-semibold">&quot;Mobile Game&quot;</span>
                                </>
                            ) : (
                                'Tell us your total budget'
                            )
                        }
                        value={field.value || ''}
                        onChange={value => {
                            const numberValue = value ? Number(value.replaceAll(',', '')) : 0;
                            if (!Number.isNaN(numberValue)) {
                                field.onChange(formatCurrency(numberValue));
                            }
                        }}
                    />
                )}
            />
            {errors.mobile_show_rate && <span className="text-red-500 text-xs">{errors.mobile_show_rate.message}</span>}

            <div className="flex gap-8 mt-6">
                <div className="w-[173px]">
                    <Controller
                        name="mobile_start_date"
                        control={control}
                        rules={{
                            required: showMobileFields ? 'Sponsorship start date is required' : false,
                        }}
                        render={({ field }) => (
                            <DateInput
                                id="mobile-start-date"
                                name="mobile_show_start_date"
                                label="Sponsorship start date"
                                value={field.value || ''}
                                onChange={value => field.onChange(value)}
                                dateFormat="dd-mm-yy"
                            />
                        )}
                    />
                    {errors.mobile_start_date && <span className="text-red-500 text-xs">{errors.mobile_start_date.message}</span>}
                </div>
                <div>
                    <Controller
                        name="mobile_show_sponsor_ship_duration"
                        control={control}
                        rules={{
                            required: showMobileFields ? 'Mobile duration is required' : false,
                        }}
                        render={({ field }) => (
                            <DurationDropdown
                                key={`mobile-duration-${selectedType}`}
                                label={selectedType === 'Both' ? <>Select Duration (in days)</> : 'Select Duration (in days)'}
                                value={field.value || ''}
                                onChange={value => field.onChange(value)}
                            />
                        )}
                    />
                    {errors.mobile_show_sponsor_ship_duration && (
                        <span className="text-red-500 text-xs">{errors.mobile_show_sponsor_ship_duration.message}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
