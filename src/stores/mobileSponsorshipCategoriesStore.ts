/* eslint-disable import/no-extraneous-dependencies */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MobileGameSponsorshipItemsResponse } from '../services/sponsor_api/getMobileGameSponsorshipCategories.api';
import {
    transformApiItemToCategoryItem,
    type CategoryItem,
} from '../pages/sponsorshipType/mobileSponsorship/[categories]/createCampaign/utils/mobileSponsorshipCategoryUtils';

interface MobileSponsorshipCategoriesState {
    sponsorshipItemsData: MobileGameSponsorshipItemsResponse | undefined;
    isLoading: boolean;
    categoriesParameter: string | undefined;
    setSponsorshipItemsData: (data: MobileGameSponsorshipItemsResponse | undefined, parameter: string | undefined) => void;
    setLoading: (loading: boolean) => void;
    clearCategoriesData: () => void;
}

export const useMobileSponsorshipCategoriesStore = create<MobileSponsorshipCategoriesState>()(
    persist(
        set => ({
            sponsorshipItemsData: undefined,
            isLoading: false,
            categoriesParameter: undefined,
            setSponsorshipItemsData: (data, parameter) =>
                set({
                    sponsorshipItemsData: data,
                    categoriesParameter: parameter,
                    isLoading: false,
                }),
            setLoading: loading => set({ isLoading: loading }),
            clearCategoriesData: () =>
                set({
                    sponsorshipItemsData: undefined,
                    categoriesParameter: undefined,
                    isLoading: false,
                }),
        }),
        {
            name: 'mobile-sponsorship-categories-storage', // unique name for localStorage key
            partialize: state => ({
                // Persist raw API data (fully serializable)
                sponsorshipItemsData: state.sponsorshipItemsData,
                categoriesParameter: state.categoriesParameter,
            }),
        }
    )
);

// Selector to get transformed categoriesData - maintains same API as before
export const useCategoriesData = (): CategoryItem[] => {
    const sponsorshipItemsData = useMobileSponsorshipCategoriesStore(state => state.sponsorshipItemsData);
    if (!sponsorshipItemsData?.items) {
        return [];
    }
    return sponsorshipItemsData.items.map(item => transformApiItemToCategoryItem(item));
};
