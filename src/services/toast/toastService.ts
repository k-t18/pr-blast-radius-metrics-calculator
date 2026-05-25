import type { Toast } from 'primereact/toast';
// eslint-disable-next-line import/no-unresolved
import '../../styles/toast.css';

let toastReference: { current: Toast | null } | null = null;

/**
 * Initialize the toast service with a Toast ref
 * This should be called once in the App component
 */
export function setToastReference(reference: { current: Toast | null }) {
    toastReference = reference;
}

function getToastStyling() {
    return {
        className: 'chances-toast',
        contentClassName: 'chances-toast-content',
    };
}

export function showSuccessToast(message: string) {
    const styling = getToastStyling();
    if (toastReference?.current) {
        toastReference.current.show({
            severity: 'success',
            summary: 'Success',
            detail: message,
            life: 3000,
            ...styling,
        });
    }
}

/**
 * Show an error toast notification
 */
export function showErrorToast(message: string) {
    const styling = getToastStyling();
    if (toastReference?.current) {
        toastReference.current.show({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 30000,
            ...styling,
        });
    }
}
