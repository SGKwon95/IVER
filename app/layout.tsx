import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IVER - 아이버',
  description: '하이버 - 브랜드 패션 최저가 쇼핑몰',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-[#121212] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
