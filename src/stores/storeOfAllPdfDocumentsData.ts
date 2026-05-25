import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TermsAndConditionList } from '../interfaces/common/termsAndCondition.types';
import { getTermsAndCondition } from '../services/general/getPdfData.api';

interface PdfDocumentsDataState {
    termsAndConditionData: TermsAndConditionList | null;
    isLoading: boolean;
    error: string | null;
    fetchTermsAndConditionData: () => Promise<void>;
    clearTermsAndConditionData: () => void;
}

const STORAGE_KEY = 'pdf-documents-data';

export const usePdfDocumentsData = create<PdfDocumentsDataState>()(
    persist(
        set => ({
            termsAndConditionData: null,
            isLoading: false,
            error: null,

            /**
             * Fetches terms and condition data from the API
             * Only fetches if data is not already cached
             */
            fetchTermsAndConditionData: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await getTermsAndCondition();

                    if (response.status === 'success' && response.data) {
                        set({
                            termsAndConditionData: response.data,
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: response.message || 'Failed to fetch terms and condition data',
                        });
                    }
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'An unexpected error occurred',
                    });
                }
            },

            /**
             * Clears the terms and condition data from the store and localStorage
             * This will trigger a new fetch on next initialization
             */
            clearTermsAndConditionData: () => {
                set({
                    termsAndConditionData: null,
                    isLoading: false,
                    error: null,
                });
            },
        }),
        {
            name: STORAGE_KEY, // localStorage key
            partialize: state => ({
                // Only persist the data, not loading/error states
                termsAndConditionData: state.termsAndConditionData,
            }),
        }
    )
);
