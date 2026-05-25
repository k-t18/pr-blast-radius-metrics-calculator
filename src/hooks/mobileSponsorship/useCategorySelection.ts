import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { CategoryItem } from '../../pages/sponsorshipType/mobileSponsorship/[categories]/createCampaign/utils/mobileSponsorshipCategoryUtils';

interface UseCategorySelectionParameters {
    categoriesData: CategoryItem[];
}

interface UseCategorySelectionReturn {
    categories: string[];
    handleSelectCategory: (id: string, title: string) => void;
    handleCreateCampaign: () => void;
}

/**
 * Custom hook for managing category selection in mobile sponsorship components
 * Handles multiple category selection, URL parameter updates, and navigation
 *
 * @param categoriesData - Array of category items
 * @returns Object containing categories state and handlers
 */
export function useCategorySelection({ categoriesData }: UseCategorySelectionParameters): UseCategorySelectionReturn {
    const navigate = useNavigate();
    const { categories: categoriesParameter } = useParams<{ categories: string }>();
    const [searchParameters, setSearchParameters] = useSearchParams();
    const [categories, setCategories] = useState<string[]>([]);

    const handleSelectCategory = (_id: string, title: string) => {
        // Allow multiple selection
        const newCategories = categories.includes(title) ? categories.filter(cat => cat !== title) : [...categories, title];
        setCategories(newCategories);

        // Update URL with selected category IDs only (item_code will be set when active category changes via sidebar)
        const selectedIds = newCategories
            .map(categoryTitle => categoriesData.find(item => item.title === categoryTitle)?.id)
            .filter((categoryId): categoryId is string => categoryId !== undefined);

        if (selectedIds.length > 0) {
            // Set first selected category as active item_code initially
            const firstSelectedTitle = newCategories[0];
            setSearchParameters({
                categories: selectedIds.join(','),
                item_code: firstSelectedTitle,
            });
        } else {
            setSearchParameters({});
        }
    };

    const handleCreateCampaign = () => {
        // Preserve query parameters when navigating
        const queryString = searchParameters.toString();
        const url = queryString
            ? `/sponsorship-type/mobile-sponsorship/${categoriesParameter}/create-campaign?${queryString}`
            : `/sponsorship-type/mobile-sponsorship/${categoriesParameter}/create-campaign`;
        navigate(url);
    };

    return {
        categories,
        handleSelectCategory,
        handleCreateCampaign,
    };
}
