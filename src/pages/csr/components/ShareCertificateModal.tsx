import { useState, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, XIcon } from 'react-share';
import ModalWrapper from '../../../components/common/ModalWrapper';
import ActionButton from '../../../components/common/ActionButton';
import { Download, ShareNetwork, Check, Copy, LinkSimple } from '../../../components/icons';
import '../../../styles/csr/csrModal.css';
import HeaderTitle from '../../../components/common/HeaderTitle';

interface ShareCertificateModalProperties {
    visible: boolean;
    onHide: () => void;
    certificateImageUrl: string;
    companyName?: string;
    ngoName?: string;
    focusArea?: string;
}

function ShareCertificateModal({
    visible,
    onHide,
    certificateImageUrl,
    companyName = 'Your Company',
    ngoName = 'NGO Name',
    focusArea = 'Focus Area',
}: ShareCertificateModalProperties) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | undefined>();
    const [copied, setCopied] = useState(false);
    const shareButtonReferences = useRef<{ [key: string]: HTMLDivElement | undefined }>({
        linkedin: undefined,
        facebook: undefined,
        twitter: undefined,
        instagram: undefined,
        'copy-link': undefined,
    });

    // Generate share URL - you can customize this based on your needs
    const shareUrl = window.location.href;
    const shareTitle = `Proud to partner with ${ngoName} through Chances to make a difference in ${focusArea}. Every action counts! 🌍 #CSR #ChancesForChange`;
    const caption = `Proud to partner with ${ngoName} through Chances to make a difference in ${focusArea}. Every action counts! 🌍 #CSR #ChancesForChange`;

    const handleCopyCaption = async () => {
        try {
            await navigator.clipboard.writeText(caption);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = caption;
            document.body.append(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadCertificate = () => {
        const link = document.createElement('a');
        link.href = certificateImageUrl;
        link.download = `CSR-Certificate-${companyName}-${new Date().getFullYear()}.png`;
        document.body.append(link);
        link.click();
        link.remove();
    };

    const handleIconClick = (event: React.MouseEvent, platform: string) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedPlatform(platform);
    };

    const handleIconKeyDown = (event: React.KeyboardEvent, platform: string) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setSelectedPlatform(platform);
        }
    };

    const handleShare = () => {
        if (!selectedPlatform) return;

        // Handle Instagram share
        if (selectedPlatform === 'instagram') {
            // Instagram doesn't have a direct share API, but we can open Instagram with a pre-filled caption
            // Note: Instagram web doesn't support direct sharing, so we'll open the Instagram website
            // Users can manually share the certificate image and caption
            window.open('https://www.instagram.com/', '_blank');
            return;
        }

        // Handle copy link functionality
        if (selectedPlatform === 'copy-link') {
            // Copy link functionality (not a social platform, so manual code is acceptable)
            navigator.clipboard.writeText(shareUrl).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = shareUrl;
                document.body.append(textArea);
                textArea.select();
                document.execCommand('copy');
                textArea.remove();
            });
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return;
        }

        // Trigger the react-share button programmatically for social media platforms
        const reference = shareButtonReferences.current[selectedPlatform];
        if (reference) {
            const button = reference.querySelector('button');
            if (button) {
                button.click();
            }
        }
    };

    const handleModalHide = () => {
        // eslint-disable-next-line unicorn/no-useless-undefined
        setSelectedPlatform(undefined);
        setCopied(false);
        onHide();
    };

    return (
        <ModalWrapper visible={visible} onHide={handleModalHide} showCloseButton titleSize="2xl" titleWeight="bold" modalPadding="p-10">
            <div className="flex flex-col gap-4">
                <HeaderTitle
                    text="You've Earned It! Share Your CSR Certificate"
                    size="2xl"
                    weight="bold"
                    color="text-primary-text"
                    className="text-center"
                />
                {/* Description */}
                <p className="text-sm text-primary-text text-center w-[600px] mx-auto">
                    Congratulations on completing your CSR commitment with Chances! Celebrate your impact and inspire others to join the movement.
                </p>
                {/* Share this Certificate text */}
                <h3 className="text-[16px] font-medium text-primary-text text-center">Share this Certificate</h3>
                {/* Certificate Image */}
                <div className="flex justify-center">
                    <img
                        src={certificateImageUrl}
                        alt="CSR Certificate"
                        height={440}
                        width={310}
                        className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex justify-center">
                    <div className="share-buttons-container">
                        <div
                            ref={element => {
                                shareButtonReferences.current.facebook = element || undefined;
                            }}
                            onClick={event => handleIconClick(event, 'facebook')}
                            onKeyDown={event => handleIconKeyDown(event, 'facebook')}
                            role="button"
                            tabIndex={0}
                            className={`share-icon-container ${selectedPlatform === 'facebook' ? 'share-icon-container--selected' : 'share-icon-container--unselected'}`}
                        >
                            <div className="share-icon-wrapper">
                                <FacebookShareButton url={shareUrl} title={shareTitle} style={{ margin: 0, padding: 0 }}>
                                    <FacebookIcon size={32} round />
                                </FacebookShareButton>
                            </div>
                        </div>
                        <div
                            ref={element => {
                                shareButtonReferences.current.linkedin = element || undefined;
                            }}
                            onClick={event => handleIconClick(event, 'linkedin')}
                            onKeyDown={event => handleIconKeyDown(event, 'linkedin')}
                            role="button"
                            tabIndex={0}
                            className={`share-icon-container ${selectedPlatform === 'linkedin' ? 'share-icon-container--selected' : 'share-icon-container--unselected'}`}
                        >
                            <div className="share-icon-wrapper">
                                <LinkedinShareButton url={shareUrl} title={shareTitle} style={{ margin: 0, padding: 0 }}>
                                    <LinkedinIcon size={32} round />
                                </LinkedinShareButton>
                            </div>
                        </div>
                        <div
                            ref={element => {
                                shareButtonReferences.current.twitter = element || undefined;
                            }}
                            onClick={event => handleIconClick(event, 'twitter')}
                            onKeyDown={event => handleIconKeyDown(event, 'twitter')}
                            role="button"
                            tabIndex={0}
                            className={`share-icon-container ${selectedPlatform === 'twitter' ? 'share-icon-container--selected' : 'share-icon-container--unselected'}`}
                        >
                            <div className="share-icon-wrapper">
                                <TwitterShareButton url={shareUrl} title={shareTitle} style={{ margin: 0, padding: 0 }}>
                                    <XIcon size={32} round />
                                </TwitterShareButton>
                            </div>
                        </div>
                        {/* <div
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
                                background:
                                    selectedPlatform === 'instagram'
                                        ? 'linear-gradient(45deg, #833AB4 0%, #E1306C 50%, #FCAF45 100%)'
                                        : 'transparent',
                                opacity: selectedPlatform === 'instagram' ? 1 : 0.6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div
                                style={{
                                    filter: selectedPlatform === 'instagram' ? 'none' : 'grayscale(100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                    margin: 0,
                                    padding: 0,
                                }}
                            >
                                <InstagramLogo
                                    size={selectedPlatform === 'instagram' ? 24 : 32}
                                    color={selectedPlatform === 'instagram' ? '#FFFFFF' : 'currentColor'}
                                />
                            </div>
                        </div> */}
                        <div
                            ref={element => {
                                shareButtonReferences.current['copy-link'] = element || undefined;
                            }}
                            onClick={event => handleIconClick(event, 'copy-link')}
                            onKeyDown={event => handleIconKeyDown(event, 'copy-link')}
                            role="button"
                            tabIndex={0}
                            className={`share-icon-container share-icon-container--copy-link ${selectedPlatform === 'copy-link' ? 'share-icon-container--selected' : 'share-icon-container--unselected'}`}
                        >
                            <div className="share-icon-wrapper">
                                <LinkSimple size={32} color={selectedPlatform === 'copy-link' ? '#FFFFFF' : 'currentColor'} />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Caption Text Box */}
                <div className="bg-gray-50 border border-gray-600 rounded-lg p-4">
                    <p className="text-sm text-primary-text">{caption}</p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <ActionButton
                        type="button"
                        bgColor="bg-brand-500"
                        textColor="text-white"
                        borderRadius="rounded-sm"
                        width="full"
                        className="font-ubuntu px-6 text-[12px]"
                        onClick={handleShare}
                        isDisabled={!selectedPlatform}
                    >
                        Share
                        <ShareNetwork size={16} />
                    </ActionButton>

                    <ActionButton
                        type="button"
                        borderColor="border-gray-300"
                        textColor="text-primary-text"
                        borderRadius="rounded-sm"
                        bgColor="bg-white"
                        width="full"
                        className="font-ubuntu px-6 text-[12px]"
                        onClick={handleDownloadCertificate}
                    >
                        Download Certificate
                        <Download size={16} />
                    </ActionButton>

                    <ActionButton
                        type="button"
                        borderColor="border-gray-300"
                        textColor="text-primary-text"
                        borderRadius="rounded-sm"
                        bgColor="bg-white"
                        width="full"
                        className="font-ubuntu px-6 text-[12px]"
                        onClick={handleCopyCaption}
                    >
                        {copied ? (
                            <>
                                Copied!
                                <Check size={16} />
                            </>
                        ) : (
                            <>
                                Copy Caption
                                <Copy size={16} />
                            </>
                        )}
                    </ActionButton>
                </div>
            </div>
        </ModalWrapper>
    );
}

export default ShareCertificateModal;
