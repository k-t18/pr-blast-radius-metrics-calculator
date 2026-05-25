import type { ComponentType, ReactNode } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, XIcon } from 'react-share';
import { useShareModal } from '../hooks/useShareModal';
import ModalWrapper from '../../../components/common/ModalWrapper';
import ActionButton from '../../../components/common/ActionButton';
import { Check, LinkSimple, InstagramLogo } from '../../../components/icons';
import '../../../styles/csr/csrModal.css';
import HeaderTitle from '../../../components/common/HeaderTitle';

export interface ShareButtonConfig {
    id: string;
    label: string;
    icon: ComponentType<{ size?: number; color?: string }>;
    iconSize?: number;
    bgColor: string;
    textColor: string;
    borderColor?: string;
    borderRadius: string;
    width: 'auto' | 'full';
    className?: string;
    action: 'share' | 'download' | 'copy-caption' | 'copy-link';
    isDisabled?: (selectedPlatform?: string) => boolean;
}

export interface SocialPlatformConfig {
    id: string;
    name: 'facebook' | 'linkedin' | 'twitter' | 'instagram' | 'copy-link';
    enabled: boolean;
}

export interface ShareModalConfig {
    title: string;
    description: string;
    shareLabel: string;
    contentComponent?: ReactNode;
    imageUrl?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    caption: string;
    shareUrl: string;
    shareTitle: string;
    socialPlatforms: SocialPlatformConfig[];
    actionButtons: ShareButtonConfig[];
    onDownload?: () => void | Promise<void>;
}

interface ShareModalProperties {
    visible: boolean;
    onHide: () => void;
    config: ShareModalConfig;
}

function ShareModal({ visible, onHide, config }: ShareModalProperties) {
    const {
        selectedPlatform,
        copied,
        isDownloading,
        shareButtonReferences,
        handleCopyLinkImmediate,
        handleIconClick,
        handleIconKeyDown,
        handleButtonClick,
        handleModalHide,
    } = useShareModal(config, onHide);

    const renderSocialIcon = (platform: SocialPlatformConfig) => {
        const isSelected = selectedPlatform === platform.name;
        const baseClasses = `share-icon-container ${isSelected ? 'share-icon-container--selected' : 'share-icon-container--unselected'}`;
        const specificClasses = platform.name === 'copy-link' ? 'share-icon-container--copy-link' : '';

        if (platform.name === 'instagram') {
            return (
                <div
                    key={platform.id}
                    ref={element => {
                        shareButtonReferences.current.instagram = element || undefined;
                    }}
                    onClick={event => handleIconClick(event, 'instagram')}
                    onKeyDown={event => handleIconKeyDown(event, 'instagram')}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer transition-all flex items-center justify-center rounded-full"
                    style={{
                        width: '32px',
                        height: '32px',
                        background: isSelected ? 'linear-gradient(45deg, #833AB4 0%, #E1306C 50%, #FCAF45 100%)' : 'transparent',
                        opacity: isSelected ? 1 : 0.6,
                    }}
                >
                    <div
                        style={{
                            filter: isSelected ? 'none' : 'grayscale(100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <InstagramLogo size={isSelected ? 24 : 32} color={isSelected ? '#FFFFFF' : 'currentColor'} />
                    </div>
                </div>
            );
        }

        if (platform.name === 'copy-link') {
            return (
                <div
                    key={platform.id}
                    ref={element => {
                        shareButtonReferences.current['copy-link'] = element || undefined;
                    }}
                    onClick={handleCopyLinkImmediate}
                    onKeyDown={event => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            handleCopyLinkImmediate(event);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`${baseClasses} ${specificClasses}`}
                >
                    <div className="share-icon-wrapper">
                        {copied ? (
                            <Check size={32} color={isSelected ? '#FFFFFF' : 'currentColor'} />
                        ) : (
                            <LinkSimple size={32} color={isSelected ? '#FFFFFF' : 'currentColor'} />
                        )}
                    </div>
                </div>
            );
        }

        let ShareButtonComponent: typeof FacebookShareButton | typeof LinkedinShareButton | typeof TwitterShareButton | undefined;
        let IconComponent: typeof FacebookIcon | typeof LinkedinIcon | typeof XIcon | undefined;

        switch (platform.name) {
            case 'facebook': {
                ShareButtonComponent = FacebookShareButton;
                IconComponent = FacebookIcon;
                break;
            }
            case 'linkedin': {
                ShareButtonComponent = LinkedinShareButton;
                IconComponent = LinkedinIcon;
                break;
            }
            case 'twitter': {
                ShareButtonComponent = TwitterShareButton;
                IconComponent = XIcon;
                break;
            }
            default: {
                break;
            }
        }

        if (!ShareButtonComponent || !IconComponent) {
            return;
        }

        // Prepare platform-specific props for sharing with image and caption.
        // Note: social networks pull preview images from the shared URL's OG tags.
        const getShareButtonProperties = () => {
            // If shareUrl is local or dev environment, fall back to the public image URL so scrapers can reach it.
            const isLocalOrDevelopment =
                config.shareUrl && (config.shareUrl.includes('localhost') || config.shareUrl.includes('dev-chances-frontend.8848digitalerp.com'));
            const effectiveShareUrl = isLocalOrDevelopment ? config.imageUrl || config.shareUrl || '' : config.shareUrl || '';

            // Use only the caption for the text description to avoid URL duplication on platforms that automatically append the shared URL.
            const captionText = config.caption || '';

            const baseProperties: Record<string, unknown> = {
                url: effectiveShareUrl,
            };

            switch (platform.name) {
                case 'facebook': {
                    // Facebook uses `quote` for accompanying text
                    if (captionText) {
                        baseProperties.quote = captionText;
                    }
                    break;
                }
                case 'linkedin': {
                    baseProperties.title = config.shareTitle;
                    if (captionText) {
                        baseProperties.summary = captionText;
                    }
                    break;
                }
                case 'twitter': {
                    // Twitter share button automatically appends the URL. We only provide the caption as the title (tweet body).
                    baseProperties.title = captionText || config.shareTitle;
                    break;
                }
                default: {
                    baseProperties.title = config.shareTitle;
                    break;
                }
            }

            return baseProperties;
        };

        const shareButtonProperties = getShareButtonProperties();

        return (
            <div
                key={platform.id}
                ref={element => {
                    shareButtonReferences.current[platform.name] = element || undefined;
                }}
                onClick={event => handleIconClick(event, platform.name)}
                onKeyDown={event => handleIconKeyDown(event, platform.name)}
                role="button"
                tabIndex={0}
                className={baseClasses}
            >
                <div className="share-icon-wrapper">
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <ShareButtonComponent {...(shareButtonProperties as { url: string; title: string; [key: string]: unknown })}>
                        <IconComponent size={32} round />
                    </ShareButtonComponent>
                </div>
            </div>
        );
    };

    return (
        <ModalWrapper
            visible={visible}
            onHide={handleModalHide}
            showCloseButton
            titleSize="2xl"
            titleWeight="bold"
            modalPadding="px-10 py-10"
            modalSize="md"
        >
            <div className="flex flex-col gap-4">
                <HeaderTitle text={config.title} size="2xl" weight="bold" color="text-primary-text" className="text-center" />
                {/* Description */}
                <p className="text-sm text-primary-text text-center w-[600px] mx-auto">{config.description}</p>
                {/* Share label */}
                {config.shareLabel && <h3 className="text-[16px] font-medium text-primary-text text-center">{config.shareLabel}</h3>}
                {/* Content - either custom component or image */}
                {config.contentComponent && <div className="flex justify-center">{config.contentComponent}</div>}
                {!config.contentComponent && config.imageUrl && (
                    <div className="flex justify-center">
                        <img
                            src={config.imageUrl}
                            alt={config.imageAlt || 'Share content'}
                            height={config.imageHeight || 440}
                            width={config.imageWidth || 310}
                            className="max-w-full h-auto rounded-lg shadow-lg"
                        />
                    </div>
                )}
                {/* Social Media Icons */}
                <div className="flex justify-center">
                    <div className="share-buttons-container">
                        {config.socialPlatforms.filter(platform => platform.enabled).map(platform => renderSocialIcon(platform))}
                    </div>
                </div>
                {/* Caption Text Box */}
                <div className="bg-gray-50 border border-gray-600 rounded-lg p-4">
                    <p className="text-sm text-primary-text">{config.caption}</p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    {config.actionButtons.map(buttonConfig => {
                        const IconComponent = buttonConfig.icon;
                        const isDisabledFromConfig = buttonConfig.isDisabled ? buttonConfig.isDisabled(selectedPlatform) : false;
                        const isDownloadButton = buttonConfig.action === 'download';
                        const isDisabled = isDisabledFromConfig || (isDownloadButton && isDownloading);
                        let buttonText = buttonConfig.label;
                        if (buttonConfig.action === 'copy-caption' && copied) {
                            buttonText = 'Copied!';
                        }
                        if (isDownloadButton && isDownloading) {
                            buttonText = 'Downloading...';
                        }
                        const buttonIcon =
                            buttonConfig.action === 'copy-caption' && copied ? (
                                <Check size={buttonConfig.iconSize || 16} />
                            ) : (
                                <IconComponent size={buttonConfig.iconSize || 16} />
                            );

                        return (
                            <ActionButton
                                key={buttonConfig.id}
                                type="button"
                                bgColor={buttonConfig.bgColor}
                                textColor={buttonConfig.textColor}
                                borderColor={buttonConfig.borderColor}
                                borderRadius={buttonConfig.borderRadius}
                                width={buttonConfig.width}
                                className={buttonConfig.className}
                                onClick={() => handleButtonClick(buttonConfig)}
                                isDisabled={isDisabled}
                            >
                                {buttonText}
                                {buttonIcon}
                            </ActionButton>
                        );
                    })}
                </div>
            </div>
        </ModalWrapper>
    );
}

export default ShareModal;
