import { useRef, useState, useEffect } from 'react';
import type { FileUpload as PrimeFileUpload, FileUploadHandlerEvent, FileUploadSelectEvent } from 'primereact/fileupload';
import { showErrorToast } from '../services/toast/toastService';
import { useDocumentSizeData } from '../stores/useDocumentSizeData';

// Type for file with objectURL that PrimeReact expects
type FileUploadFile = File & { objectURL: string };

interface UseFileUploadProperties {
    accept?: string;
    maxFileSize?: number;
    name: string;
    disabled?: boolean;
    onChange: (file: File | undefined, name: string) => void;
    value?: File | undefined;
}

/**
 * Formats file size in bytes to human-readable format
 */
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / k ** index).toFixed(2))} ${sizes[index]}`;
};

/**
 * Determines the document type category from file MIME type
 * @param fileType - The file's MIME type (e.g., 'image/png', 'video/mp4')
 * @returns 'Image', 'Video', or undefined if unknown
 */
const getDocumentTypeFromMimeType = (fileType: string): 'Image' | 'Video' | undefined => {
    if (fileType.startsWith('image/')) {
        return 'Image';
    }
    if (fileType.startsWith('video/')) {
        return 'Video';
    }
    return undefined;
};

/**
 * Gets the effective max file size based on file type and dynamic limits
 * @param file - The file to check
 * @param defaultMaxFileSize - The default max file size in bytes (from props)
 * @param getSizeForType - Function to get size limit for a document type (returns MB or undefined)
 * @returns The effective max file size in bytes
 */
const getEffectiveMaxFileSize = (file: File, defaultMaxFileSize: number, getSizeForType: (type: string) => number | undefined): number => {
    // Get dynamic file size limit based on file type (Image/Video)
    const documentType = getDocumentTypeFromMimeType(file.type);
    const dynamicMaxSizeMB = documentType ? getSizeForType(documentType) : undefined;
    const dynamicMaxSizeBytes = dynamicMaxSizeMB ? dynamicMaxSizeMB * 1024 * 1024 : undefined;

    // Use the more restrictive limit: either the prop maxFileSize or the dynamic size
    // If dynamic size is available, use it; otherwise fall back to prop
    return dynamicMaxSizeBytes === undefined ? defaultMaxFileSize : dynamicMaxSizeBytes;
};

/**
 * Custom hook for file upload functionality
 */
export function useFileUpload({ accept = '*', maxFileSize = 1_048_576, name, disabled = false, onChange, value }: UseFileUploadProperties) {
    const fileUploadReference = useRef<PrimeFileUpload>(null);
    const hiddenInputReference = useRef<HTMLInputElement>(null);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const previousValueReference = useRef<File | undefined>(value || undefined);
    const { getSizeForType } = useDocumentSizeData();

    // Restore file preview when value changes (e.g., when navigating back to the form)
    useEffect(() => {
        // Clean up previous objectURL if value changed from file to undefined
        if (previousValueReference.current && !value) {
            const previousFile = previousValueReference.current as File & { objectURL?: string };
            if (previousFile.objectURL) {
                URL.revokeObjectURL(previousFile.objectURL);
            }
        }

        if (value && fileUploadReference.current) {
            const file = value as File & { objectURL?: string };

            // Recreate objectURL for images if it doesn't exist (blob URLs are lost on navigation)
            if (file.type?.startsWith('image/') && !file.objectURL) {
                file.objectURL = URL.createObjectURL(file);
            }

            // Update uploaded bytes
            setUploadedBytes(file.size);

            // Restore file to PrimeReact's internal state
            const primeUploadInstance = fileUploadReference.current;
            if (primeUploadInstance.setFiles) {
                const fileForPrimeReact: FileUploadFile = file.objectURL ? (file as FileUploadFile) : ({ ...file, objectURL: '' } as FileUploadFile);
                primeUploadInstance.setFiles([fileForPrimeReact]);
            }
        } else if (!value && fileUploadReference.current) {
            // Clear files if value is undefined
            const primeUploadInstance = fileUploadReference.current;
            if (primeUploadInstance.setFiles) {
                primeUploadInstance.setFiles([]);
            }
            setUploadedBytes(0);
        }

        // Update previous value ref
        previousValueReference.current = value;
    }, [value]);

    /**
     * Validates if a file matches the accepted file types
     */
    const validateFileType = (file: File): boolean => {
        if (!accept || accept === '*') return true;

        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();

        // Split accept string into individual types/extensions
        const acceptedTypes = accept.split(',').map(type => type.trim().toLowerCase());

        // Check if file matches any of the accepted types
        return acceptedTypes.some(acceptedType => {
            // Check for wildcard types like "image/*" or "video/*"
            if (acceptedType.includes('/*')) {
                const typePrefix = acceptedType.split('/')[0];
                return fileType.startsWith(`${typePrefix}/`);
            }

            // Check for specific file extensions like ".mp4", ".jpg"
            if (acceptedType.startsWith('.')) {
                const fileExtension = `.${fileName.split('.').pop()?.toLowerCase()}`;
                return acceptedType === fileExtension;
            }

            // Check for exact MIME type match
            return fileType === acceptedType;
        });
    };

    const handleSelect = (event: FileUploadSelectEvent) => {
        if (event.files && event.files.length > 0) {
            const file = event.files[0];

            // Validate file type
            if (!validateFileType(file)) {
                showErrorToast(`Invalid file type. Please select a file that matches: ${accept}`);
                if (fileUploadReference.current) {
                    fileUploadReference.current.clear();
                }
                return;
            }

            // Get effective max file size based on file type
            const effectiveMaxFileSize = getEffectiveMaxFileSize(file, maxFileSize, getSizeForType);

            // Validate file size
            if (file.size > effectiveMaxFileSize) {
                showErrorToast(`File size exceeds the maximum allowed size of ${formatFileSize(effectiveMaxFileSize)}`);
                if (fileUploadReference.current) {
                    fileUploadReference.current.clear();
                }
                return;
            }

            // Create objectURL for image preview if it's an image and doesn't already have one
            const fileWithURL = file as File & { objectURL?: string };
            if (file.type.startsWith('image/') && !fileWithURL.objectURL) {
                fileWithURL.objectURL = URL.createObjectURL(file);
            }

            setUploadedBytes(file.size);
            onChange(file, name);
        }
    };

    const handleRemove = () => {
        // Revoke objectURL if it exists to prevent memory leaks
        if (fileUploadReference.current) {
            const files = fileUploadReference.current.getFiles?.() || [];
            // eslint-disable-next-line unicorn/no-array-for-each
            files.forEach((file: File & { objectURL?: string }) => {
                if (file.objectURL) {
                    URL.revokeObjectURL(file.objectURL);
                }
            });
            fileUploadReference.current.clear();
        }
        setUploadedBytes(0);
        onChange(undefined, name);
    };

    const handleClear = () => {
        // Revoke objectURL if it exists to prevent memory leaks
        if (fileUploadReference.current) {
            const files = fileUploadReference.current.getFiles?.() || [];
            // eslint-disable-next-line unicorn/no-array-for-each
            files.forEach((file: File & { objectURL?: string }) => {
                if (file.objectURL) {
                    URL.revokeObjectURL(file.objectURL);
                }
            });
        }
        setUploadedBytes(0);
        onChange(undefined, name);
    };

    const customUpload = (event: FileUploadHandlerEvent) => {
        // Custom upload handler - we're handling file storage manually
        if (event.files && event.files.length > 0) {
            const file = event.files[0];
            onChange(file, name);
        }
    };

    const handleUploadClick = () => {
        if (disabled) return;

        // Find and click PrimeReact's internal file input
        if (fileUploadReference.current) {
            // Access the component's DOM element
            const componentElement = fileUploadReference.current.getElement?.();
            if (componentElement) {
                const fileInput = componentElement.querySelector('input[type="file"]') as HTMLInputElement;
                if (fileInput) {
                    fileInput.click();
                    return;
                }
            }

            // Alternative: Try to access the input through the component instance
            const fileUploadElement = fileUploadReference.current as PrimeFileUpload & { input?: HTMLInputElement };
            if (fileUploadElement.input) {
                fileUploadElement.input.click();
                return;
            }
        }

        // Fallback: Use hidden input
        if (hiddenInputReference.current) {
            hiddenInputReference.current.click();
        }
    };

    const handleHiddenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!validateFileType(file)) {
                showErrorToast(`Invalid file type. Please select a file that matches: ${accept}`);
                if (hiddenInputReference.current) {
                    hiddenInputReference.current.value = '';
                }
                return;
            }

            // Get effective max file size based on file type
            const effectiveMaxFileSize = getEffectiveMaxFileSize(file, maxFileSize, getSizeForType);

            // Validate file size
            if (file.size > effectiveMaxFileSize) {
                showErrorToast(`File size exceeds the maximum allowed size of ${formatFileSize(effectiveMaxFileSize)}`);
                if (hiddenInputReference.current) {
                    hiddenInputReference.current.value = '';
                }
                return;
            }

            // Create objectURL for images and videos for preview
            const fileWithURL = file as File & { objectURL?: string };
            if ((file.type.startsWith('image/') || file.type.startsWith('video/')) && !fileWithURL.objectURL) {
                fileWithURL.objectURL = URL.createObjectURL(file);
            }

            // Update PrimeReact's internal file list so it displays the file
            if (fileUploadReference.current) {
                const primeUploadInstance = fileUploadReference.current;

                // Set files in PrimeReact's internal state
                // PrimeReact expects objectURL to be a required string, so we ensure it exists
                if (primeUploadInstance.setFiles) {
                    const fileForPrimeReact: FileUploadFile = fileWithURL.objectURL
                        ? (fileWithURL as FileUploadFile)
                        : ({ ...file, objectURL: '' } as FileUploadFile);
                    primeUploadInstance.setFiles([fileForPrimeReact]);
                }
            }

            // Create a mock FileUploadSelectEvent to trigger our handleSelect
            const mockEvent = {
                files: [fileWithURL],
                originalEvent: event,
            } as FileUploadSelectEvent;

            // Trigger our handleSelect to update our state and call onChange
            // This will also update PrimeReact's internal state through the onSelect prop
            handleSelect(mockEvent);

            // Reset the hidden input for next selection
            if (hiddenInputReference.current) {
                hiddenInputReference.current.value = '';
            }
        }
    };

    return {
        fileUploadReference,
        hiddenInputReference,
        uploadedBytes,
        validateFileType,
        handleSelect,
        handleRemove,
        handleClear,
        customUpload,
        handleUploadClick,
        handleHiddenInputChange,
        formatFileSize,
    };
}
