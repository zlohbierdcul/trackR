'use client';

import { useState, useEffect } from 'react';

interface WindowDimensions {
    width: number;
    height: number;
}

function getWindowDimensions(): WindowDimensions {
    if (typeof window !== 'undefined') {
        const { innerWidth: width, innerHeight: height } = global.window;
        return {
            width,
            height,
        };
    }
    return {
        width: 0,
        height: 0
    }
}

export default function useWindowDimensions(): WindowDimensions {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions(),
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
