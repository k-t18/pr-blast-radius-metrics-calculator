import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SponsorPortalSettings } from '../interfaces/common/sponsorPortalSettings.types';
import { getSponsorPortalSettings } from '../services/general/getSponsorPortalSettings.api';

interface SponsorPortalSettingsState {
    sponsorPortalSettings: SponsorPortalSettings | null;
    isLoading: boolean;
    error: string | null;
    fetchSponsorPortalSettings: () => Promise<void>;
    clearSponsorPortalSettings: () => void;
}

const STORAGE_KEY = 'sponsor-portal-settings';

export const useSponsorPortalSettingsData = create<SponsorPortalSettingsState>()(
    persist(
        (set, get) => ({
            sponsorPortalSettings: null,
            isLoading: false,
            error: null,

            /**
             * Fetches sponsor portal settings from the API
             * Only fetches if data is not already cached
             */
            fetchSponsorPortalSettings: async () => {
                // If data already exists, don't fetch again
                if (get().sponsorPortalSettings) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await getSponsorPortalSettings();

                    if (response.status === 'success' && response.data) {
                        set({
                            sponsorPortalSettings: response.data,
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: response.message || 'Failed to fetch sponsor portal settings',
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
             * Clears the sponsor portal settings from the store and localStorage
             * This will trigger a new fetch on next initialization
             */
            clearSponsorPortalSettings: () => {
                set({
                    sponsorPortalSettings: null,
                    isLoading: false,
                    error: null,
                });
            },
        }),
        {
            name: STORAGE_KEY, // localStorage key
            partialize: state => ({
                // Only persist the settings data, not loading/error states
                sponsorPortalSettings: state.sponsorPortalSettings,
            }),
        }
    )
);
