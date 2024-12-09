// app/memories/page.tsx

import VintageGallery from "@/components/VintageGallery";
import Menu from "@/components/menu/Menu";
import { bubblegum } from '@/lib/fonts';

const MemoriesPage: React.FC = () => {
    return (
        <div className="relative w-full h-screen bg-purple-200 overflow-hidden">
            {/* Header */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                <h1 className={`text-white text-[6vw] font-medium tracking-tighter leading-[1.75] text-center ${bubblegum.className}`}>
                    AIESEC Is People.
                </h1>
            </div>

            {/* Vintage Gallery */}
            <VintageGallery />

            {/* Menu */}
            <Menu />
        </div>
    );
};

export default MemoriesPage;