import { useEffect, useRef, useState } from 'react';
import ActionButton from '../../common/ActionButton';
import { ArrowsCounterClockwise, Cross } from '../../icons';
import type { CreativeEpisode } from '../../../interfaces/creatives/creatives.types';

export interface ImageUploadBoxProperties {
    episode: CreativeEpisode;
    onFileChange?: (file: File | undefined | string) => void;
    containerClass?: string;
    previewClass?: string;
    buttonWrapperClass?: string;
    accept?: string;
    disabled?: boolean;
}

export function ImageUploadBox({
    episode,
    onFileChange,
    containerClass = '',
    previewClass = 'w-full h-full',
    buttonWrapperClass = 'flex w-full gap-3 mt-2',
    accept = 'image/*',
    disabled = false,
}: ImageUploadBoxProperties) {
    const { imageUrl: initialImageUrl, dimensions, format, sizeLimit } = episode.logoRequirement;
    const fileInputReference = useRef<HTMLInputElement | null>(null);
    const [previewUrl, setPreviewUrl] = useState(initialImageUrl ?? '');
    // const [selectedFile, setSelectedFile] = useState<File | undefined>();
    // const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPreviewUrl(initialImageUrl ?? '');
    }, [initialImageUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            // onFileChange?.();
            return;
        }
        onFileChange?.(file);
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setPreviewUrl(reader.result as string);
        });
        reader.readAsDataURL(file);
    };

    const handleClear = () => {
        setPreviewUrl('');
        if (fileInputReference.current) {
            fileInputReference.current.value = '';
        }
        // Notify parent that logo was removed (either uploaded file or API logo)
        onFileChange?.('');
    };

    return (
        <>
            <div className={['w-full max-w-[100px] h-[100px]', containerClass].filter(Boolean).join(' ')}>
                <div
                    className={['relative border border-gray-300 bg-gray-50  overflow-hidden cursor-pointer', previewClass].filter(Boolean).join(' ')}
                    onClick={() => fileInputReference.current?.click()}
                    role="presentation"
                    aria-label="Upload image"
                >
                    {previewUrl && <img src={previewUrl} alt="" className="absolute inset-0 h-full w-full object-inherit" loading="lazy" />}

                    <input ref={fileInputReference} type="file" accept={accept} hidden onChange={handleFileChange} disabled={disabled} />
                </div>
            </div>
            <div className="text-xs text-gray-600 mt-2 leading-5 font-normal text-gray-900">
                <span>
                    {dimensions}, {format}, {sizeLimit}
                </span>
            </div>
            <div className={buttonWrapperClass}>
                <ActionButton
                    width="min-w-[87px]"
                    bgColor="bg-white"
                    textColor="text-black"
                    borderColor="border-gray-600"
                    borderRadius="rounded"
                    className="px-[10.5px] py-[2px] h-[24px] font-normal text-xs"
                    onClick={() => fileInputReference.current?.click()}
                    // isDisabled={!previewUrl || uploading}
                >
                    <div className="flex justify-center gap-3 leading-5">
                        <span className="self-center">
                            <ArrowsCounterClockwise size={16} color="text-black" />
                        </span>
                        <span>Change</span>
                    </div>
                </ActionButton>
                <ActionButton
                    width="min-w-[87px]"
                    bgColor="bg-white"
                    textColor="text-black"
                    borderColor="border-gray-600"
                    borderRadius="rounded"
                    className="px-[10.5px] py-[2px] h-[24px] font-normal text-xs"
                    onClick={handleClear}
                >
                    <div className="flex justify-center gap-3 leading-5">
                        <span className="self-center">
                            <Cross size={16} color="text-black" />
                        </span>
                        <span>Remove</span>
                    </div>
                </ActionButton>
            </div>
        </>
    );
}

export default ImageUploadBox;
