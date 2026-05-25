import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getDocumentSize } from '../services/general/getDocumentSize.api';

export interface DocumentSizeResponse {
    Image: number;
    Video: number;
    [key: string]: number;
}

interface DocumentSizeState {
    documentSizes: DocumentSizeResponse | null;
    isLoading: boolean;
    error: string | null;
    fetchDocumentSizes: () => Promise<void>;
    clearDocumentSizes: () => void;
    getSizeForType: (type: 'Image' | 'Video' | string) => number | undefined; // Returns size in MB, or undefined if not found
}

const STORAGE_KEY = 'document-sizes';

export const useDocumentSizeData = create<DocumentSizeState>()(
    persist(
        (set, get) => ({
            documentSizes: null,
            isLoading: false,
            error: null,

            /**
             * Fetches document sizes from the API
             * Only fetches if data is not already cached
             */
            fetchDocumentSizes: async () => {
                // If data already exists, don't fetch again
                if (get().documentSizes) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await getDocumentSize();

                    if (response.status === 'success' && response.data && Array.isArray(response.data)) {
                        // Transform the array response into an object
                        // Response: [{ Image: 5.0 }, { Video: 10.0 }]
                        // Transform to: { Image: 5.0, Video: 10.0 }
                        const sizes: DocumentSizeResponse = {} as DocumentSizeResponse;
                        response.data.forEach(item => {
                            Object.keys(item).forEach(key => {
                                if (item[key] !== undefined) {
                                    sizes[key] = item[key] as number;
                                }
                            });
                        });

                        set({
                            documentSizes: sizes,
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: response.message || 'Failed to fetch document sizes',
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
             * Clears the document sizes from the store and localStorage
             * This will trigger a new fetch on next initialization
             */
            clearDocumentSizes: () => {
                set({
                    documentSizes: null,
                    isLoading: false,
                    error: null,
                });
            },

            /**
             * Gets the file size limit for a specific document type
             * @param type - The document type ('Image', 'Video', etc.)
             * @returns The file size limit in MB, or undefined if not found
             */
            getSizeForType: (type: 'Image' | 'Video' | string): number | undefined => {
                const sizes = get().documentSizes;
                if (sizes && sizes[type] !== undefined) {
                    return sizes[type];
                }
                return undefined;
            },
        }),
        {
            name: STORAGE_KEY, // localStorage key
            partialize: state => ({
                // Only persist the sizes data, not loading/error states
                documentSizes: state.documentSizes,
            }),
        }
    )
);
