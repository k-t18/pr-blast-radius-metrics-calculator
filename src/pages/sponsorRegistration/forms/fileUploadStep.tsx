import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import FileUpload from '../../../components/form-fields/fileUpload/FileUpload';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { useSponsorRegistration } from '../context/sponsorRegistrationContext';
import ActionButton from '../../../components/common/ActionButton';
import { Images } from '../../../components/icons';

interface FileUploadFormData {
    companyLogo: File | string | undefined;
    taxCertificate: File | string | undefined;
    cacCertificate: File | string | undefined;
    authorisedSignatoryId: File | string | undefined;
}

type StoredDisplayFile = File & { storedName?: string };

const createDisplayFileFromName = (name: string): StoredDisplayFile =>
    Object.assign(new File([''], name, { type: 'application/octet-stream' }), { storedName: name });

const toDisplayValue = (value: File | string | undefined): File | undefined => {
    if (typeof value === 'string') {
        return createDisplayFileFromName(value);
    }
    return value;
};

const normalizeValue = (value: File | string | undefined, previous: File | string | undefined) => {
    if (value instanceof File && (value as StoredDisplayFile).storedName) {
        return (value as StoredDisplayFile).storedName;
    }
    if (value instanceof File || typeof value === 'string') {
        return value;
    }
    return previous && typeof previous === 'string' ? previous : undefined;
};

function FileUploadStep() {
    const { formData, updateFormData, markStepAsCompleted, setCurrentStep } = useSponsorRegistration();

    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors, isValid },
    } = useForm<FileUploadFormData>({
        mode: 'onChange',
        defaultValues: {
            companyLogo: toDisplayValue(formData.companyLogo),
            taxCertificate: toDisplayValue(formData.taxCertificate),
            cacCertificate: toDisplayValue(formData.cacCertificate),
            authorisedSignatoryId: toDisplayValue(formData.authorisedSignatoryId),
        },
    });

    const onFormSubmit: SubmitHandler<FileUploadFormData> = data => {
        const payload: FileUploadFormData = {
            companyLogo: normalizeValue(data.companyLogo, formData.companyLogo),
            taxCertificate: normalizeValue(data.taxCertificate, formData.taxCertificate),
            cacCertificate: normalizeValue(data.cacCertificate, formData.cacCertificate),
            authorisedSignatoryId: normalizeValue(data.authorisedSignatoryId, formData.authorisedSignatoryId),
        };

        // Update the central form data
        updateFormData(payload);

        // Mark step 6 as completed
        markStepAsCompleted(6);

        // TODO: Temporarily skipping Target Audience (step 7) - change back to setCurrentStep(7) when ready
        // Move directly to step 8 (Review and Consent)
        setCurrentStep(8);
    };

    return (
        <div className="file-upload-form">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <Images size={20} />
                    <HeaderTitle text="Upload Documents" size="xl" weight="medium" />
                </div>
            </div>

            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Company Logo */}
                    <Controller
                        name="companyLogo"
                        control={control}
                        rules={{
                            validate: value => {
                                if (typeof value === 'string') {
                                    return true;
                                }
                                if (!value || !(value instanceof File)) {
                                    return 'Company logo is required';
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FileUpload
                                id="companyLogo"
                                name="companyLogo"
                                label="Upload Company Logo"
                                value={typeof field.value === 'string' ? undefined : field.value}
                                onChange={file => {
                                    field.onChange(file);
                                    trigger('companyLogo');
                                }}
                                accept=".png,.jpg,.jpeg"
                                maxFileSize={1_048_576}
                                helperText="Acceptable file types: PNG, JPG"
                                error={errors.companyLogo?.message}
                            />
                        )}
                    />

                    {/* Tax Certificate */}
                    <Controller
                        name="taxCertificate"
                        control={control}
                        rules={{
                            validate: value => {
                                if (typeof value === 'string') {
                                    return true;
                                }
                                if (!value || !(value instanceof File)) {
                                    return 'Tax certificate is required';
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FileUpload
                                id="taxCertificate"
                                name="taxCertificate"
                                label="Upload Tax Certificate"
                                value={typeof field.value === 'string' ? undefined : field.value}
                                onChange={file => {
                                    field.onChange(file);
                                    trigger('taxCertificate');
                                }}
                                accept=".pdf"
                                maxFileSize={1_048_576}
                                helperText="Acceptable file types: PDF"
                                error={errors.taxCertificate?.message}
                            />
                        )}
                    />

                    {/* CAC Certificate */}
                    <Controller
                        name="cacCertificate"
                        control={control}
                        rules={{
                            validate: value => {
                                if (typeof value === 'string') {
                                    return true;
                                }
                                if (!value || !(value instanceof File)) {
                                    return 'CAC certificate is required';
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FileUpload
                                id="cacCertificate"
                                name="cacCertificate"
                                label="Upload CAC Certificate"
                                value={typeof field.value === 'string' ? undefined : field.value}
                                onChange={file => {
                                    field.onChange(file);
                                    trigger('cacCertificate');
                                }}
                                accept=".pdf"
                                maxFileSize={1_048_576}
                                helperText="Acceptable file types: PDF"
                                error={errors.cacCertificate?.message}
                            />
                        )}
                    />

                    {/* Authorised Signatory ID */}
                    <Controller
                        name="authorisedSignatoryId"
                        control={control}
                        rules={{
                            validate: value => {
                                if (typeof value === 'string') {
                                    return true;
                                }
                                if (!value || !(value instanceof File)) {
                                    return 'Authorised signatory ID is required';
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FileUpload
                                id="authorisedSignatoryId"
                                name="authorisedSignatoryId"
                                label="Authorised Signatory ID"
                                value={typeof field.value === 'string' ? undefined : field.value}
                                onChange={file => {
                                    field.onChange(file);
                                    trigger('authorisedSignatoryId');
                                }}
                                accept=".png,.jpg,.jpeg"
                                maxFileSize={1_048_576}
                                helperText="Acceptable file types: PNG, JPG"
                                error={errors.authorisedSignatoryId?.message}
                            />
                        )}
                    />
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

export default FileUploadStep;
