import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import type { ShareButtonConfig, ShareModalConfig } from '../components/ShareModal';

type ShareButtonReferences = Record<string, HTMLDivElement | undefined>;

export function useShareModal(config: ShareModalConfig, onHide: () => void) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>();
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const shareButtonReferences = useRef<ShareButtonReferences>({
        linkedin: undefined,
        facebook: undefined,
        twitter: undefined,
        instagram: undefined,
        'copy-link': undefined,
    });

    // Copies only the caption text to the clipboard.
    // Falls back to a textarea-based copy for older browsers.
    const handleCopyCaption = async () => {
        try {
            await navigator.clipboard.writeText(config.caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = config.caption;
            document.body.append(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Copies caption + share URL (and image URL if present) to the clipboard.
    // Attempts rich clipboard (text+PNG) first, then falls back to plain text.
    const handleCopyLinkImmediate = async (event: ReactMouseEvent | ReactKeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const textContent = `${config.caption}\n\n${config.shareUrl}${config.imageUrl ? `\n\n${config.imageUrl}` : ''}`;

        try {
            // Try to copy image and text
            if (config.imageUrl) {
                try {
                    const response = await fetch(config.imageUrl);
                    const blob = await response.blob();

                    // Only PNG is reliably supported for image clipboard write in many browsers
                    if (blob.type === 'image/png') {
                        await navigator.clipboard.write([
                            new ClipboardItem({
                                'text/plain': new Blob([textContent], { type: 'text/plain' }),
                                'image/png': blob,
                            }),
                        ]);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                        return;
                    }
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error('Image fetch/write failed', error);
                }
            }

            // Fallback to text only
            await navigator.clipboard.writeText(textContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Clipboard write failed', error);
            // Fallback for older browsers or if write fails
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            document.body.append(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Selects a social platform when the user clicks a social icon container.
    // Prevents default so clicks don't bubble to nested share button elements.
    const handleIconClick = (event: ReactMouseEvent, platform: string) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPlatform(platform);
    };

    // Selects a social platform when user presses Enter/Space on an icon.
    // Enables keyboard accessibility for the social icon containers.
    const handleIconKeyDown = (event: ReactKeyboardEvent, platform: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedPlatform(platform);
        }
    };

    // Triggers the actual share action for the currently selected platform.
    // For Instagram, opens the site; for others, clicks the hidden react-share button.
    const handleShare = () => {
        if (!selectedPlatform) return;

        // Handle Instagram share
        if (selectedPlatform === 'instagram') {
            window.open('https://www.instagram.com/', '_blank');
            return;
        }

        // Trigger the react-share button programmatically for social media platforms
        const reference = shareButtonReferences.current[selectedPlatform];
        if (reference) {
            // WORKAROUND: Facebook and LinkedIn do not allow pre-filling the user's message/post text via the share URL.
            // We automatically copy the caption to the clipboard so the user can easily paste it.
            if (config.caption && (selectedPlatform === 'facebook' || selectedPlatform === 'linkedin')) {
                // calls async function without await to preserve user activation for the window.open call below
                handleCopyCaption().catch(() => {
                    // ignore errors
                });
            }

            const button = reference.querySelector('button');
            if (button) {
                button.click();
            }
        }
    };

    // Handles footer action button clicks (share / download / copy caption).
    // Download uses Promise chaining and is guarded to prevent double-clicks while in progress.
    const handleButtonClick = (buttonConfig: ShareButtonConfig) => {
        switch (buttonConfig.action) {
            case 'share': {
                handleShare();
                break;
            }
            case 'download': {
                if (!config.onDownload || isDownloading) break;
                setIsDownloading(true);
                Promise.resolve(config.onDownload())
                    .catch(error => {
                        // eslint-disable-next-line no-console
                        console.error('Download failed', error);
                    })
                    .finally(() => {
                        setIsDownloading(false);
                    });
                break;
            }
            case 'copy-caption': {
                handleCopyCaption();
                break;
            }
            default: {
                break;
            }
        }
    };

    // Resets local modal state so the next open starts fresh.
    // Calls the parent onHide after clearing selection/copy/downloading flags.
    const handleModalHide = () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        setSelectedPlatform(undefined);
        setCopied(false);
        setIsDownloading(false);
        onHide();
    };

    return {
        selectedPlatform,
        copied,
        isDownloading,
        shareButtonReferences,
        handleCopyCaption,
        handleCopyLinkImmediate,
        handleIconClick,
        handleIconKeyDown,
        handleShare,
        handleButtonClick,
        handleModalHide,
    };
}
