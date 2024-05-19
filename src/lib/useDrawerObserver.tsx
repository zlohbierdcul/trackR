import { useEffect } from "react";

// This code somehow fixes a bug where the height of the DrawerContent gets a fixed value, when the drawer resizes while an input is focused
export const useDrawerObserver = () => {
    let mutationObserver: MutationObserver;

    if (typeof window !== 'undefined') {
        mutationObserver = new window.MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const node = mutation.target as unknown as HTMLElement;
                if (node.style.height) {
                    node.style.removeProperty('height');
                }
            });
        });
    }

    useEffect(() => {
        const drawerContent = document.getElementById('drawer-content');
        if (drawerContent && mutationObserver) {
            mutationObserver.observe(drawerContent, {
                attributes: true,
                attributeFilter: ['style'],
            });
        }
    }, []);
}