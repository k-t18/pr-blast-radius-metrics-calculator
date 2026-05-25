interface TestimonialCardProperties {
    quote: string;
    name: string;
    role: string;
    imageUrl: string;
}

function TestimonialCard({ quote, name, role, imageUrl }: TestimonialCardProperties) {
    return (
        <div className="flex rounded-lg border border-gray-300 overflow-hidden bg-white shadow-sm" style={{ maxWidth: '677px' }}>
            {/* Left Side - Quote (2/3) */}
            <div className="flex flex-col justify-center p-4" style={{ width: '50%' }}>
                <q className="text-xl font-bold text-black font-ubuntu">{quote}</q>
            </div>
            {/* Right Side - Beneficiary Info (1/3) */}
            <div className="flex flex-row items-center justify-center border-l border-gray-300" style={{ width: '50%', padding: '46px 16px' }}>
                <div className="">
                    <img src={imageUrl} alt={name} className="h-20 w-20 rounded-full object-cover" />
                </div>
                <div>
                    <p className="text-base font-medium text-black mb-1">{name}</p>
                    <p className="text-[12px] font-normal text-black text-center">{role}</p>
                </div>
            </div>
        </div>
    );
}

export default TestimonialCard;
