import { useEffect, useState } from 'react';
import type { DropdownOption } from '../../components/common/Dropdown';
import type { Question, UseQnAUploadProperties } from '../../interfaces/creatives/creatives.types';

export function useQnAUpload({ onQuestionsChange }: UseQnAUploadProperties = {}) {
    // const onQuestionsChangeRef = useRef(onQuestionsChange);
    // useEffect(() => {
    //     onQuestionsChangeRef.current = onQuestionsChange;
    // }, [onQuestionsChange]);
    const [questions, setQuestions] = useState<Question[]>([
        {
            id: `question-${Date.now()}`,
            questionText: '',
            options: [{ id: `option-${Date.now()}-1`, text: '' }],
            correctOptionId: '',
        },
    ]);

    const handleAddQuestion = () => {
        setQuestions(previous => {
            const newQuestion: Question = {
                id: `question-${Date.now()}`,
                questionText: '',
                options: [{ id: `option-${Date.now()}-1`, text: '' }],
                correctOptionId: '',
            };
            return [...previous, newQuestion];
        });
    };

    const handleQuestionChange = (questionId: string, text: string) => {
        setQuestions(previous => previous.map(q => (q.id === questionId ? { ...q, questionText: text } : q)));
    };

    const handleAddOption = (questionId: string) => {
        setQuestions(previous =>
            previous.map(q =>
                q.id === questionId
                    ? {
                          ...q,
                          options: [...q.options, { id: `option-${Date.now()}`, text: '' }],
                      }
                    : q
            )
        );
    };

    const handleOptionChange = (questionId: string, optionId: string, text: string) => {
        setQuestions(previous =>
            previous.map(q => {
                if (q.id === questionId) {
                    return {
                        ...q,
                        options: q.options.map(opt => (opt.id === optionId ? { ...opt, text } : opt)),
                    };
                }
                return q;
            })
        );
    };

    const setCorrectOption = (questionId: string, optionId: string) => {
        setQuestions(previousQuestions => {
            const updated = previousQuestions.map(q => {
                if (q.id === questionId) {
                    return { ...q, correctOptionId: optionId };
                }
                return q;
            });
            return updated;
        });
    };

    const handleCorrectOptionChange = (questionId: string, option: DropdownOption | undefined) => {
        if (option && option !== undefined && option !== null) {
            setCorrectOption(questionId, String(option));
        } else {
            setQuestions(previousQuestions => {
                return previousQuestions.map(q => {
                    if (q.id === questionId) {
                        return { ...q, correctOptionId: undefined };
                    }
                    return q;
                });
            });
        }
    };

    const getCorrectOptionDropdownOptions = (question: Question): DropdownOption[] => {
        return question.options.map((opt, index) => ({
            label: opt.text.trim() || `Option ${index + 1}`,
            value: opt.id,
            // value:opt.text.trim()
        }));
    };

    const getDropdownValue = (question: Question): DropdownOption | undefined => {
        if (!question.correctOptionId) {
            return undefined;
        }
        const option = question.options.find(opt => opt.id === question.correctOptionId);
        if (!option) {
            return undefined;
        }
        const index = question.options.findIndex(opt => opt.id === question.correctOptionId);
        return {
            label: option.text.trim() || `Option ${index + 1}`,
            value: option.id,
        };
    };

    // Notify parent of questions changes
    useEffect(() => {
        if (onQuestionsChange) {
            onQuestionsChange(questions);
        }
    }, [questions]);

    return {
        questions,
        handleAddQuestion,
        handleQuestionChange,
        handleAddOption,
        handleOptionChange,
        setCorrectOption,
        handleCorrectOptionChange,
        getCorrectOptionDropdownOptions,
        getDropdownValue,
    };
}
