// Social share icon renderer extracted for reusability
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, FacebookIcon, LinkedinIcon, XIcon } from 'react-share';
import type { ShareModalConfig, SocialPlatformConfig } from '../../components/ShareModal';
import { LinkSimple, Check } from '../../../../components/icons';

export type SocialIconProperties = {
    platform: SocialPlatformConfig;
    shareModalConfig: ShareModalConfig | null;
    copied: boolean;
    onCopyLink: () => void;
};

export function SocialIcon({ platform, shareModalConfig, copied, onCopyLink }: SocialIconProperties) {
    if (!shareModalConfig) return null;

    if (platform.name === 'copy-link') {
        return (
            <div
                key={platform.id}
                onClick={onCopyLink}
                onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onCopyLink();
                    }
                }}
                role="button"
                tabIndex={0}
                className={`share-icon-container share-icon-container--copy-link ${copied ? 'share-icon-container--copied' : ''}`}
                style={{ filter: 'none', opacity: 1 }}
            >
                <div className="share-icon-wrapper">
                    {copied ? <Check size={32} color="currentColor" /> : <LinkSimple size={32} color="currentColor" />}
                </div>
            </div>
        );
    }

    const shareUrl = shareModalConfig.shareUrl || '';

    switch (platform.name) {
        case 'facebook': {
            return (
                <div key={platform.id} className="share-icon-container share-icon-container--selected">
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <FacebookShareButton url={shareUrl} {...(shareModalConfig.caption ? { quote: shareModalConfig.caption } : {})}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </div>
            );
        }
        case 'linkedin': {
            return (
                <div key={platform.id} className="share-icon-container share-icon-container--selected">
                    <LinkedinShareButton url={shareUrl} title={shareModalConfig.shareTitle} summary={shareModalConfig.caption}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                </div>
            );
        }
        case 'twitter': {
            return (
                <div key={platform.id} className="share-icon-container share-icon-container--selected">
                    <TwitterShareButton url={shareUrl} title={shareModalConfig.caption}>
                        <XIcon size={32} round />
                    </TwitterShareButton>
                </div>
            );
        }
        default: {
            return null;
        }
    }
}
