import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderTitle from '../../../components/common/HeaderTitle';
import SponsorshipTypeCard from './components/SponsorshipTypeCard';
import { sponsorshipTypes, type SponsorshipType } from './dataset/mobileSponsorshipData';

export default function MobileSponsorshipPage() {
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<SponsorshipType | undefined>();

    const handleCardClick = (type: SponsorshipType) => {
        setSelectedType(type);
        navigate(`/sponsorship-type/mobile-sponsorship/${type.id}`);
    };

    return (
        <div className="flex flex-col gap-6 px-6">
            <HeaderTitle text="Select Sponsorship Type" size="2xl" weight="medium" className="leading-8" />
            <div className="flex flex-col gap-6">
                {sponsorshipTypes.map(type => (
                    <SponsorshipTypeCard key={type.id} type={type} onClick={handleCardClick} isSelected={selectedType?.id === type.id} />
                ))}
            </div>
        </div>
    );
}
