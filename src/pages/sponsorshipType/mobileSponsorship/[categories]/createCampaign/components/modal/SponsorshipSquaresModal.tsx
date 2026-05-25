/**
 * Sponsorship Squares Modal Component
 *
 * Modal for configuring squares for sponsorship with:
 * - Square type selection (Vantage, Chance, Gift, Brainiac, Standard, Pit)
 * - Row selection (1-10)
 * - Display fields for available squares, unit price, and minimum reward
 * - Number input for quantity of squares to sponsor
 */

import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import ModalWrapper from '../../../../../../../components/common/ModalWrapper';
import type { DropdownOption } from '../../../../../../../components/common/Dropdown';
import ActionButton from '../../../../../../../components/common/ActionButton';
import QuantityInputIncreaseDecrese from './QuantityInputIncreaseDecrese';
import type { SquareDataByTypeAndRow } from '../../context/createCampaignContext';
import { useSponsorshipSquaresModal, type SquareTypeOption } from '../../hooks/useSponsorshipSquaresModal';
import '../../../../../../../styles/inputField.css';
import '../../../../../../../styles/dropdown.css';
import '../../../../../../../styles/mobileSponsorshipStyles/sponsorshipSquaresModal.css';

interface SponsorshipSquaresModalProperties {
    visible: boolean;
    onHide: () => void;
    onAdd?: (data: { squareType: string; row: number; quantity: number; unitPrice?: string; minReward?: string }) => void;
    squareDataByTypeAndRow: SquareDataByTypeAndRow;
}

export default function SponsorshipSquaresModal({ visible, onHide, onAdd, squareDataByTypeAndRow }: SponsorshipSquaresModalProperties) {
    const {
        selectedSquareType,
        setSelectedSquareType,
        selectedRow,
        setSelectedRow,
        quantity,
        setQuantity,
        squareTypeOptions,
        rowOptions,
        availableSquares,
        minReward,
        isLoadingSquareTypeModalData,
        handleIncrement,
        handleDecrement,
        handleAdd,
        squareTypeOptionTemplate,
        squareTypeValueTemplate,
    } = useSponsorshipSquaresModal({
        visible,
        squareDataByTypeAndRow,
        onAdd,
        onHide,
    });

    return (
        <ModalWrapper visible={visible} onHide={onHide} showCloseButton title="" titleSize="lg" titleWeight="medium" modalSize="sm">
            <div className="sponsor-modal-content flex flex-col gap-6 mt-9">
                {/* Top Section: Three Columns */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Select Square Type */}
                    <div className="input-field-container dropdown-container sponsor-dropdown-wrapper">
                        <div className="input-field-label">Select Square Type</div>
                        <Dropdown
                            value={selectedSquareType}
                            onChange={(event: DropdownChangeEvent) => setSelectedSquareType(event.value as SquareTypeOption)}
                            options={squareTypeOptions}
                            optionLabel="label"
                            placeholder="Square Type"
                            itemTemplate={squareTypeOptionTemplate}
                            valueTemplate={squareTypeValueTemplate}
                            className="dropdown-field sponsor-dropdown"
                            panelClassName="dropdown-panel"
                            aria-label="Select Square Type"
                        />
                    </div>

                    {/* Select Row */}
                    <div className="input-field-container dropdown-container sponsor-dropdown-wrapper">
                        <div className="input-field-label">Select Row</div>
                        <Dropdown
                            value={selectedRow}
                            onChange={(event: DropdownChangeEvent) => setSelectedRow(event.value as DropdownOption)}
                            options={rowOptions}
                            optionLabel="label"
                            placeholder="Row"
                            className="dropdown-field sponsor-dropdown"
                            panelClassName="dropdown-panel"
                            aria-label="Select Row"
                            disabled={!selectedSquareType}
                        />
                    </div>

                    {/* No of Squares available */}
                    <div className="flex flex-col gap-2">
                        <div className="input-field-label">No of Squares available</div>
                        <h4 className="text-base text-primary-text">
                            {(() => {
                                if (isLoadingSquareTypeModalData) {
                                    return 'Loading...';
                                }
                                if (typeof availableSquares === 'number') {
                                    return availableSquares.toLocaleString();
                                }
                                return availableSquares;
                            })()}
                        </h4>
                    </div>
                </div>

                {/* Unit Selling Price and Minimum Reward Value */}
                <div className="grid grid-cols-2 gap-4">
                    {/* <div className="flex flex-col gap-2">
                        <div className="input-field-label">Unit Selling Price of each square</div>
                        <h4 className="text-base text-primary-text">{unitPrice === '-' ? unitPrice : `₦ ${unitPrice}`}</h4>
                    </div> */}

                    <div className="flex flex-col gap-2">
                        <div className="input-field-label">Minimum Reward Value of each Sqaure</div>
                        <h4 className="text-base text-primary-text">
                            {(() => {
                                if (isLoadingSquareTypeModalData) {
                                    return 'Loading...';
                                }
                                if (minReward === '-') {
                                    return minReward;
                                }
                                if (typeof minReward === 'number') {
                                    return `₦ ${minReward.toLocaleString()}`;
                                }
                                return `₦ ${minReward}`;
                            })()}
                        </h4>
                    </div>
                </div>

                {/* How many Squares would you like to Sponsor? */}
                <QuantityInputIncreaseDecrese
                    value={quantity}
                    onChange={value => setQuantity(String(value))}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    label="How many Squares would you like to Sponsor?"
                    maxValue={typeof availableSquares === 'number' ? availableSquares : undefined}
                />

                {/* Add Button */}
                <div className="flex justify-start mt-2">
                    <ActionButton
                        type="button"
                        onClick={handleAdd}
                        isDisabled={
                            !selectedSquareType || !selectedRow || !quantity || Number.parseInt(quantity, 10) < 1 || isLoadingSquareTypeModalData
                        }
                        className="add-button font-ubuntu"
                    >
                        Add
                    </ActionButton>
                </div>
            </div>
        </ModalWrapper>
    );
}
