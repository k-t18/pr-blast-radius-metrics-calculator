import ActionButton from '../../../../components/common/ActionButton';
import { CustomDropdown } from '../../../../components/common/Dropdown';
import FileUpload from '../../../../components/form-fields/fileUpload/FileUpload';
import { InputField } from '../../../../components/form-fields/inputField';
import HeaderTitle from '../../../../components/common/HeaderTitle';
import { Info, Plus, Trash } from '../../../../components/icons';
import { useDocumentSizeData } from '../../../../stores/useDocumentSizeData';
import type { CreativeEpisode, CreativePlatform, CreativeSection, CreativesSelectOption } from '../../../../interfaces/creatives/creatives.types';
import { getAcceptFileTypes } from '../../../../utils/creativesUtils';
import DescriptionText from '../../../../components/common/DescriptionText';

interface CreativesUploadSectionProperties {
    episode: CreativeEpisode;
    platform: CreativePlatform;
    creativeSections: CreativeSection[];
    onAddCreative: () => void;
    onDeleteCreative: (sectionId: string) => void;
    onAssetTypeChange: (sectionId: string, option: CreativesSelectOption | undefined) => void;
    onFileChange: (sectionId: string, file: File | undefined) => void;
    onUrlChange: (sectionId: string, url: string) => void;
}

function CreativesUploadSection({
    episode,
    platform,
    creativeSections,
    onAddCreative,
    onDeleteCreative,
    onAssetTypeChange,
    onFileChange,
    onUrlChange,
}: CreativesUploadSectionProperties) {
    const { getSizeForType } = useDocumentSizeData();

    return (
        <section className="px-5">
            <HeaderTitle text="Upload Creatives" size="md" weight="medium" disabled={false} className="leading-6" />
            <div className="mt-4">
                {creativeSections.map(section => (
                    <div key={section.id} className="flex flex-wrap items-start gap-4 mt-4">
                        <div className="flex flex-col gap-2">
                            <CustomDropdown
                                options={episode.assetRequirement.assetTypeOptions}
                                value={
                                    section.assetType
                                        ? episode.assetRequirement.assetTypeOptions.find(opt => opt.value === section.assetType?.value)
                                        : undefined
                                }
                                placeholder="Asset Type"
                                onChange={option => {
                                    // Find the matching option from the options array to maintain object reference
                                    const matchedOption = option
                                        ? episode.assetRequirement.assetTypeOptions.find(opt => opt.value === String(option.value))
                                        : undefined;
                                    onAssetTypeChange(section.id, matchedOption);
                                }}
                                width="200px"
                                dropDownClass="blanket-dropdown text-xs font-normal leading-5"
                            />
                            {/* Info section - only show when file is uploaded */}
                            <div className="flex items-start gap-2 mt-2">
                                <Info size={16} color="text-gray-800" />
                                <div>
                                    <DescriptionText
                                        text="Aspect Ratio: 16:3"
                                        color="text-gray-900"
                                        size="xxs"
                                        weight="normal"
                                        className="leading-4"
                                    />
                                    <DescriptionText
                                        text="File Type: PNG / JPG"
                                        color="text-gray-900"
                                        size="xxs"
                                        weight="normal"
                                        className="leading-4"
                                    />
                                    <DescriptionText
                                        text={`Max File Size: ${
                                            section.assetType?.value
                                                ? (getSizeForType(section.assetType.value) ?? episode.assetRequirement.maxFileSizeMB)
                                                : episode.assetRequirement.maxFileSizeMB
                                        } MB`}
                                        color="text-gray-900"
                                        size="xxs"
                                        weight="normal"
                                        className="leading-4"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <FileUpload
                                id={section.id}
                                name={section.id}
                                onChange={file => onFileChange(section.id, file)}
                                accept={getAcceptFileTypes(section.assetType?.value)}
                                maxFileSize={
                                    (section.assetType?.value
                                        ? (getSizeForType(section.assetType.value) ?? episode.assetRequirement.maxFileSizeMB)
                                        : episode.assetRequirement.maxFileSizeMB) *
                                    1024 *
                                    1024
                                }
                            />
                        </div>

                        {platform === 'mobile-game' && (
                            <div className="max-w-[300px]">
                                <InputField
                                    id={`url-${section.id}`}
                                    name={`url-${section.id}`}
                                    type="url"
                                    value={section.url}
                                    onChange={value => onUrlChange(section.id, value)}
                                    placeholder="https://example.com"
                                    className="w-full"
                                    inputClassName="w-full custom-link-input rounded border border-gray-600 h-[36px] px-3 py-2 font-normal text-gray-900 placeholder:text-gray-750"
                                />
                            </div>
                        )}
                        <ActionButton
                            textColor="text-black"
                            bgColor="bg-white"
                            onClick={() => onDeleteCreative(section.id)}
                            width="w-[24px]"
                            className="creatives-upload-delete-btn"
                        >
                            <Trash size={24} color="text-black" />
                        </ActionButton>
                    </div>
                ))}
            </div>
            <div className="mt-4">
                <ActionButton
                    width="min-w-[120px]"
                    bgColor="bg-white"
                    textColor="text-charcoal"
                    borderColor="border-gray-600"
                    borderRadius="rounded"
                    className="p-[4px]"
                    onClick={onAddCreative}
                    // isDisabled={!hasAnyFile}
                >
                    <div className="flex justify-center gap-3 font-normal text-xs leading-5 text-text-charcoal">
                        <span className="self-center">
                            <Plus size={16} color="text-charcoal" />
                        </span>
                        <span className="font-ubuntu">Add a Creative</span>
                    </div>
                </ActionButton>
            </div>
        </section>
    );
}

export default CreativesUploadSection;
