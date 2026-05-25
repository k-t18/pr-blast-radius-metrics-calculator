import ActionButton from '../../../../../../../components/common/ActionButton';
import { Plus } from '../../../../../../../components/icons';
import SquareRow from './SquareRow';
import SponsorshipSquaresModal from '../modal/SponsorshipSquaresModal';
import useStep1SelectSquares from '../../hooks/useStep1SelectSquares';
import StepHeader from './StepHeader';
import '../../../../../../../styles/mobileSponsorshipStyles/step1SelectSquares.css';
import '../../../../../../../styles/mobileSponsorshipStyles/stepHeader.css';

export default function Step1SelectSquares() {
    const {
        fields,
        squares,
        isModalVisible,
        handleOpenModal,
        handleCloseModal,
        handleAddFromModal,
        handleSquareChange,
        handleOnSave,
        remove,
        // subtotalUnitSales,
        // subtotalRewardValue,
        total,
        isValid,
        isCollapsed,
        handleEdit,
        isStepCompleted,
        squareDataByTypeAndRow,
    } = useStep1SelectSquares();

    const stepStatusClass = isCollapsed ? 'step-inactive' : 'step-active';

    return (
        <div className={`step-container ${stepStatusClass}`}>
            <StepHeader title="Step 1: Select squares and allocate reward amount" isCollapsed={isCollapsed} onEdit={handleEdit} />

            <div className={`step-content ${isCollapsed ? 'step-content-collapsed' : 'step-content-expanded'}`}>
                <div className="squares-section">
                    {fields.length > 0 && (
                        <div className="squares-table-header">
                            <span className="squares-table-header-label">Square Type</span>
                            <span className="squares-table-header-label">Row</span>
                            {/* <span className="squares-table-header-label">Unit Sales Price</span> */}
                            <span className="squares-table-header-label">Reward Value</span>
                            <span className="squares-table-header-label" />
                        </div>
                    )}

                    {fields.map((field, index) => {
                        const currentSquare = squares[index] || field; // Fallback to field if squares[index] is undefined
                        return (
                            <SquareRow
                                key={field.id}
                                square={currentSquare}
                                onRemove={() => remove(index)}
                                onChange={(fieldName, value) => handleSquareChange(index, fieldName, value)}
                            />
                        );
                    })}

                    <ActionButton width="auto" className="add-square-button" onClick={handleOpenModal}>
                        <Plus size={16} />
                        <span>Add a Square Type</span>
                    </ActionButton>
                </div>

                <SponsorshipSquaresModal
                    visible={isModalVisible}
                    onHide={handleCloseModal}
                    onAdd={handleAddFromModal}
                    squareDataByTypeAndRow={squareDataByTypeAndRow}
                />

                {total !== 0 && (
                    <div className="squares-summary">
                        {/* <div className="summary-row">
                            <span className="summary-label">Sub Total</span>
                            <span className="summary-value">₦ {subtotalUnitSales.toLocaleString()}</span>
                            <span className="summary-value">₦ {subtotalRewardValue.toLocaleString()}</span>
                        </div> */}
                        <div className="summary-row total-row">
                            <span className="summary-label">Your Total</span>
                            <span className="summary-spacer" />
                            <span className="summary-total">₦ {total.toLocaleString()}</span>
                        </div>
                    </div>
                )}

                {fields.length > 0 && (!isStepCompleted || !isCollapsed) && (
                    <div className="step-actions">
                        <ActionButton
                            bgColor={isValid ? 'bg-brand-500' : 'bg-gray-300'}
                            textColor="text-white"
                            width="auto"
                            className={`save-continue-button font-ubuntu ${isValid ? '' : 'cursor-not-allowed opacity-50'}`}
                            onClick={handleOnSave}
                            isDisabled={!isValid}
                        >
                            Save & Continue
                        </ActionButton>
                    </div>
                )}
            </div>
        </div>
    );
}
