import '~/styles/globals.css';

import { Montserrat } from 'next/font/google';

import { TRPCReactProvider } from '~/trpc/react';
import LeftNav from './_components/navigation/left-nav';
import { Viewport } from 'next';

export const dynamic = 'force-dynamic';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata = {
    title: 'TrackR',
    description: 'Simple expense tracker',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

// export const viewport: Viewport = {
//     maximumScale: 1
// }   

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <html lang="en">
            <body className={`font-sans ${montserrat.variable}`}>
                <TRPCReactProvider>
                    <LeftNav></LeftNav>
                    {children}
                </TRPCReactProvider>
            </body>
        </html>
    );
}
