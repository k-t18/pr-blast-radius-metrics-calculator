import { useApiMutation } from '../../../hooks/useApiMutation';
import { postSubmitForm } from '../../../services/registration/postSubmitForm.api';
import type { SponsorRegistrationFormData } from '../context/sponsorRegistrationContext';

interface UseSubmitRegistrationFormOptions {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
}

const useSubmitRegistrationForm = (options?: UseSubmitRegistrationFormOptions) => {
    const mutation = useApiMutation({
        mutationFn: (payload: SponsorRegistrationFormData) => postSubmitForm(payload),
        onSuccess: data => {
            /* eslint-disable no-console */
            console.log('✅ Sponsor registration created successfully:', data);
            options?.onSuccess?.();
        },
        onError: error => {
            /* eslint-disable no-console */
            console.error('❌ Failed to create sponsor registration:', error);
            options?.onError?.(error);
        },
    });

    return {
        mutation,
    };
};

export default useSubmitRegistrationForm;
