import { useState } from 'react';
import type { QnAOption, SavedQuestion } from '../../../../interfaces/prizeAgreement/prizeAgreement.types';

export function useBrainiacQnA(onQuestionsChange: (newQuestions: SavedQuestion[]) => void, questions: SavedQuestion[]) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<QnAOption[]>([
        { id: 'opt-1', text: '', isCorrect: true },
        { id: 'opt-2', text: '', isCorrect: false },
    ]);

    const handleQuestionChange = (value: string) => {
        setQuestion(value);
    };

    const handleOptionTextChange = (id: string, text: string) => {
        setOptions(previous => previous.map(opt => (opt.id === id ? { ...opt, text } : opt)));
    };

    const setCorrectOption = (id: string) => {
        setOptions(previous => previous.map(opt => ({ ...opt, isCorrect: opt.id === id })));
    };

    const addOption = () => {
        const newId = `opt-${Date.now()}`;
        setOptions(previous => [...previous, { id: newId, text: '', isCorrect: false }]);
    };

    const deleteOption = (id: string) => {
        setOptions(previous => previous.filter(opt => opt.id !== id));
    };

    const startAdding = () => {
        setIsAdding(true);
        setEditingId(null);
        setQuestion('');
        setOptions([
            { id: `opt-${Date.now() + 2}`, text: '', isCorrect: true },
            { id: `opt-${Date.now() + 3}`, text: '', isCorrect: false },
        ]);
    };

    const saveQuestion = (reset: boolean = true) => {
        const isFormValid = question.trim() !== '' && options.every(opt => opt.text.trim() !== '') && options.some(opt => opt.isCorrect);
        if (!isFormValid) return null;

        const newQuestion: SavedQuestion = {
            id: editingId || `q-${Date.now()}`,
            question,
            options: [...options],
        };

        if (editingId) {
            onQuestionsChange(questions.map(q => (q.id === editingId ? newQuestion : q)));
        } else {
            onQuestionsChange([...questions, newQuestion]);
        }

        if (reset) {
            setQuestion('');
            setOptions([
                { id: `opt-${Date.now() + 2}`, text: '', isCorrect: true },
                { id: `opt-${Date.now() + 3}`, text: '', isCorrect: false },
            ]);
            setEditingId(null);
            setIsAdding(false);
        } else {
            setEditingId(newQuestion.id);
        }

        return newQuestion;
    };

    const editQuestion = (id: string) => {
        const qToEdit = questions.find(q => q.id === id);
        if (qToEdit) {
            setQuestion(qToEdit.question);
            setOptions(qToEdit.options.map(opt => ({ ...opt })));
            setEditingId(id);
            setIsAdding(true);
        }
    };

    const cancelAdding = () => {
        setIsAdding(false);
        setEditingId(null);
        setQuestion('');
        setOptions([
            { id: `opt-${Date.now() + 2}`, text: '', isCorrect: true },
            { id: `opt-${Date.now() + 3}`, text: '', isCorrect: false },
        ]);
    };

    const deleteQuestion = (id: string) => {
        onQuestionsChange(questions.filter(q => q.id !== id));
        if (editingId === id) {
            cancelAdding();
        }
    };

    const isFormValid = question.trim() !== '' && options.every(opt => opt.text.trim() !== '') && options.some(opt => opt.isCorrect);

    return {
        questions,
        question,
        options,
        editingId,
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
        cancelAdding,
        isFormValid,
    };
}
