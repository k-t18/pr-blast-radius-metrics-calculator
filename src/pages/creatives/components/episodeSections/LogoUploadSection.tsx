import HeaderTitle from '../../../../components/common/HeaderTitle';
import ImageUploadBox from '../../../../components/form-fields/fileUpload/ImageUploadBox';
import type { CreativeEpisode } from '../../../../interfaces/creatives/creatives.types';

interface LogoUploadSectionProperties {
    episode: CreativeEpisode;
    onFileChange: (file: File | undefined | string) => void;
}

function LogoUploadSection({ episode, onFileChange }: LogoUploadSectionProperties) {
    return (
        <section className="px-5 mt-4">
            <HeaderTitle text="Upload Logo" size="md" weight="medium" disabled={false} className="leading-6 font-poppins" />
            <div className="mt-4">
                <ImageUploadBox episode={episode} onFileChange={onFileChange} />
            </div>
        </section>
    );
}

export default LogoUploadSection;
