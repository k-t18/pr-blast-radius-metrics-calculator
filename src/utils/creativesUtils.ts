import type { CreativeEpisode, EpisodeData } from '../interfaces/creatives/creatives.types';

/**
 * Generates a formatted summary string from episode data and episodes.
 *
 * @param data - Record of episode data keyed by episode ID.
 * @param episodes - Array of creative episodes.
 * @returns A formatted summary string.
 */
export function generateSummary(data: Record<string, EpisodeData>, episodes: CreativeEpisode[]): string {
    const lines: string[] = [];

    // eslint-disable-next-line unicorn/no-array-for-each
    episodes.forEach(episode => {
        const episodeData = data[episode.id];
        if (!episodeData) {
            return;
        }

        const hasData = episodeData.creatives.length > 0 || episodeData.questions.length > 0;
        if (!hasData) {
            return;
        }

        lines.push(episode.title);

        let fileNumber = 1;

        // Creative files
        // eslint-disable-next-line unicorn/no-array-for-each
        episodeData.creatives.forEach(creative => {
            lines.push(`  File ${fileNumber}: ${creative.file.name}`);
            const creativeSpecs = episode.assetRequirement;
            lines.push(`    Specifications: Aspect Ratio: 16, File Type: PNG / JPEG, Max File Size: ${creativeSpecs.maxFileSizeMB} MB`);
            fileNumber += 1;
        });

        // QnA Questions (for Brainiac)
        // eslint-disable-next-line unicorn/no-array-for-each
        episodeData.questions.forEach(question => {
            lines.push(`  Question: ${question.questionText}`);
            // eslint-disable-next-line unicorn/no-array-for-each
            question.options.forEach((option, optIndex) => {
                lines.push(`    Option ${optIndex + 1}: ${option}`);
            });
            lines.push(`    Answer: ${question.correctOptionId}`);
        });

        lines.push(''); // Empty line between episodes
    });

    return lines.join('\n');
}

/**
 * Determines the accepted file types based on the selected asset type.
 *
 * @param assetTypeValue - The value of the selected asset type.
 * @returns The accept string for the file input.
 */
export function getAcceptFileTypes(assetTypeValue: string | undefined): string {
    if (!assetTypeValue) {
        return 'image/*,video/*'; // Default: accept both
    }

    const lowerValue = assetTypeValue.toLowerCase();

    // If asset type is "jpg" or "banner" → allow images only
    if (lowerValue.includes('jpg') || lowerValue.includes('banner')) {
        return 'image/*';
    }

    // If asset type is "video" → allow videos only
    if (lowerValue.includes('video')) {
        return 'video/*';
    }

    // Default: accept both for other types
    return 'image/*,video/*';
}

/**
 * Formats the accept file types string into a human-readable format.
 *
 * @param acceptString - The accept string (e.g., "image/*", "video/*", "image/*,video/*").
 * @returns A formatted string (e.g., "PNG / JPEG", "MP4 / MOV", "PNG / JPEG / MP4 / MOV").
 */
export function formatFileTypesForDisplay(acceptString: string): string {
    if (acceptString.includes('image/*') && acceptString.includes('video/*')) {
        return 'PNG / JPEG / MP4 / MOV';
    }
    if (acceptString.includes('image/*')) {
        return 'PNG / JPEG';
    }
    if (acceptString.includes('video/*')) {
        return 'MP4 / MOV';
    }
    return 'PNG / JPEG';
}

/**
 * Calculates the progress percentage for an episode based on completed sections.
 *
 * @param episodeData - The data for the episode.
 * @param isBrainiac - Whether this is a Brainiac episode (has QnA section).
 * @param initialLogoUrl - Optional initial logo URL from logoRequirement (fetched from API). (Deprecated: logo upload removed)
 * @returns Progress percentage (0-100).
 */
export function calculateEpisodeProgress(episodeData: EpisodeData, isBrainiac: boolean, _initialLogoUrl?: string): number {
    const hasCreatives = episodeData.creatives.some(creative => creative.file || creative.url);
    const hasQnA =
        episodeData.questions?.length > 0 &&
        episodeData.questions.every(
            q =>
                typeof q?.questionText === 'string' &&
                q.questionText.trim().length > 0 &&
                typeof q?.correctOptionId === 'string' &&
                q.correctOptionId.length > 0
        );

    if (isBrainiac) {
        // Brainiac episodes: 50% for creatives, 50% for QnA
        const progressPerSection = 50;
        let progress = 0;
        if (hasCreatives) {
            progress += progressPerSection;
        }
        if (hasQnA) {
            progress += progressPerSection;
        }
        return Math.round(progress * 10) / 10; // Round to 1 decimal place
    }

    // Regular episodes: progress is based only on creatives
    if (hasCreatives) {
        return 100;
    }

    return 0;
}

export const trimFileName = (name: string, max = 30) => {
    if (!name || name.length <= max) return name;
    const start = name.slice(0, 15);
    const end = name.slice(-10);
    return `${start}...${end}`;
};
