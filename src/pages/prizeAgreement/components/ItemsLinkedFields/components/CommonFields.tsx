import { RadioButtonGroup } from '../../../../../components/common/RadioButton';
import { UNCLAIMED_PRIZES_OPTIONS, DISBURSEMENT_OPTIONS } from '../../../config/constants';

interface CommonFieldsProperties {
    itemId: string;
    unclaimedPrizesHandling: string;
    disbursementOwnership: string;
    collectionInstructions: string;
    onUnclaimedChange: (value: string) => void;
    onOwnershipChange: (value: string) => void;
    onInstructionsChange: (value: string) => void;
}

function CommonFields({
    itemId,
    unclaimedPrizesHandling,
    disbursementOwnership,
    collectionInstructions,
    onUnclaimedChange,
    onOwnershipChange,
    onInstructionsChange,
}: CommonFieldsProperties) {
    return (
        <>
            {/* Unclaimed Prizes */}
            <fieldset className="flex flex-col gap-3 border-0 p-0">
                <legend className="text-base font-medium text-black mb-[9px]">
                    How should unclaimed prizes be handled?<span className="text-red-600">*</span>
                </legend>
                <RadioButtonGroup
                    name="unclaimedPrizesHandling"
                    value={unclaimedPrizesHandling}
                    onChange={v => onUnclaimedChange(String(v))}
                    options={UNCLAIMED_PRIZES_OPTIONS}
                    layout="vertical"
                />
            </fieldset>

            {/* Disbursement Ownership */}
            <fieldset className="flex flex-col gap-2 border-0 p-0">
                <legend className="text-base font-medium text-black mb-[9px]">
                    Disbursement Ownership<span className="text-red-600">*</span>
                </legend>
                <RadioButtonGroup
                    name="disbursementOwnership"
                    value={disbursementOwnership}
                    onChange={v => onOwnershipChange(String(v))}
                    options={DISBURSEMENT_OPTIONS}
                    layout="horizontal"
                />
            </fieldset>

            {/* Collection Instructions */}
            <div className="flex flex-col gap-2">
                <div className="text-base font-medium text-black">
                    Collection Instructions<span className="text-red-600">*</span>
                </div>
                <label htmlFor={`collectionInstructions-${itemId}`}>
                    <textarea
                        id={`collectionInstructions-${itemId}`}
                        name={`collectionInstructions-${itemId}`}
                        aria-label="Collection Instructions"
                        value={collectionInstructions}
                        onChange={event => onInstructionsChange(event.target.value)}
                        className="w-full px-3 py-2 border rounded-md min-h-20"
                        placeholder="How will the winner collect the reward?"
                    />
                </label>
            </div>
        </>
    );
}

export default CommonFields;
