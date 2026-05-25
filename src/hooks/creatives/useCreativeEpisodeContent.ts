import { useEffect, useState } from 'react';
import type { CreativesSelectOption, CreativeSection, Question } from '../../interfaces/creatives/creatives.types';

interface UseCreativeEpisodeContentProperties {
    episodeId: string;
    onDataChange?: (data: {
        logoFile: File | undefined;
        logoRemoved?: boolean;
        creatives: Array<{ assetType: string; file: File; url?: string }>;
        questions: Question[];
    }) => void;
}

export function useCreativeEpisodeContent({ episodeId, onDataChange }: UseCreativeEpisodeContentProperties) {
    const [logoFile, setLogoFile] = useState<File | undefined>();
    const [logoRemoved, setLogoRemoved] = useState<boolean>(false);
    const [creativeSections, setCreativeSections] = useState<CreativeSection[]>([
        {
            id: `creative-${episodeId}-1`,
            assetType: undefined,
            file: undefined,
            url: '',
        },
    ]);

    const handleAddCreative = () => {
        const newSection: CreativeSection = {
            id: `creative-${episodeId}-${Date.now()}`,
            assetType: undefined,
            file: undefined,
            url: '',
        };
        setCreativeSections([...creativeSections, newSection]);
    };

    const handleDeleteCreative = (sectionId: string) => {
        setCreativeSections(creativeSections.filter(section => section.id !== sectionId));
    };

    const handleAssetTypeChange = (sectionId: string, option: CreativesSelectOption | undefined) => {
        setCreativeSections(
            creativeSections.map(section =>
                section.id === sectionId
                    ? {
                          ...section,
                          assetType: option,
                          file: undefined, // Clear file when asset type changes to ensure file type matches
                      }
                    : section
            )
        );
    };

    const handleFileChange = (sectionId: string, file: File | undefined) => {
        setCreativeSections(creativeSections.map(section => (section.id === sectionId ? { ...section, file } : section)));
    };

    const handleUrlChange = (sectionId: string, url: string) => {
        setCreativeSections(creativeSections.map(section => (section.id === sectionId ? { ...section, url } : section)));
    };

    const handleLogoChange = (file: File | undefined | string) => {
        setLogoFile(file instanceof File ? file : undefined);
        // If file is undefined (removed), mark as removed. If a new file is uploaded, clear the removed flag.
        if (!file) {
            setLogoRemoved(true);
        }
    };

    // Notify parent of logo and creatives changes (but NOT questions - those are handled by QnAUpload directly)
    useEffect(() => {
        if (onDataChange) {
            // Include creatives that have a file (even if assetType is not set yet)
            // This ensures files aren't lost when user uploads before selecting asset type
            const creatives = creativeSections
                .filter(section => section.file) // Include any section with a file
                .map(section => ({
                    assetType: section.assetType?.label ?? 'Image', // Default to 'Image' if not set
                    file: section.file!,
                    url: section.url || undefined,
                }));

            // Only notify about logo and creatives changes, not questions
            // Questions are handled separately by QnAUpload component
            onDataChange({
                logoFile,
                logoRemoved: logoRemoved && !logoFile, // Only true if removed and no file present
                creatives,
                questions: [], // Empty array - QnAUpload will update this separately
            });
        }
    }, [logoFile, logoRemoved, creativeSections]);

    return {
        logoFile,
        creativeSections,
        handleAddCreative,
        handleDeleteCreative,
        handleAssetTypeChange,
        handleFileChange,
        handleUrlChange,
        handleLogoChange,
    };
}
