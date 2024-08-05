import type {Metadata} from 'next';
import './globals.css';
import Header from '@/_components/Header';
import GTM from '@/_components/GTM';

export const metadata: Metadata = {
    metadataBase: new URL(process.env.BASE_URL as string),
    title: {
        template: '%s｜公式メディアテンプレート',
        default: '公式メディアテンプレート',
    },
    description: 'Next.js製のメディア向けスケルトンテンプレートです',
    openGraph: {
        title: '公式メディアテンプレート',
        description: 'Next.js製のメディア向けスケルトンテンプレートです',
        type: 'website',
        images: '/ogp.png',
    },
    twitter: {
        card: 'summary_large_image',
    },
    alternates: {
        canonical: '/',
    },
};

// const isProduction: boolean = process.env.NODE_ENV === 'production';
const gtmId = process.env.NEXT_PUBLIC_GTM_ID || ''

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ja">
        <head>
            <GTM gtmId={gtmId}/>
        </head>
        {/* {isProduction && (
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000"
          crossOrigin="anonymous"
        />
      )} */}
        <body>
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{display: 'none', visibility: 'hidden'}}
            />
        </noscript>
        <Header/>
        {children}
        </body>
        </html>
    );
}
