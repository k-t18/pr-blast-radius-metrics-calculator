import type { UseFormReset, UseFormSetValue } from 'react-hook-form';
import { useEffect, useRef } from 'react';
import { useApiMutation } from '../useApiMutation';
import { createBlanketSponsorship, type CreateBlanketOrderRequest } from '../../services/blanketSponsorship/createBlanketSponsorship.api';
import type { BlanketSponsorshipFormData, SponsorshipType } from '../../interfaces/blanketSponsorship/blanketSponsorship.types';

interface UseBlanketSponsorshipFormLogicProperties {
    selectedType: SponsorshipType;
    reset: UseFormReset<BlanketSponsorshipFormData>;
    setValue: UseFormSetValue<BlanketSponsorshipFormData>;
    setShowSubmissionModal?: (show: boolean) => void;
}

export function useBlanketSponsorshipFormLogic({ selectedType, reset, setValue, setShowSubmissionModal }: UseBlanketSponsorshipFormLogicProperties) {
    // Track previous selectedType to detect changes
    const previousSelectedType = useRef<SponsorshipType>('');

    // Clear form fields whenever sponsorship type changes
    useEffect(() => {
        if (selectedType && selectedType !== previousSelectedType.current) {
            // Clear all fields except sponsorship_type
            reset({
                sponsorship_type: selectedType,
                studio_show_rate: '',
                studio_show_sponsor_ship_duration: '',
                mobile_show_rate: '',
                mobile_show_sponsor_ship_duration: '',
                allocation_type: '',
                remarks: '',
            });
            // Explicitly set duration fields to empty to ensure dropdowns clear
            setValue('studio_show_sponsor_ship_duration', '');
            setValue('mobile_show_sponsor_ship_duration', '');
            previousSelectedType.current = selectedType;
        }
    }, [selectedType, reset, setValue]);

    const createBlanketOrderMutation = useApiMutation({
        mutationFn: (requestData: CreateBlanketOrderRequest) => createBlanketSponsorship(requestData),
        onSuccess: () => {
            // Reset form to initial state
            reset({
                sponsorship_type: '',
                studio_show_rate: '',
                studio_show_sponsor_ship_duration: '',
                mobile_show_rate: '',
                mobile_show_sponsor_ship_duration: '',
                allocation_type: '',
                remarks: '',
            });
            // Show success modal via parent component
            if (setShowSubmissionModal) {
                setShowSubmissionModal(true);
            }
        },
        onError: error => {
            // Error handling is done by useApiMutation (shows error toast)
            // eslint-disable-next-line no-console
            console.error('Failed to create blanket order:', error);
        },
        successMessage: 'Blanket sponsorship order created successfully!',
    });

    // Transform form data to API request format
    const transformFormDataToApiRequest = (data: BlanketSponsorshipFormData): CreateBlanketOrderRequest => {
        const showStudioFields = selectedType === 'Studio Show' || selectedType === 'Both';
        const showMobileFields = selectedType === 'Mobile Game' || selectedType === 'Both';
        const request: CreateBlanketOrderRequest = {
            sponsorship_type: data.sponsorship_type,
        };

        // Add studio show fields if applicable
        if (showStudioFields && data.studio_show_rate && data.studio_show_sponsor_ship_duration && data.studio_start_date) {
            // Convert budget string (with commas) to number
            request.studio_show_rate = Number(data.studio_show_rate.replaceAll(',', ''));
            request.studio_show_sponsor_ship_duration = data.studio_show_sponsor_ship_duration;
            request.studio_start_date = data.studio_start_date;
        }

        // Add mobile game fields if applicable
        if (showMobileFields && data.mobile_show_rate && data.mobile_show_sponsor_ship_duration && data.mobile_start_date) {
            // Convert budget string (with commas) to number
            request.mobile_show_rate = Number(data.mobile_show_rate.replaceAll(',', ''));
            request.mobile_show_sponsor_ship_duration = data.mobile_show_sponsor_ship_duration;
            request.mobile_start_date = data.mobile_start_date;
        }

        // Add allocation type if provided
        if (data.allocation_type) {
            request.allocation_type = data.allocation_type;
        }

        // Add remarks if provided
        if (data.remarks) {
            request.remarks = data.remarks;
        }

        return request;
    };

    return {
        createBlanketOrderMutation,
        transformFormDataToApiRequest,
    };
}
