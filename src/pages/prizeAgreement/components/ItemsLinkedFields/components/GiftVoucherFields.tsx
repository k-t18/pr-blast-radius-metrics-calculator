import InputField from '../../../../../components/form-fields/inputField/InputField';
import { formatCurrency } from '../../../../../utils/formatCurrency';

interface GiftVoucherFieldsProperties {
    itemId: string;
    quantity: number;
    unitRetailPrice: number;
    totalRewardValue: number;
    difference: number;
    onQuantityChange: (value: number) => void;
    onPriceChange: (value: number) => void;
    minQuantity?: number;
    minUnitRetailPrice?: number;
}

function GiftVoucherFields({
    itemId,
    quantity,
    unitRetailPrice,
    totalRewardValue,
    difference,
    onQuantityChange,
    onPriceChange,
    minQuantity = 0,
    minUnitRetailPrice = 0,
}: GiftVoucherFieldsProperties) {
    const handleQuantityChange = (value: string | number) => {
        const numberValue = Number(value) || 0;
        onQuantityChange(numberValue);
    };

    const handlePriceChange = (value: string | number) => {
        const numberValue = Number(value) || 0;
        onPriceChange(numberValue);
    };

    const handleQuantityBlur = () => {
        if (minQuantity > 0 && quantity < minQuantity) {
            onQuantityChange(minQuantity);
        }
    };

    const handlePriceBlur = () => {
        if (minUnitRetailPrice > 0 && unitRetailPrice < minUnitRetailPrice) {
            onPriceChange(minUnitRetailPrice);
        }
    };

    const isQuantityInvalid = minQuantity > 0 && quantity < minQuantity;
    const isPriceInvalid = minUnitRetailPrice > 0 && unitRetailPrice < minUnitRetailPrice;

    return (
        <div className="grid grid-cols-6 gap-4">
            <div className="flex flex-col gap-1">
                <InputField
                    id={`qty-${itemId}`}
                    name={`qty-${itemId}`}
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    inputClassName="max-w-[173px]"
                    min={minQuantity}
                    required
                />
                {isQuantityInvalid && <span className="text-xs text-red-600">Quantity must be {minQuantity} or more.</span>}
            </div>
            <div className="flex flex-col gap-1">
                <InputField
                    id={`price-${itemId}`}
                    name={`price-${itemId}`}
                    type="number"
                    label="Unit Retail Price"
                    value={unitRetailPrice}
                    onChange={handlePriceChange}
                    onBlur={handlePriceBlur}
                    prefix="₦"
                    inputClassName="max-w-[173px]"
                    min={minUnitRetailPrice}
                    required
                />
                {isPriceInvalid && (
                    <span className="text-xs text-red-600">Unit Retail Price must be ₦ {formatCurrency(minUnitRetailPrice)} or more.</span>
                )}
            </div>
            <div className="flex flex-col gap-2">
                <div className="text-sm font-medium text-gray-700">Total Reward Value</div>
                <div className="text-lg font-semibold py-2">₦ {formatCurrency(totalRewardValue)}</div>
                {difference > 0 && totalRewardValue > 0 && (
                    <span className="text-xs text-red-600">₦ {formatCurrency(difference)} short. Please match the total reward value.</span>
                )}
            </div>
        </div>
    );
}

export default GiftVoucherFields;
