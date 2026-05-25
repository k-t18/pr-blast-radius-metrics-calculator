import { useMutation } from '@tanstack/react-query';
import { postMobileGameCampaignData, type CampaignDataRequest } from '../../services/sponsor_api/postMobileGameCampaignData.api';

/**
 * Custom hook to submit mobile game campaign data
 * Uses TanStack Query mutation for handling the submission
 *
 * @returns Object containing mutation function, loading state, error, and success state
 */
export const useSubmitMobileGameCampaignData = () => {
    const mutation = useMutation({
        mutationFn: (quotationData: CampaignDataRequest) => postMobileGameCampaignData(quotationData),
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('Campaign data submitted successfully', data);
        },
        onError: error_ => {
            /* eslint-disable no-console */
            console.error('Error submitting campaign data', error_);
        },
    });

    return {
        submitCampaignData: mutation.mutate,
        submitCampaignDataAsync: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
        data: mutation.data,
    };
};

export default useSubmitMobileGameCampaignData;
