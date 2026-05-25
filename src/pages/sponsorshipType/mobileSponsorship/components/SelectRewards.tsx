/**
 * Sponsorship Studio Show Categories Page
 *
 * Displays categories for a specific episode under sponsorship type.
 */
import BackButton from '../../../../components/common/BackButton';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import DescriptionText from '../../../../components/common/DescriptionText';
import CategoryCard from './CategoryCard';
import type { CategoryItem } from '../[categories]/createCampaign/utils/mobileSponsorshipCategoryUtils';
import FloatingContainer from '../../../../components/common/FloatingContainer';
import ActionButton from '../../../../components/common/ActionButton';
import { useCategorySelection } from '../../../../hooks/mobileSponsorship/useCategorySelection';

interface SelectRewardsProperties {
    categoriesData: CategoryItem[];
}

export default function SelectRewards({ categoriesData }: SelectRewardsProperties) {
    const { categories, handleSelectCategory, handleCreateCampaign } = useCategorySelection({ categoriesData });

    const mainCategories = categoriesData.filter(item => item.isMain);

    return (
        <div className="flex flex-col gap-6 px-6">
            <BackButton />
            <div className="flex flex-col gap-2">
                <HeaderTitle text="Select Categories" size="2xl" weight="medium" disabled={false} />
                <DescriptionText text="Select at least one category." color="text-secondary-text" size="sm" weight="medium" />
            </div>

            {/* Select Reward Category section */}
            <div className="flex flex-col gap-2">
                <HeaderTitle text="Select Reward Category (min 1)" size="lg" weight="medium" disabled={false} />
            </div>

            {/* Main categories: 2-column grid */}
            {mainCategories.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {mainCategories.map(item => (
                        <CategoryCard
                            key={item.id}
                            title={item.title || ''}
                            price={item.price || ''}
                            base_cpc_cpm={item.base_cpc_cpm || ''}
                            tag={item.tag}
                            description={item.description || ''}
                            icon={item.icon}
                            tagIcon={item.tagIcon}
                            iconBgColor={item.iconBgColor}
                            isSelected={categories.includes(item.title || '')}
                            onClick={() => handleSelectCategory(item.id || '', item.title || '')}
                        />
                    ))}
                </div>
            )}

            {categories.length > 0 && (
                <FloatingContainer className="flex justify-end border-0! px-0! pb-2! pt-3.5! shadow-none!" borderRadius="0" bottom="-24px" zIndex={2}>
                    <ActionButton
                        bgColor="bg-brand-primary-500"
                        textColor="text-white"
                        width="auto"
                        onClick={handleCreateCampaign}
                        className="py-2! px-7 border flex gap-2 items-center rounded-lg"
                    >
                        Create Campaign
                    </ActionButton>
                </FloatingContainer>
            )}
        </div>
    );
}
