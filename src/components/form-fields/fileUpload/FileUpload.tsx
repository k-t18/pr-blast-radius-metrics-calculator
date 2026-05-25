/**
 * FileUpload Component
 *
 * A custom file upload component built on top of PrimeReact's FileUpload
 * with drag-and-drop support and custom styling.
 */

import { FileUpload as PrimeFileUpload, type ItemTemplateOptions } from 'primereact/fileupload';
import '../../../styles/fileUpload.css';
import { ProgressBar } from 'primereact/progressbar';
import { Cross, Plus, SingleImage } from '../../icons';
import ActionButton from '../../common/ActionButton';
import DescriptionText from '../../common/DescriptionText';
import { useFileUpload } from '../../../hooks/useFileUpload';
import { trimFileName } from '../../../utils/creativesUtils';

export interface FileUploadProperties {
    /** Unique identifier for the file upload field */
    id: string;
    /** Name attribute for the file upload */
    name: string;
    /** Label text to display above the file upload */
    label?: string;
    /** Currently uploaded file */
    value?: File | undefined;
    /** Callback when file is selected */
    onChange: (file: File | undefined, name: string) => void;
    /** Accepted file types (e.g., 'image/*', '.pdf', '.png,.jpg') */
    accept?: string;
    /** Maximum file size in bytes (default: 1MB) */
    maxFileSize?: number;
    /** Error message to display */
    error?: string;
    /** Helper text to display below the upload area */
    helperText?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Custom className for the container */
    className?: string;
    /** Whether to show the remove (X) button next to the plus button */
    showRemoveButton?: boolean;
    /** Custom max-width for the container (default: 500px) */
    maxWidth?: string;
}

/**
 * FileUpload Component
 *
 * A customizable file upload with drag-and-drop support.
 *
 * @example
 * ```tsx
 * <FileUpload
 *   id="logo"
 *   name="logo"
 *   label="Upload Company Logo"
 *   value={logo}
 *   onChange={(file) => setLogo(file)}
 *   accept=".png,.jpg"
 *   maxFileSize={1048576}
 *   helperText="Acceptable file types: PNG, JPG"
 * />
 * ```
 */
function FileUpload({
    id,
    name,
    label,
    value,
    onChange,
    accept = '*',
    maxFileSize = 1_048_576, // 1MB default
    error,
    helperText,
    required = false,
    disabled = false,
    className = '',
    showRemoveButton = false,
    maxWidth = '500px',
}: FileUploadProperties) {
    const {
        fileUploadReference,
        hiddenInputReference,
        uploadedBytes,
        handleSelect,
        handleRemove,
        handleClear,
        customUpload,
        handleUploadClick,
        handleHiddenInputChange,
        formatFileSize,
    } = useFileUpload({
        accept,
        maxFileSize,
        name,
        disabled,
        onChange,
        value,
    });

    const hasError = Boolean(error);

    const emptyTemplate = () => {
        return (
            <div className="upload-empty-content">
                <div className="upload-drop-zone flex flex-col items-center">
                    <div className="upload-icon">
                        <SingleImage size={24} />
                    </div>
                    <DescriptionText
                        text="Drag and Drop File Here"
                        color="text-charcoal"
                        size="xxs"
                        weight="normal"
                        className="leading-5 upload-text"
                    />
                </div>
            </div>
        );
    };

    const itemTemplate = (file: object, options: ItemTemplateOptions) => {
        const fileObject = file as File & { objectURL?: string };
        const isImage = fileObject.type?.startsWith('image/');
        const hasPreview = isImage && fileObject.objectURL;

        return (
            <div className="flex items-center gap-3">
                <div className="flex gap-4">
                    <div className="max-w-[100px] max-h-[52px] overflow-hidden">
                        {hasPreview ? (
                            <img alt={fileObject.name} src={fileObject.objectURL} className="w-full h-full object-cover" />
                        ) : (
                            <SingleImage size={20} color="text-gray-600" />
                        )}
                    </div>
                    <div className="flex flex-col items-start">
                        <DescriptionText
                            text={trimFileName(fileObject.name)}
                            color="tex-gray-950"
                            size="sm"
                            weight="medium"
                            className="leading-5 truncate"
                        />
                        <DescriptionText
                            text={new Date().toLocaleDateString()}
                            color="text-gray-750"
                            size="xs"
                            weight="medium"
                            className="leading-5 mt-1"
                        />
                    </div>
                </div>
                <div className="flex flex-1 justify-end">
                    <ActionButton
                        textColor="text-black"
                        bgColor="bg-white"
                        onClick={clickEvent => {
                            handleRemove();
                            if (options.onRemove) {
                                options.onRemove(clickEvent);
                            }
                        }}
                        width="w-[16px]"
                        className="creatives-upload-delete-btn"
                    >
                        <Cross size={16} color="text-black" />
                    </ActionButton>
                </div>
            </div>
        );
    };

    const headerTemplate = () => {
        const maxSizeMB = maxFileSize / 1_048_576;
        const progressPercentage = maxFileSize > 0 ? (uploadedBytes / maxFileSize) * 100 : 0;
        const hasFile = uploadedBytes > 0;

        return (
            <div className="upload-header-wrapper">
                <div className="upload-header-buttons">
                    <button type="button" className="upload-plus-button" onClick={handleUploadClick} disabled={disabled}>
                        <Plus size={16} color="text-black" />
                    </button>
                    {showRemoveButton && hasFile && (
                        <button type="button" className="upload-remove-button" onClick={handleRemove} disabled={disabled} aria-label="Remove file">
                            <Cross size={16} color="#dc2626" />
                        </button>
                    )}
                </div>
                <div className="upload-header-body">
                    <span className="upload-file-size">
                        {formatFileSize(uploadedBytes)} / {maxSizeMB} MB
                    </span>
                    <ProgressBar value={progressPercentage} showValue={false} className="upload-progress-bar" />
                </div>
            </div>
        );
    };

    return (
        <div
            className={`file-upload-container ${className} ${hasError ? 'has-error' : ''} ${disabled ? 'disabled' : ''}`}
            style={{ maxWidth, width: '100%' }}
        >
            {/* Label */}
            {label && (
                <label htmlFor={id} className="file-upload-label">
                    {label}
                    {required && <span className="required-indicator">*</span>}
                </label>
            )}

            {/* File Upload */}
            <div className="">
                <PrimeFileUpload
                    ref={fileUploadReference}
                    name={name}
                    accept={accept}
                    maxFileSize={maxFileSize}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                    onClear={handleClear}
                    customUpload
                    uploadHandler={customUpload}
                    headerTemplate={headerTemplate}
                    itemTemplate={itemTemplate}
                    emptyTemplate={emptyTemplate}
                    disabled={disabled}
                    chooseLabel=""
                    uploadLabel=""
                    cancelLabel=""
                    className={`custom-prime-upload creatives-prime-upload ${hasError ? 'upload-error' : ''}`}
                />
                {/* Hidden file input for plus button click */}
                <input
                    ref={hiddenInputReference}
                    type="file"
                    accept={accept}
                    onChange={handleHiddenInputChange}
                    style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
                    id={`${id}-hidden-input`}
                    tabIndex={-1}
                />
            </div>

            {helperText && <DescriptionText text={helperText} color="text-gray-750" size="xs" weight="normal" className="leading-4 upload-helper" />}

            {/* Error Message */}
            {error && (
                <small id={`${id}-error`} className="error-message">
                    {error}
                </small>
            )}
        </div>
    );
}

export default FileUpload;
