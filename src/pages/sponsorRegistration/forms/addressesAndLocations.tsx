import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';
import InputField from '../../../components/form-fields/inputField/InputField';
import HeaderTitle from '../../../components/common/HeaderTitle';
import DescriptionText from '../../../components/common/DescriptionText';
import { CustomDropdown, type DropdownOption } from '../../../components/common/Dropdown';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import { LocationPin } from '../../../components/icons';
import ActionButton from '../../../components/common/ActionButton';
import useFetchAllDropdownsData from '../hooks/useFetchAllDropdownsData';

interface AddressFormData {
    // Head Office Address
    headOfficeAddressLine1: string;
    headOfficeCountry: DropdownOption | undefined;
    headOfficeCity: DropdownOption | undefined;
    headOfficeState: DropdownOption | undefined;
    headOfficePostalCode: string;

    // Billing Address
    sameAsHeadOffice: boolean;
    custom_billing_address_line_1: string;
    custom_billing_country: DropdownOption | undefined;
    custom_billing_city: string;
    custom_billing_state: string;
    custom_billing_postal_code: string;
}

function AddressesAndLocations() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();

    // Fetch dropdown data from API
    const { countryList } = useFetchAllDropdownsData();

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        trigger,
        formState: { errors, isValid },
    } = useForm<AddressFormData>({
        mode: 'onChange',
        defaultValues: {
            headOfficeAddressLine1: formData.custom_address_line_1,
            headOfficeCountry: formData.country,
            headOfficeCity: formData.city ? { label: formData.city, value: formData.city.toLowerCase().replaceAll(/\s+/g, '-') } : undefined,
            headOfficeState: formData.state ? { label: formData.state, value: formData.state.toLowerCase().replaceAll(/\s+/g, '-') } : undefined,
            headOfficePostalCode: formData.custom_postal_code,
            sameAsHeadOffice: formData.sameAsHeadOffice,
            custom_billing_address_line_1: formData.custom_billing_address_line_1,
            custom_billing_country: formData.custom_billing_country,
            custom_billing_city: formData.custom_billing_city,
            custom_billing_state: formData.custom_billing_state,
            custom_billing_postal_code: formData.custom_billing_postal_code,
        },
    });

    const [sameAsHeadOffice, setSameAsHeadOffice] = useState(formData.sameAsHeadOffice);

    // Watch head office fields
    const headOfficeAddressLine1 = watch('headOfficeAddressLine1');
    const headOfficeCountry = watch('headOfficeCountry');
    const headOfficeCity = watch('headOfficeCity');
    const headOfficeState = watch('headOfficeState');
    const headOfficePostalCode = watch('headOfficePostalCode');

    // Sync billing address with head office when checkbox is checked
    useEffect(() => {
        if (sameAsHeadOffice) {
            setValue('custom_billing_address_line_1', headOfficeAddressLine1, { shouldValidate: true });
            setValue('custom_billing_country', headOfficeCountry, { shouldValidate: true });
            setValue('custom_billing_city', headOfficeCity?.label || '', { shouldValidate: true });
            setValue('custom_billing_state', headOfficeState?.label || '', { shouldValidate: true });
            setValue('custom_billing_postal_code', headOfficePostalCode, { shouldValidate: true });
            trigger([
                'custom_billing_address_line_1',
                'custom_billing_country',
                'custom_billing_city',
                'custom_billing_state',
                'custom_billing_postal_code',
            ]);
        }
    }, [sameAsHeadOffice, headOfficeAddressLine1, headOfficeCountry, headOfficeCity, headOfficeState, headOfficePostalCode, setValue, trigger]);

    const handleCheckboxChange = (checked: boolean) => {
        setSameAsHeadOffice(checked);
        setValue('sameAsHeadOffice', checked, { shouldValidate: true });
        trigger([
            'sameAsHeadOffice',
            'custom_billing_address_line_1',
            'custom_billing_country',
            'custom_billing_city',
            'custom_billing_state',
            'custom_billing_postal_code',
        ]);
    };

    const onFormSubmit = (data: AddressFormData) => {
        // Map local form field names to API keys - send city and state as strings
        const formDataToUpdate = {
            custom_address_line_1: data.headOfficeAddressLine1,
            country: data.headOfficeCountry,
            city: data.headOfficeCity?.label || '',
            state: data.headOfficeState?.label || '',
            custom_postal_code: data.headOfficePostalCode,
            sameAsHeadOffice: data.sameAsHeadOffice,
            custom_billing_address_line_1: data.custom_billing_address_line_1,
            custom_billing_country: data.custom_billing_country,
            custom_billing_city: data.custom_billing_city || '',
            custom_billing_state: data.custom_billing_state || '',
            custom_billing_postal_code: data.custom_billing_postal_code,
        };

        // Update the central form data
        updateFormData(formDataToUpdate);

        // Mark step 2 as completed
        markStepAsCompleted(2);

        // Move to next step
        setCurrentStep(3);
    };

    return (
        <div className="addresses-locations-form">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <LocationPin size={20} />
                    <HeaderTitle text="Addresses & Locations" size="xl" weight="medium" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                {/* Head Office Address Information */}
                <div className="mb-8">
                    <DescriptionText text="Head Office Address Information" size="sm" weight="medium" color="text-black" className="mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address Line 1 */}
                        <Controller
                            name="headOfficeAddressLine1"
                            control={control}
                            rules={{ required: 'Address line 1 is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="headOfficeAddressLine1"
                                    name="headOfficeAddressLine1"
                                    label="Address Line 1"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Street / Building / Area"
                                    required
                                    error={errors.headOfficeAddressLine1?.message}
                                />
                            )}
                        />

                        {/* Country */}
                        <Controller
                            name="headOfficeCountry"
                            control={control}
                            rules={{ required: 'Country is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Country"
                                    options={countryList}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select Country"
                                    width="100%"
                                    required
                                    error={errors.headOfficeCountry?.message}
                                />
                            )}
                        />

                        {/* State */}
                        <Controller
                            name="headOfficeState"
                            control={control}
                            rules={{ required: 'State is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="headOfficeState"
                                    name="headOfficeState"
                                    label="State"
                                    value={field.value?.label || ''}
                                    onChange={value => field.onChange({ label: value, value: value.toLowerCase().replaceAll(/\s+/g, '-') })}
                                    placeholder="Enter State"
                                    required
                                    error={errors.headOfficeState?.message}
                                />
                            )}
                        />

                        {/* City */}
                        <Controller
                            name="headOfficeCity"
                            control={control}
                            rules={{ required: 'City is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="headOfficeCity"
                                    name="headOfficeCity"
                                    label="City"
                                    value={field.value?.label || ''}
                                    onChange={value => field.onChange({ label: value, value: value.toLowerCase().replaceAll(/\s+/g, '-') })}
                                    placeholder="Enter City"
                                    required
                                    error={errors.headOfficeCity?.message}
                                />
                            )}
                        />

                        {/* Postal Code */}
                        <Controller
                            name="headOfficePostalCode"
                            control={control}
                            render={({ field }) => (
                                <InputField
                                    id="headOfficePostalCode"
                                    name="headOfficePostalCode"
                                    label="Postal Code"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Company Name"
                                    error={errors.headOfficePostalCode?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Billing Address Information */}
                <div className="mb-8">
                    <DescriptionText text="Billing Address Information" size="sm" weight="medium" color="text-black" className="mb-6" />

                    {/* Same as Head Office Checkbox */}
                    <div className="mb-6">
                        <label htmlFor="sameAsHeadOffice" className="flex items-center gap-2 cursor-pointer">
                            <input
                                id="sameAsHeadOffice"
                                type="checkbox"
                                checked={sameAsHeadOffice}
                                onChange={event => handleCheckboxChange(event.target.checked)}
                                className="w-4 h-4 text-brand-500 border-gray-600 rounded focus:ring-brand-500"
                            />
                            <span className="text-sm text-gray-700">Same as Head Office Address</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address Line 1 */}
                        <Controller
                            name="custom_billing_address_line_1"
                            control={control}
                            rules={{ required: sameAsHeadOffice ? false : 'Address line 1 is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="custom_billing_address_line_1"
                                    name="custom_billing_address_line_1"
                                    label="Address Line 1"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Street / Building / Area"
                                    required={!sameAsHeadOffice}
                                    disabled={sameAsHeadOffice}
                                    error={errors.custom_billing_address_line_1?.message}
                                />
                            )}
                        />

                        {/* Country */}
                        <Controller
                            name="custom_billing_country"
                            control={control}
                            rules={{ required: sameAsHeadOffice ? false : 'Country is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Country"
                                    options={countryList}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select Country"
                                    width="100%"
                                    required={!sameAsHeadOffice}
                                    disabled={sameAsHeadOffice}
                                    error={errors.custom_billing_country?.message}
                                />
                            )}
                        />

                        {/* State */}
                        <Controller
                            name="custom_billing_state"
                            control={control}
                            rules={{ required: sameAsHeadOffice ? false : 'State is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="custom_billing_state"
                                    name="custom_billing_state"
                                    label="State"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Enter State"
                                    required={!sameAsHeadOffice}
                                    disabled={sameAsHeadOffice}
                                    error={errors.custom_billing_state?.message}
                                />
                            )}
                        />

                        {/* City */}
                        <Controller
                            name="custom_billing_city"
                            control={control}
                            rules={{ required: sameAsHeadOffice ? false : 'City is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="custom_billing_city"
                                    name="custom_billing_city"
                                    label="City"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Enter City"
                                    required={!sameAsHeadOffice}
                                    disabled={sameAsHeadOffice}
                                    error={errors.custom_billing_city?.message}
                                />
                            )}
                        />

                        {/* Postal Code */}
                        <Controller
                            name="custom_billing_postal_code"
                            control={control}
                            rules={{ required: sameAsHeadOffice ? false : 'Postal code is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="custom_billing_postal_code"
                                    name="custom_billing_postal_code"
                                    label="Postal Code"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Company Name"
                                    required={!sameAsHeadOffice}
                                    disabled={sameAsHeadOffice}
                                    error={errors.custom_billing_postal_code?.message}
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                    <ActionButton
                        type="submit"
                        bgColor={isValid ? 'bg-brand-primary-500' : 'bg-gray-300'}
                        textColor={isValid ? 'text-white' : 'text-gray-700'}
                        width="auto"
                        className="text-sm! px-10"
                    >
                        Save & Continue
                    </ActionButton>
                </div>
            </form>
        </div>
    );
}

export default AddressesAndLocations;
