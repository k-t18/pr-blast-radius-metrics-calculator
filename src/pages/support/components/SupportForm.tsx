import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import HeaderTitle from '../../../components/common/HeaderTitle';
import { CustomDropdown, type DropdownOption } from '../../../components/common/Dropdown';
import InputField from '../../../components/form-fields/inputField/InputField';
// import { RadioButtonGroup } from '../../../components/common/RadioButton';
import ActionButton from '../../../components/common/ActionButton';
// import FormLabel from '../../../components/common/FormLabel';
import FileUpload from '../../../components/form-fields/fileUpload/FileUpload';
import SupportModal from './SupportModal';
import type { SupportFormData } from '../../../interfaces/support/support.types';
import { TextAreaField } from '../../../components/form-fields/textAreaField';
import useFetchSupportData from '../hooks/useFetchSupportData';

// const priorityOptions: DropdownOption[] = [
//     { value: 'high', label: 'High' },
//     { value: 'medium', label: 'Medium' },
//     { value: 'low', label: 'Low' },
// ];
const sponsorshipTypeFixedOptions: DropdownOption[] = [
    { label: 'Mobile Game', value: 'Mobile Game' },
    { label: 'Studio Show', value: 'Studio Show' },
];
function SupportForm() {
    const [showModal, setShowModal] = useState(false);
    const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);
    const [formInstanceKey, setFormInstanceKey] = useState(0);

    const {
        issueCategories,
        isLoadingIssueCategory,
        sponsorshipCategories,
        isLoadingSponsorshipCategory,
        createTicketMutation,
        uploadAttachmentMutation,
    } = useFetchSupportData();

    const defaultValues = useMemo<SupportFormData>(() => {
        return {
            category: undefined, // API category
            sponsorshipType: undefined, // sponsorship_type
            issueCategory: undefined,
            subject: '',
            description: '',
            priority: 'high',
            attachments: [],
            uploadedFileNames: [],
        };
    }, []);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<SupportFormData>({
        mode: 'onChange',
        defaultValues,
    });

    const issueCategoryOptions = useMemo<DropdownOption[]>(() => {
        return issueCategories.map(item => ({ label: item.label, value: item.name }));
    }, [issueCategories]);

    const sponsorshipCategoryOptions = useMemo<DropdownOption[]>(() => {
        return sponsorshipCategories.map(item => ({ label: item.label, value: item.name }));
    }, [sponsorshipCategories]);

    const onSubmit = (data: SupportFormData) => {
        /* eslint-disable no-console */
        console.log('data', data);
        createTicketMutation.mutate(
            { ...data, uploadedFileNames },
            {
                onSuccess: () => {
                    setShowModal(true);
                    reset(defaultValues);
                    setUploadedFileNames([]);
                    setFormInstanceKey(previous => previous + 1);
                },
            }
        );
    };

    const handleAttachmentChange = (file: File | undefined, onFieldChange: (value: File[]) => void) => {
        if (!file) {
            onFieldChange([]);
            setUploadedFileNames([]);
            return;
        }

        onFieldChange([file]);
        setUploadedFileNames([]);

        uploadAttachmentMutation.mutate(file, {
            onSuccess: response => {
                const fileNames = (response.data ?? [])
                    .map(item => {
                        if (!item) return null;
                        if (typeof item === 'string') return item;
                        // normalize legacy shape { file_name: string }
                        return (item as { file_name?: string }).file_name ?? null;
                    })
                    .filter(Boolean) as string[];
                setUploadedFileNames(fileNames);
            },
            onError: () => {
                onFieldChange([]);
                setUploadedFileNames([]);
            },
        });
    };

    let actionButtonLabel = 'Submit Ticket';
    if (uploadAttachmentMutation.isPending) {
        actionButtonLabel = 'Uploading...';
    }
    if (createTicketMutation.isPending) {
        actionButtonLabel = 'Submitting...';
    }
    return (
        <div>
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-4 mb-8">
                <HeaderTitle text="Submit a support ticket" size="xl" weight="medium" className="font-ubuntu mb-6" />

                <form key={formInstanceKey} onSubmit={handleSubmit(onSubmit)}>
                    {/* Category (API) and Issue Category */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <Controller
                            name="sponsorshipType"
                            control={control}
                            rules={{ required: 'Sponsorship type is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Sponsorship Type"
                                    options={sponsorshipTypeFixedOptions}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select"
                                    width="100%"
                                    required
                                    error={errors.sponsorshipType?.message}
                                />
                            )}
                        />
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: 'Category is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Category"
                                    options={sponsorshipCategoryOptions}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select"
                                    width="100%"
                                    required
                                    disabled={isLoadingSponsorshipCategory}
                                    error={errors.category?.message}
                                />
                            )}
                        />
                        <Controller
                            name="issueCategory"
                            control={control}
                            rules={{ required: 'Issue category is required' }}
                            render={({ field }) => (
                                <CustomDropdown
                                    label="Issue Category"
                                    options={issueCategoryOptions}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Select"
                                    width="100%"
                                    required
                                    disabled={isLoadingIssueCategory}
                                    error={errors.issueCategory?.message}
                                />
                            )}
                        />
                    </div>

                    {/* Subject */}
                    <div className="mb-4">
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: 'Subject is required' }}
                            render={({ field }) => (
                                <InputField
                                    id="subject"
                                    name="subject"
                                    label="Subject"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Not able to choose more than 7 squares on the board"
                                    error={errors.subject?.message}
                                    required
                                />
                            )}
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <TextAreaField
                                    id="description"
                                    name="description"
                                    label="Description"
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    placeholder="Describe your issue here..."
                                    rows={1}
                                    error={errors.description?.message}
                                    required
                                    textAreaClassName="border-[#D6D6D6] rounded-sm border p-2"
                                />
                            )}
                        />
                    </div>

                    {/* Issue Priority */}
                    {/* <div className="mb-4">
                        <FormLabel id="priority" label="Issue Priority" className="support-radio-button-group-label" />
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <RadioButtonGroup
                                    name="priority"
                                    options={priorityOptions}
                                    value={field.value}
                                    onChange={value => field.onChange(value)}
                                    layout="horizontal"
                                    className="support-radio-button-group"
                                />
                            )}
                        />
                    </div> */}

                    {/* Attachments */}
                    <div className="mb-6">
                        <Controller
                            name="attachments"
                            control={control}
                            render={({ field }) => (
                                <FileUpload
                                    id="attachments"
                                    name="attachments"
                                    label="Attachments"
                                    onChange={file => handleAttachmentChange(file, field.onChange)}
                                    value={field.value?.[0]}
                                    maxFileSize={10_485_760}
                                    accept=".jpg,.jpeg,.png,.mp4"
                                    helperText={
                                        uploadAttachmentMutation.isPending
                                            ? 'Uploading attachment...'
                                            : 'Supported JPEG, PNG, and MP4 formats, up to 10 MB'
                                    }
                                    showRemoveButton
                                    maxWidth="777px"
                                    disabled={uploadAttachmentMutation.isPending}
                                />
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <ActionButton
                        type="submit"
                        bgColor={isValid ? 'bg-brand-primary-500' : 'bg-gray-300'}
                        textColor={isValid ? 'text-white' : 'text-gray-700'}
                        borderRadius="rounded"
                        width="auto"
                        className="text-sm font-ubuntu font-weight-400"
                        isDisabled={!isValid || createTicketMutation.isPending || uploadAttachmentMutation.isPending}
                    >
                        {actionButtonLabel}
                    </ActionButton>
                </form>
            </div>

            {/* Support Modal: opens on submit */}
            <SupportModal visible={showModal} onHide={() => setShowModal(false)} />
        </div>
    );
}

export default SupportForm;
