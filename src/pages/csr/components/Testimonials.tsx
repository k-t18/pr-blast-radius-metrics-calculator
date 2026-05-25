import { useState, useMemo } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import SliderCard from './SliderCard';
import HeaderTitle from '../../../components/common/HeaderTitle';
import ShareModal from './ShareModal';
import { createTestimonialShareConfig } from '../config/shareModalConfigs';
import '../../../styles/csr/testimonials.css';

interface TestimonialData {
    id: string;
    quote: string;
    name: string;
    role: string;
    imageUrl: string;
    fullMessageUrl?: string;
}

const testimonialsData: TestimonialData[] = [
    {
        id: '1',
        quote: 'Our lives have been transformed by the access to clean water. Thank you for your unwavering support!',
        name: 'Name',
        role: 'Beneficiary / NGO partner name',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop',
        fullMessageUrl: 'https://example.com/message/1',
    },
    {
        id: '2',
        quote: 'Our lives have been transformed by the access to clean water. Thank you for your unwavering support!',
        name: 'Name',
        role: 'Beneficiary / NGO partner name',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop',
        fullMessageUrl: 'https://example.com/message/2',
    },
    {
        id: '3',
        quote: 'Our lives have been transformed by the access to clean water. Thank you for your unwavering support!',
        name: 'Name',
        role: 'Beneficiary / NGO partner name',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop',
        fullMessageUrl: 'https://example.com/message/3',
    },
    {
        id: '4',
        quote: 'Our lives have been transformed by the access to clean water. Thank you for your unwavering support!',
        name: 'Name',
        role: 'Beneficiary / NGO partner name',
        imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop',
        fullMessageUrl: 'https://example.com/message/4',
    },
];

function Testimonials() {
    const [isShareModalVisible, setIsShareModalVisible] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialData | undefined>();

    const handleShare = (testimonial: TestimonialData) => {
        setSelectedTestimonial(testimonial);
        setIsShareModalVisible(true);
    };

    // Create modal configuration when a testimonial is selected
    const shareModalConfig = useMemo(() => {
        if (!selectedTestimonial) {
            // Return a default config to ensure modal can always render
            return createTestimonialShareConfig({
                quote: '',
                name: '',
                role: '',
                imageUrl: '',
                ngoName: 'NGO Name',
                companyName: 'Your Company',
            });
        }
        return createTestimonialShareConfig({
            quote: selectedTestimonial.quote,
            name: selectedTestimonial.name,
            role: selectedTestimonial.role,
            imageUrl: selectedTestimonial.imageUrl,
            ngoName: 'NGO Name', // This would typically come from props or API
            companyName: 'Your Company', // This would typically come from props or API
        });
    }, [selectedTestimonial]);
    const [sliderReference] = useKeenSlider<HTMLDivElement>({
        loop: true,
        mode: 'free-snap',
        slides: {
            perView: 4,
            spacing: 24,
        },
        breakpoints: {
            '(max-width: 1024px)': {
                slides: {
                    perView: 3,
                    spacing: 20,
                },
            },
            '(max-width: 768px)': {
                slides: {
                    perView: 2,
                    spacing: 16,
                },
            },
            '(max-width: 640px)': {
                slides: {
                    perView: 1,
                    spacing: 12,
                },
            },
        },
    });

    return (
        <div>
            <div className="mb-4">
                <HeaderTitle text="Testimonials" size="xl" weight="bold" className="mb-2" />
                <p className="text-sm font-normal text-black">Personalized messages for your company by beneficiaries and NGO members</p>
            </div>
            <div ref={sliderReference} className="keen-slider">
                {testimonialsData.map(testimonial => (
                    <div key={testimonial.id} className="keen-slider__slide">
                        <SliderCard
                            quote={testimonial.quote}
                            name={testimonial.name}
                            role={testimonial.role}
                            imageUrl={testimonial.imageUrl}
                            fullMessageUrl={testimonial.fullMessageUrl}
                            onShare={() => handleShare(testimonial)}
                        />
                    </div>
                ))}
            </div>
            <ShareModal
                visible={isShareModalVisible && !!selectedTestimonial}
                onHide={() => {
                    setIsShareModalVisible(false);
                    // eslint-disable-next-line unicorn/no-useless-undefined
                    setSelectedTestimonial(undefined);
                }}
                config={shareModalConfig}
            />
        </div>
    );
}

export default Testimonials;
