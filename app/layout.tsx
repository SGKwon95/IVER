import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IVER - 아이버',
  description: '아이버 - 쇼핑몰 클론코딩 프로젝트',
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
