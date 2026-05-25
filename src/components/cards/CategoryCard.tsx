import IconBadge from '../common/IconBadge';
import HeaderTitle from '../common/HeaderTitle';
import { CurrencySymbol } from '../common/CurrencySymbol';
import { Check } from '../icons';
import DescriptionText from '../common/DescriptionText';
import ActionButton from '../common/ActionButton';
import LinkButton from '../common/LinkButton';
import { getStudioShowCategoryMetadata } from '../../utils/studioShowCategoryMetadata';

export interface CategoryCardProperties {
    title: string;
    price: string | number;
    tag: string;
    type: string;
    description: string;
    showAddToCartButton: boolean;
    isAddedToCart?: boolean;
    onAddToCart?: () => void;
    viewDetailsLabel?: string;
    viewDetailsLink?: string;
    episodeName?: string;
}

function CategoryCard({
    title,
    price,
    tag,
    type,
    description,
    showAddToCartButton,
    isAddedToCart = false,
    onAddToCart,
    episodeName,
    viewDetailsLabel,
    viewDetailsLink,
}: CategoryCardProperties) {
    const metadata = getStudioShowCategoryMetadata({ title, type, status: tag, episodeName });
    const detailsLabel = viewDetailsLabel ?? metadata.detailsLabel;
    const detailsLink = viewDetailsLink ?? metadata.detailsLink;
    const { icon } = metadata;
    const { iconBgColor } = metadata;
    const cardTitle = type === 'square' ? 'Square' : title;
    const isAvailbale = tag.toLowerCase() === 'available';

    return (
        <div className="relative border border-border-gray-600 rounded-lg p-4 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
                {/* Header with badge */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <IconBadge icon={icon} size="sm" shape="square" bgColor={iconBgColor} />
                        <HeaderTitle text={cardTitle} size="md" weight="medium" />
                    </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-1">
                    <CurrencySymbol symbol="₦" className="text-tertiary-text text-xs" />
                    <DescriptionText text={price.toString()} color="#636363" size="xs" weight="normal" />
                </div>
                <div className="flex items-center gap-1">
                    <DescriptionText text="#" />
                    <DescriptionText text={tag} color="#636363" size="xs" weight="normal" />
                </div>

                {/* Description */}
                <DescriptionText text={description} color="text-primary-text" size="xs" />
            </div>

            {/* Action Buttons */}
            {(showAddToCartButton || (detailsLabel && detailsLink)) && (
                <div className="flex justify-between items-center gap-2.5">
                    {showAddToCartButton && isAvailbale && (
                        <ActionButton
                            onClick={isAddedToCart ? undefined : onAddToCart}
                            isDisabled={false}
                            borderColor={isAddedToCart ? 'border-transparent' : 'border-border-gray-600'}
                            textColor={isAddedToCart ? 'text-brand-primary-800' : 'text-primary-text'}
                            bgColor="bg-transparent"
                            borderRadius="rounded-lg"
                            width="full"
                            align="center"
                            className={`text-sm py-2 border flex gap-2 items-center ${isAddedToCart ? 'pointer-events-none' : ''}`}
                        >
                            {isAddedToCart ? (
                                <>
                                    <Check />
                                    Added to Cart
                                </>
                            ) : (
                                'Add to Cart'
                            )}
                        </ActionButton>
                    )}

                    {detailsLabel && detailsLink && (
                        <LinkButton to={detailsLink} width="full">
                            {detailsLabel}
                        </LinkButton>
                    )}
                </div>
            )}
        </div>
    );
}

export default CategoryCard;
