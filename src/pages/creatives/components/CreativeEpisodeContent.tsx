import ActionButton from '../../../components/common/ActionButton';
import type { CreativeEpisodeContentProperties } from '../../../interfaces/creatives/creatives.types';
import { useCreativeEpisodeContent } from '../../../hooks/creatives/useCreativeEpisodeContent';
import CreativesUploadSection from './episodeSections/CreativesUploadSection';

interface CreativeEpisodeContentExtendedProperties extends CreativeEpisodeContentProperties {
    onSave?: () => void;
    isSaveDisabled?: boolean;
    saveErrorMessage?: string;
}

function CreativeEpisodeContent({
    episode,
    platform,
    progress = 0,
    onDataChange,
    onSave,
    isSaveDisabled = false,
    saveErrorMessage,
}: CreativeEpisodeContentExtendedProperties) {
    const { creativeSections, handleAddCreative, handleDeleteCreative, handleAssetTypeChange, handleFileChange, handleUrlChange } =
        useCreativeEpisodeContent({
            episodeId: episode.id,
            onDataChange,
        });

    // Button should be enabled only when progress is 100%
    const isButtonDisabled = isSaveDisabled || progress < 100;

    return (
        <div className="flex flex-col gap-6">
            <CreativesUploadSection
                episode={episode}
                platform={platform}
                creativeSections={creativeSections}
                onAddCreative={handleAddCreative}
                onDeleteCreative={handleDeleteCreative}
                onAssetTypeChange={handleAssetTypeChange}
                onFileChange={handleFileChange}
                onUrlChange={handleUrlChange}
            />

            <div className="px-5 mt-2">
                <ActionButton
                    width="min-w-[120px]"
                    className="font-ubuntu font-normal text-sm leading-5"
                    borderRadius="rounded"
                    isDisabled={isSaveDisabled || isButtonDisabled}
                    onClick={onSave}
                >
                    {isSaveDisabled ? 'Saving...' : 'Save & Continue'}
                </ActionButton>
                {saveErrorMessage && <div className="mt-2 text-sm text-red-600">{saveErrorMessage}</div>}
            </div>
        </div>
    );
}

export default CreativeEpisodeContent;
