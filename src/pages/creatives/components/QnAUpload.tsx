import type { RadioButtonChangeEvent } from 'primereact/radiobutton';
import HeaderTitle from '../../../components/common/HeaderTitle';
import ActionButton from '../../../components/common/ActionButton';
import { CustomDropdown } from '../../../components/common/Dropdown';
import { RadioButton } from '../../../components/common/RadioButton';
import { Plus } from '../../../components/icons';
import type { QnAUploadProperties } from '../../../interfaces/creatives/creatives.types';
import { useQnAUpload } from '../../../hooks/creatives/useQnAUpload';
import { TextAreaField } from '../../../components/form-fields/textAreaField';

function QnAUpload({ episodeTitle, onQuestionsChange }: QnAUploadProperties) {
    const {
        questions,
        handleAddQuestion,
        handleQuestionChange,
        handleAddOption,
        handleOptionChange,
        setCorrectOption,
        handleCorrectOptionChange,
        getCorrectOptionDropdownOptions,
        getDropdownValue,
    } = useQnAUpload({ onQuestionsChange });

    return (
        <div>
            <HeaderTitle text={`Upload QnA for ${episodeTitle}`} size="md" weight="medium" disabled={false} className="leading-6 mb-4 font-poppins" />

            {/* Questions List */}
            <div className="px-4">
                {questions.map(question => (
                    <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                        {/* Question Input */}
                        <div className="mb-1">
                            <TextAreaField
                                id={`question-${question.id}`}
                                name={`question-${question.id}`}
                                value={question.questionText}
                                onChange={value => handleQuestionChange(question.id, value)}
                                placeholder="Type or paste question here."
                                className=""
                                textAreaClassName="w-full px-1 h-[22px] text-sm text-black font-medium leading-[22px] rounded placeholder:text-gray-750 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none"
                                style={{ resize: 'none' }}
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                            {question.options.map(option => {
                                // Check if this option is the correct one (matches correctOptionId)
                                const isChecked = question.correctOptionId === option.id;
                                return (
                                    <div key={`${option.id}-${question.correctOptionId || 'none'}`} className="flex items-start gap-3">
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className="mt-1.5">
                                                <RadioButton
                                                    key={`radio-${question.id}-${option.id}-${question.correctOptionId || 'none'}`}
                                                    inputId={`qna-option-${question.id}-${option.id}`}
                                                    name={`qna-option-${question.id}`}
                                                    value={option.id}
                                                    checked={isChecked}
                                                    onChange={(event: RadioButtonChangeEvent) => {
                                                        if (event.value === option.id) {
                                                            setCorrectOption(question.id, option.id);
                                                        }
                                                    }}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                            <TextAreaField
                                                id={`option-${question.id}-${option.id}`}
                                                name={`option-${question.id}-${option.id}`}
                                                value={option.text}
                                                onChange={value => handleOptionChange(question.id, option.id, value)}
                                                placeholder="Option"
                                                className="mt-[5px]"
                                                textAreaClassName="h-[20px] max-w-[500px] px-1 text-xs text-black font-normal leading-5 rounded placeholder:text-gray-750 focus:border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-600 resize-none"
                                                style={{ resize: 'none' }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Add Option Button */}
                        <div className="mt-2">
                            <ActionButton
                                width="min-w-[90px]"
                                bgColor="bg-white"
                                textColor="gray-800"
                                borderRadius="rounded"
                                className="creatives-add-option-btn"
                                onClick={() => handleAddOption(question.id)}
                            >
                                <div className="flex justify-center gap-2 font-normal text-xs leading-5 text-gray-800">
                                    <span className="self-center p-[1px] border border-gray-800 rounded-full">
                                        <Plus size={14} />
                                    </span>
                                    <span>Add Option</span>
                                </div>
                            </ActionButton>
                        </div>

                        {/* Select Correct Option Dropdown */}
                        <div className="mt-2">
                            <CustomDropdown
                                // @ts-expect-error - value expects DropdownOption but we're passing the value property
                                value={getDropdownValue(question)?.value}
                                options={getCorrectOptionDropdownOptions(question)}
                                onChange={option => handleCorrectOptionChange(question.id, option)}
                                placeholder="Select Correct Option"
                                width="173px"
                                dropDownClass="blanket-dropdown rounded  w-full text-xs font-normal leading-5"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Question Button */}
            <div className="mt-4">
                <ActionButton
                    width="min-w-[120px]"
                    bgColor="bg-white"
                    textColor="text-charcoal"
                    borderColor="border-gray-600"
                    borderRadius="rounded"
                    className="p-[4px]"
                    onClick={handleAddQuestion}
                >
                    <div className="flex justify-center gap-3 font-normal text-xs leading-5 text-text-charcoal">
                        <span className="self-center">
                            <Plus size={16} color="text-charcoal" />
                        </span>
                        <span className="font-ubuntu">Add Question</span>
                    </div>
                </ActionButton>
            </div>
        </div>
    );
}

export default QnAUpload;
