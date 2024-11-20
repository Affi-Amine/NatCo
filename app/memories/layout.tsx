// app/memories/layout.tsx
import React from 'react';

const MemoriesLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="memories-layout">
            <div>{children}</div>
        </div>
    );
};

export default MemoriesLayout;