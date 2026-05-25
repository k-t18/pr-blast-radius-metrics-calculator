import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center bg-brand-50 h-full">
            <div className="max-w-md w-full text-center">
                <div className="flex flex-col items-center">
                    {/* Large 404 */}
                    <span className="text-[8rem] font-extrabold leading-none text-brand-200 drop-shadow-sm select-none">404</span>
                    {/* Brand-colored border with sunshine accent */}
                    <div className="w-24 h-2 rounded-lg mt-2 mb-8 bg-sunshine-400 shadow" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-700 mb-2">Oops! Page not found</h1>
                <p className="text-lg text-gray-700 mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    <br />
                    Let&apos;s get you back to safety.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-base shadow transition duration-200"
                >
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
}
