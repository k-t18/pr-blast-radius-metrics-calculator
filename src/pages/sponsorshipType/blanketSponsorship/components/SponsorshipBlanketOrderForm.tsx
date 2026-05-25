import { lazy, Suspense } from 'react';
import { Controller, useForm } from 'react-hook-form';
import DescriptionText from '../../../../components/common/DescriptionText';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { RadioButton } from '../../../../components/common/RadioButton';
import type { BlanketSponsorshipFormData } from '../../../../interfaces/blanketSponsorship/blanketSponsorship.types';
import { useBlanketSponsorshipFormLogic } from '../../../../hooks/blanketSponsorship/useBlanketSponsorshipFormLogic';

// Lazy load BlanketSponsorshipFormFields
const BlanketSponsorshipFormFields = lazy(() => import('./BlanketSponsorshipFormFields'));

interface SponsorshipBlanketOrderFormProperties {
    setShowSubmissionModal?: (show: boolean) => void;
}

export default function SponsorshipBlanketOrderForm({ setShowSubmissionModal }: SponsorshipBlanketOrderFormProperties) {
    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<BlanketSponsorshipFormData>({
        mode: 'onChange',
        defaultValues: {
            sponsorship_type: '',
            studio_show_rate: '',
            studio_show_sponsor_ship_duration: '',
            studio_start_date: '',
            mobile_show_rate: '',
            mobile_show_sponsor_ship_duration: '',
            mobile_start_date: '',
            allocation_type: '',
            remarks: '',
        },
    });

    const selectedType = watch('sponsorship_type');
    const showStudioFields = selectedType === 'Studio Show' || selectedType === 'Both';
    const showMobileFields = selectedType === 'Mobile Game' || selectedType === 'Both';
    const showFormFields = selectedType !== '';

    const { createBlanketOrderMutation, transformFormDataToApiRequest } = useBlanketSponsorshipFormLogic({
        selectedType,
        reset,
        setValue,
        setShowSubmissionModal,
    });

    const onSubmit = (data: BlanketSponsorshipFormData) => {
        const payload = transformFormDataToApiRequest(data);
        createBlanketOrderMutation.mutate(payload);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4">
                <HeaderTitle text="Create a Blanket Sponsorship Order" size="2xl" weight="medium" />
                <DescriptionText
                    text="Don't have time to pick individual placements? Just set a budget and timeframe — we'll take care of the rest, or you can allocate it later."
                    size="sm"
                    color="text-primary-text"
                    weight="normal"
                    className="my-6 leading-[22px]"
                />

                <div className="space-y-2">
                    <HeaderTitle
                        text="What type of sponsorship are you interested in?"
                        size="sm"
                        weight="medium"
                        disabled={false}
                        className="leading-[22px]"
                    />
                    <Controller
                        name="sponsorship_type"
                        control={control}
                        rules={{ required: 'Please select a sponsorship type' }}
                        render={({ field }) => (
                            <div className="flex flex-wrap gap-8">
                                {[
                                    { id: 'sponsorship-type-studio', value: 'Studio Show', label: 'Studio Show' },
                                    { id: 'sponsorship-type-mobile', value: 'Mobile Game', label: 'Mobile Game' },
                                    { id: 'sponsorship-type-both', value: 'Both', label: 'Both' },
                                ].map(option => (
                                    <div key={option.id} className="flex items-center gap-2">
                                        <RadioButton
                                            inputId={option.id}
                                            name="sponsorshipType"
                                            value={option.value}
                                            onChange={event => field.onChange(event.value)}
                                            checked={field.value === option.value}
                                            label={<span className="text-xs font-normal leading-5">{option.label}</span>}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                    {errors.sponsorship_type && <span className="text-red-500 text-xs">{errors.sponsorship_type.message}</span>}
                </div>

                {showFormFields && (
                    <Suspense fallback={undefined}>
                        <BlanketSponsorshipFormFields
                            control={control}
                            showStudioFields={showStudioFields}
                            showMobileFields={showMobileFields}
                            selectedType={selectedType}
                            errors={errors}
                            isValid={isValid}
                            isSubmitting={createBlanketOrderMutation.isPending}
                        />
                    </Suspense>
                )}
            </div>
        </form>
    );
}
