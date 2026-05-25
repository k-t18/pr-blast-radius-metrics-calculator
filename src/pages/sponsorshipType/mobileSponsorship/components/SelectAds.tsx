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

interface SelectAdsProperties {
    categoriesData: CategoryItem[];
}

export default function SelectAds({ categoriesData }: SelectAdsProperties) {
    const { categories, handleSelectCategory, handleCreateCampaign } = useCategorySelection({ categoriesData });

    const normalCategories = categoriesData.filter(item => !item.isMain);

    return (
        <div>
            <div className="flex flex-col gap-6 px-6">
                <BackButton />
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Categories" size="2xl" weight="medium" disabled={false} />
                    <DescriptionText text="Select at least one category." color="text-secondary-text" size="sm" weight="medium" />
                </div>

                {/* Select Ad Category section */}
                <div className="flex flex-col gap-2">
                    <HeaderTitle text="Select Ad Category (min 1)" size="lg" weight="medium" disabled={false} />
                </div>

                {/* Normal categories: 3-column grid */}
                {normalCategories.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {normalCategories.map(item => (
                            <CategoryCard
                                key={item.id}
                                title={item.title || ''}
                                price={item.price || ''}
                                base_cpc_cpm={item.base_cpc_cpm || ''}
                                tag={item.tag}
                                description={item.description || ''}
                                icon={item.icon}
                                iconBgColor={item.iconBgColor}
                                isSelected={categories.includes(item.title || '')}
                                onClick={() => handleSelectCategory(item.id || '', item.title || '')}
                            />
                        ))}
                    </div>
                )}

                {categories.length > 0 && (
                    <FloatingContainer
                        className="flex justify-end border-0! px-0! pb-2! pt-3.5! shadow-none!"
                        borderRadius="0"
                        bottom="-24px"
                        zIndex={2}
                    >
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
        </div>
    );
}
