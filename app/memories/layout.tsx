// app/memories/layout.tsx
import React from 'react';

const MemoriesLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="memories-layout">
            {/* You can add a header, footer, or any other layout components here */}
            <h1 className="text-center text-3xl text-white">Memories Gallery</h1>
            <div>{children}</div>
        </div>
    );
};

export default MemoriesLayout;