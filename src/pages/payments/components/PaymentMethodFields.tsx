import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { CustomDropdown, type DropdownOption } from '../../../components/common/Dropdown';
import { InputField } from '../../../components/form-fields/inputField';
import type { PaymentCheckoutFormData } from './PaymentCheckoutModal';

interface PaymentMethodFieldsProperties {
    method: 'card' | 'bank';
    cardOptions: DropdownOption[];
    bankOptions: DropdownOption[];
    control: Control<PaymentCheckoutFormData>;
    errors: FieldErrors<PaymentCheckoutFormData>;
    isCreditCardDetailsLoading?: boolean;
    isBankDetailsLoading?: boolean;
}

export function PaymentMethodFields({
    method,
    cardOptions,
    bankOptions,
    control,
    errors,
    isCreditCardDetailsLoading,
    isBankDetailsLoading,
}: PaymentMethodFieldsProperties) {
    if (method === 'card') {
        return (
            <div className="mt-6 space-y-4">
                <Controller
                    name="cardHolderName"
                    control={control}
                    rules={{ required: 'Card holder name is required' }}
                    render={({ field }) => (
                        <InputField
                            id="card-holder-name"
                            name="card-holder-name"
                            type="text"
                            value={field.value || ''}
                            placeholder="Name"
                            className="mt-2 text-primary-text"
                            onChange={value => field.onChange(value)}
                            label="Card Holder Name"
                            inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                            min="0"
                            error={errors.cardHolderName?.message}
                        />
                    )}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="cardType"
                        control={control}
                        rules={{ required: 'Card type is required' }}
                        render={({ field }) => (
                            <CustomDropdown
                                value={field.value}
                                options={cardOptions}
                                width="auto"
                                onChange={value => field.onChange(value)}
                                placeholder="Select Card"
                                label="Card Type"
                                dropDownClass="w-full payment-dropdown text-xs font-normal leading-5"
                                className="mt-2"
                                error={errors.cardType?.message}
                                disabled={isCreditCardDetailsLoading}
                            />
                        )}
                    />
                    <Controller
                        name="cardNumber"
                        control={control}
                        rules={{ required: 'Card number is required' }}
                        render={({ field }) => (
                            <InputField
                                id="card-number"
                                name="card-number"
                                type="text"
                                value={field.value || ''}
                                placeholder="333-3333"
                                className="mt-2 text-primary-text"
                                onChange={value => field.onChange(value)}
                                label="Card Number"
                                inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                                min="0"
                                error={errors.cardNumber?.message}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="expiryDate"
                        control={control}
                        rules={{ required: 'Expiry date is required' }}
                        render={({ field }) => (
                            <InputField
                                id="expiray-date"
                                name="expiray-date"
                                type="text"
                                value={field.value || ''}
                                placeholder="MM / YY"
                                className="mt-2 text-primary-text"
                                onChange={value => field.onChange(value)}
                                label="Expiry Date"
                                inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                                min="0"
                                error={errors.expiryDate?.message}
                            />
                        )}
                    />
                    <Controller
                        name="securityCode"
                        control={control}
                        rules={{ required: 'Security code is required' }}
                        render={({ field }) => (
                            <InputField
                                id="security-code"
                                name="security-code"
                                type="text"
                                value={field.value || ''}
                                placeholder="CVC"
                                className="mt-2 text-primary-text"
                                onChange={value => field.onChange(value)}
                                label="Security Code"
                                inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                                min="0"
                                error={errors.securityCode?.message}
                            />
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/i,
                                message: 'Invalid email address',
                            },
                        }}
                        render={({ field }) => (
                            <InputField
                                id="email"
                                name="email"
                                type="email"
                                value={field.value || ''}
                                placeholder="company@gamil.com"
                                className="mt-2 text-primary-text"
                                onChange={value => field.onChange(value)}
                                label="Email"
                                inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                                min="0"
                                error={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        name="phoneNumber"
                        control={control}
                        rules={{ required: 'Phone number is required' }}
                        render={({ field }) => (
                            <InputField
                                id="phone-number"
                                name="phone-number"
                                type="tel"
                                value={field.value || ''}
                                placeholder="+234 XXXXXXXX"
                                className="mt-2 text-primary-text"
                                onChange={value => field.onChange(value)}
                                label="Phone Number"
                                inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                                min="0"
                                error={errors.phoneNumber?.message}
                            />
                        )}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6 space-y-4">
            <Controller
                name="bankType"
                control={control}
                rules={{ required: 'Bank type is required' }}
                render={({ field }) => (
                    <CustomDropdown
                        value={field.value}
                        options={bankOptions}
                        width="auto"
                        onChange={value => field.onChange(value)}
                        placeholder="Select Bank"
                        label="Select Bank"
                        dropDownClass="w-full payment-dropdown text-xs font-normal leading-5"
                        className="mt-2"
                        error={errors.cardType?.message}
                        disabled={isBankDetailsLoading}
                    />
                )}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    }}
                    render={({ field }) => (
                        <InputField
                            id="email"
                            name="email"
                            type="email"
                            value={field.value || ''}
                            placeholder="company@gamil.com"
                            className="mt-2 text-primary-text"
                            onChange={value => field.onChange(value)}
                            label="Email"
                            inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                            min="0"
                            error={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{ required: 'Phone number is required' }}
                    render={({ field }) => (
                        <InputField
                            id="phone-number"
                            name="phone-number"
                            type="tel"
                            value={field.value || ''}
                            placeholder="+234 XXXXXXXX"
                            className="mt-2 text-primary-text"
                            onChange={value => field.onChange(value)}
                            label="Phone Number"
                            inputClassName="w-full custom-payment-input border h-[36px] pl-8 pr-3 py-2 font-normal"
                            min="0"
                            error={errors.phoneNumber?.message}
                        />
                    )}
                />
            </div>
        </div>
    );
}
