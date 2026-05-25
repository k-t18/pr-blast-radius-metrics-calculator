import { useState, useMemo } from 'react';
import '../../../styles/csr/certificateDownloadSection.css';
import ActionButton from '../../../components/common/ActionButton';
import { CircularLoader } from '../../../components/common/CircularLoader';
import certificateImage from '../../../../public/assets/images/certificate.png';
import ShareModal from './ShareModal';
import { createCertificateShareConfig } from '../config/shareModalConfigs';
import type { CertificateResponse } from '../../../interfaces/csr/certificate.types';
import { downloadCertificateWithAuth } from '../../../utils/certificateDownload';

interface CertificateDetailsSectionProperties {
    certificateData?: CertificateResponse;
    isLoading?: boolean;
    error?: Error | null;
    ngoName?: string;
    focusArea?: string;
}

function CertificateDetailsSection({ certificateData, isLoading, error, ngoName, focusArea }: CertificateDetailsSectionProperties) {
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Certificate data for share modal - use fetched data or fallback to defaults
    const shareModalCertificateData = useMemo(
        () => ({
            certificateImageUrl: certificateData?.image ?? certificateImage,
            certificateUrl: certificateData?.certificate ?? '',
            companyName: 'Your Company',
            ngoName: ngoName || 'NGO Name',
            focusArea: focusArea || 'Focus Area',
        }),
        [certificateData, ngoName, focusArea]
    );

    // Create modal configuration using JSON config
    const shareModalConfig = useMemo(() => createCertificateShareConfig(shareModalCertificateData), [shareModalCertificateData]);

    const handleDownloadCertificate = async () => {
        if (!certificateData?.certificate) return;

        setIsDownloading(true);
        try {
            await downloadCertificateWithAuth(certificateData.certificate);
        } finally {
            setIsDownloading(false);
        }
    };

    // Use fetched certificate image or fallback to default
    const displayImage = certificateData?.image ?? certificateImage;

    return (
        <>
            <div className="certificate-details-section">
                <div className="certificate-details-section-header">
                    <h2>Your CSR Contribution Has Been Recognised!</h2>
                    <p>
                        We&apos;re proud to present your official Chances CSR Certificate, a reflection of your commitment to doing good while growing
                        your brand&apos;s impact.
                    </p>
                    <div className="certificate-details-section-header-actions">
                        <ActionButton
                            type="button"
                            bgColor="bg-brand-500"
                            textColor="text-white"
                            width="auto"
                            className="download-certificate-button font-ubuntu"
                            onClick={handleDownloadCertificate}
                            disabled={isDownloading || !certificateData?.certificate || isLoading}
                        >
                            {isDownloading ? 'Downloading...' : 'Download Certificate'}
                        </ActionButton>
                        <ActionButton
                            type="button"
                            borderColor="border-black"
                            textColor="text-black"
                            width="auto"
                            className="share-on-socials-button font-ubuntu border-1 border-black"
                            onClick={() => setIsShareModalVisible(true)}
                            disabled={!certificateData || isLoading}
                        >
                            Share on Socials
                        </ActionButton>
                    </div>
                </div>
                <div className="certificate-details-section-image">
                    {(() => {
                        if (isLoading) {
                            return (
                                <div className="flex h-[137px] w-[194px] items-center justify-center rounded border border-gray-200 bg-gray-50">
                                    <CircularLoader label="" size={26} className="p-0" />
                                </div>
                            );
                        }
                        if (error) {
                            return (
                                <div className="flex h-[137px] w-[194px] items-center justify-center rounded border border-gray-200 bg-gray-50">
                                    <span className="text-sm text-red-500">Error loading certificate</span>
                                </div>
                            );
                        }
                        return <img src={displayImage} width={194} height={137} alt="Certificate" />;
                    })()}
                </div>
            </div>
            <ShareModal visible={isShareModalVisible} onHide={() => setIsShareModalVisible(false)} config={shareModalConfig} />
        </>
    );
}

export default CertificateDetailsSection;
