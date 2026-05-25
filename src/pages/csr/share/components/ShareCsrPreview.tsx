import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useCsrShareData, { generateCsrShareUrl } from '../../hooks/useCsrShareData';
import type { ShareModalConfig, SocialPlatformConfig } from '../../components/ShareModal';
import { SocialIcon } from './SocialIcon';
import { CurrencySymbol } from '../../../../components/common/CurrencySymbol';
import { CurrencyAmount } from '../../../../components/common/CurrencyAmount';
import StatusBadge from '../../../../components/common/StatusBadge';
import ActionButton from '../../../../components/common/ActionButton';
import { ArrowLeft } from '../../../../components/icons';
import '../../../../styles/csr/shareCSRPage.css';
import '../../../../styles/csr/csrModal.css';
import HeaderTitle from '../../../../components/common/HeaderTitle';

function ShareCsrPreview() {
    const [urlSearchParameters] = useSearchParams();
    const navigate = useNavigate();

    // Get CSR ID from URL
    const csrId = urlSearchParameters.get('id') || '';

    // Fetch data using custom hook
    const { shareData, isLoading, error } = useCsrShareData({
        csrId,
        enabled: !!csrId,
    });

    // Create ShareModalConfig for useShareModal hook
    const shareModalConfig = useMemo<ShareModalConfig | null>(() => {
        if (!shareData) return null;

        const shareUrl = generateCsrShareUrl(shareData);
        const shareCaption = `Proud to partner with ${shareData.ngoName} through Chances to make a difference in ${shareData.focusArea}. Every action counts! 🌍 #CSR #ChancesForChange`;

        return {
            title: 'Share Your Impact!',
            description: 'Celebrate your partnership and inspire others to join the movement.',
            shareLabel: 'Share this Certificate',
            imageUrl: shareData.imageUrl,
            imageAlt: `${shareData.ngoName} Partnership`,
            imageWidth: 310,
            imageHeight: 440,
            caption: shareCaption,
            shareUrl,
            shareTitle: shareCaption,
            socialPlatforms: [
                { id: 'facebook', name: 'facebook', enabled: true },
                { id: 'linkedin', name: 'linkedin', enabled: true },
                { id: 'twitter', name: 'twitter', enabled: true },
                { id: 'copy-link', name: 'copy-link', enabled: true },
            ] as SocialPlatformConfig[],
            actionButtons: [],
        };
    }, [shareData]);

    const [copied, setCopied] = useState(false);

    // Handle copy link
    const handleCopyLink = async () => {
        if (!shareModalConfig) return;
        const textContent = `${shareModalConfig.caption}\n\n${shareModalConfig.shareUrl}`;
        try {
            await navigator.clipboard.writeText(textContent);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            document.body.append(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="share-csr-page">
                <div className="share-csr-container">
                    <div className="share-csr-loading">
                        <div className="share-csr-spinner" />
                        <p>Loading share preview...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if no CSR ID provided
    if (!csrId) {
        return (
            <div className="share-csr-page">
                <div className="share-csr-container">
                    <div className="share-csr-error">
                        <h2>Invalid Share Link</h2>
                        <p>No CSR ID provided in the share link.</p>
                        <ActionButton bgColor="bg-brand-500" textColor="text-white" borderRadius="rounded-md" width="auto" onClick={handleBackToHome}>
                            <ArrowLeft size={16} />
                            Go to Homepage
                        </ActionButton>
                    </div>
                </div>
            </div>
        );
    }

    // Show error if API call failed or no data
    if (error || (!isLoading && !shareData)) {
        const errorMessage = error?.message || 'Unable to load certificate data. The share link may be invalid or expired.';
        return (
            <div className="share-csr-page">
                <div className="share-csr-container">
                    <div className="share-csr-error">
                        <h2>Unable to Load Share Preview</h2>
                        <p>{errorMessage}</p>
                        <ActionButton bgColor="bg-brand-500" textColor="text-white" borderRadius="rounded-md" width="auto" onClick={handleBackToHome}>
                            <ArrowLeft size={16} />
                            Go to Homepage
                        </ActionButton>
                    </div>
                </div>
            </div>
        );
    }

    // Type guard: shareData and shareModalConfig must exist at this point
    if (!shareData || !shareModalConfig) {
        return null;
    }

    return (
        <div className="share-csr-page">
            {/* Main Content */}
            <main className="share-csr-main">
                <div className="share-csr-container">
                    {/* Title Section */}
                    <div className="share-csr-title-section">
                        <HeaderTitle text="Share Your Impact!" size="2xl" weight="bold" color="text-primary-text" className="text-center" />
                        <p className="share-csr-subtitle text-md">Making a difference through corporate social responsibility</p>
                    </div>

                    {/* Social Media Icons */}
                    <div className="share-csr-social-icons mb-3">
                        <div className="flex justify-end">
                            <div className="share-buttons-container">
                                {shareModalConfig.socialPlatforms
                                    .filter(platform => platform.enabled)
                                    .map(platform => (
                                        <SocialIcon
                                            key={platform.id}
                                            platform={platform}
                                            shareModalConfig={shareModalConfig}
                                            copied={copied}
                                            onCopyLink={handleCopyLink}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                    {/* Certificate Card */}
                    <div className="share-csr-card">
                        {/* Certificate Image */}
                        {shareData.imageUrl && (
                            <div className="share-csr-image-container">
                                <img
                                    src={shareData.imageUrl}
                                    alt={`${shareData.ngoName} CSR Certificate`}
                                    className="share-csr-image"
                                    height={440}
                                    width={310}
                                />
                            </div>
                        )}

                        {/* Certificate Details */}
                        <div className="share-csr-details">
                            <div className="share-csr-detail-row">
                                <span className="share-csr-label">NGO Partner</span>
                                <span className="share-csr-value share-csr-value--highlight">{shareData.ngoName}</span>
                            </div>

                            {shareData.focusArea && (
                                <div className="share-csr-detail-row">
                                    <span className="share-csr-label">Focus Area</span>
                                    <StatusBadge
                                        label={shareData.focusArea}
                                        bgColor="#E6E6FA"
                                        textColor="#6A0DAD"
                                        borderColor="#E6E6FA"
                                        variant="filled"
                                        shape="square"
                                        showIcon={false}
                                        className="text-sm"
                                    />
                                </div>
                            )}

                            {shareData.csrAmount && (
                                <div className="share-csr-detail-row">
                                    <span className="share-csr-label">CSR Amount</span>
                                    <span className="share-csr-value flex items-center gap-1">
                                        <CurrencySymbol />
                                        <CurrencyAmount value={shareData.csrAmount} className="font-medium" />
                                    </span>
                                </div>
                            )}

                            {shareData.episode && (
                                <div className="share-csr-detail-row">
                                    <span className="share-csr-label">Episode</span>
                                    <span className="share-csr-value">{shareData.episode}</span>
                                </div>
                            )}

                            {shareData.status && (
                                <div className="share-csr-detail-row">
                                    <span className="share-csr-label">Status</span>
                                    <StatusBadge statusKey={shareData.status} variant="filled" shape="square" className="text-sm" />
                                </div>
                            )}

                            {shareData.csrId && (
                                <div className="share-csr-detail-row">
                                    <span className="share-csr-label">CSR ID</span>
                                    <span className="share-csr-value share-csr-value--muted">{shareData.csrId}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ShareCsrPreview;
