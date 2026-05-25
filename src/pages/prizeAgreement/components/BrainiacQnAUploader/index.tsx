import { forwardRef, useImperativeHandle } from 'react';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { RadioButton } from '../../../../components/common/RadioButton';
import ActionButton from '../../../../components/common/ActionButton';
import InputField from '../../../../components/form-fields/inputField/InputField';
import { Plus, Trash } from '../../../../components/icons';
import { useBrainiacQnA } from '../../hooks/brainiac/useBrainiacQnA';
import type { SavedQuestion } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';

interface BrainiacQnAUploaderProperties {
    questions: SavedQuestion[];
    onChange: (questions: SavedQuestion[]) => void;
}

export interface BrainiacQnAUploaderReference {
    saveDraft: () => SavedQuestion | null;
}

const BrainiacQnAUploader = forwardRef<BrainiacQnAUploaderReference, BrainiacQnAUploaderProperties>(
    ({ questions: externalQuestions, onChange }, reference) => {
        const {
            questions,
            question,
            options,
            isAdding,
            handleQuestionChange,
            handleOptionTextChange,
            setCorrectOption,
            addOption,
            deleteOption,
            saveQuestion,
            deleteQuestion,
            editQuestion,
            startAdding,
            isFormValid,
        } = useBrainiacQnA(onChange, externalQuestions);

        useImperativeHandle(reference, () => ({
            saveDraft: () => saveQuestion(false),
        }));

        return (
            <div className="w-full max-w-3xl flex flex-col gap-3 text-left py-2">
                <HeaderTitle text="Upload QnA for Brainiac" size="md" weight="medium" color="text-black" />

                {/* List of saved questions */}
                {questions.length > 0 && (
                    <div className="flex flex-col gap-4 mb-2">
                        {questions.map((q, qIndex) => (
                            <div key={q.id} className="p-4 bg-gray-50 rounded-lg flex flex-col gap-1 border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-start gap-4">
                                    <p className="font-medium text-black text-sm">
                                        <span className="text-brand-primary-500 mr-2">Q{qIndex + 1}.</span>
                                        {q.question}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <ActionButton
                                            type="button"
                                            onClick={() => editQuestion(q.id)}
                                            bgColor="bg-transparent"
                                            textColor="text-brand-primary-500 hover:text-brand-primary-600"
                                            width="auto"
                                            className="transition-colors text-sm font-medium px-2 !py-1 border-none shadow-none"
                                            aria-label="Edit question"
                                        >
                                            Edit
                                        </ActionButton>
                                        <ActionButton
                                            type="button"
                                            onClick={() => deleteQuestion(q.id)}
                                            bgColor="bg-transparent"
                                            textColor="text-gray-900 hover:text-red-500"
                                            width="auto"
                                            className="transition-colors !p-0 border-none shadow-none"
                                            aria-label="Delete question"
                                        >
                                            <Trash size={20} />
                                        </ActionButton>
                                    </div>
                                </div>
                                <ul className="flex flex-col gap-1 ml-6 text-sm text-gray-700">
                                    {q.options.map((opt, optIndex) => (
                                        <li key={opt.id} className={opt.isCorrect ? 'text-green-600 font-medium' : ''}>
                                            {String.fromCodePoint(65 + optIndex)}. {opt.text} {opt.isCorrect && '✓'}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {isAdding ? (
                    <div className="flex flex-col gap-3 p-4 border border-gray-100 rounded-lg bg-white shadow-sm">
                        <div className="flex flex-col mt-0">
                            <InputField
                                id="brainiac-question"
                                name="question"
                                value={question}
                                onChange={v => handleQuestionChange(v)}
                                placeholder="Type or paste question here."
                                inputClassName="w-full !border-none !text-sm !shadow-none focus:outline-none focus:ring-0 placeholder:!text-sm font-normal text-black bg-transparent !px-0 !py-1"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            {options.map((option, index) => (
                                <div key={option.id} className="flex items-center gap-3 w-full">
                                    <RadioButton
                                        inputId={`radio-${option.id}`}
                                        name="correct-option"
                                        value={option.id}
                                        checked={option.isCorrect}
                                        onChange={() => setCorrectOption(option.id)}
                                        className="scale-90 ml-0.5"
                                    />
                                    <div className="flex-1">
                                        <InputField
                                            id={`input-${option.id}`}
                                            name={`option-${index}`}
                                            value={option.text}
                                            onChange={v => handleOptionTextChange(option.id, v)}
                                            placeholder="Option"
                                            inputClassName="w-full !border-none !shadow-none focus:outline-none focus:ring-0 !text-sm placeholder:!text-sm text-black bg-transparent !px-0 !py-1"
                                        />
                                    </div>
                                    {options.length > 2 && (
                                        <ActionButton
                                            type="button"
                                            onClick={() => deleteOption(option.id)}
                                            bgColor="bg-transparent"
                                            textColor="text-gray-900 hover:text-red-500"
                                            width="auto"
                                            className="transition-colors !p-2 border-none shadow-none outline-none"
                                            aria-label="Delete option"
                                        >
                                            <Trash size={20} />
                                        </ActionButton>
                                    )}
                                </div>
                            ))}

                            {options.length < 3 && (
                                <div className="mt-1 flex items-center pl-0.5">
                                    <ActionButton
                                        type="button"
                                        onClick={addOption}
                                        bgColor="bg-transparent"
                                        textColor="text-gray-800"
                                        width="auto"
                                        className="flex items-center !gap-2.5 transition-colors !border-none !p-0 outline-none"
                                    >
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-[1.5px] border-gray-400">
                                            <Plus size={12} color="currentColor" />
                                        </div>
                                        <span className="font-normal text-sm">Add Option</span>
                                    </ActionButton>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-2 flex gap-3">
                            <ActionButton
                                onClick={() => saveQuestion(true)}
                                isDisabled={!isFormValid}
                                width="auto"
                                borderRadius="rounded"
                                className="px-4 font-ubuntu w-fit shadow-sm py-0 text-sm font-normal border-none"
                            >
                                Save Question
                            </ActionButton>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2">
                        <ActionButton
                            onClick={startAdding}
                            width="auto"
                            borderRadius="rounded"
                            className="px-4 font-ubuntu w-fit shadow-sm py-0 text-sm font-normal border-none"
                        >
                            <span className="text-lg leading-none font-light mr-0">+</span> Add Question
                        </ActionButton>
                    </div>
                )}
            </div>
        );
    }
);

export default BrainiacQnAUploader;
