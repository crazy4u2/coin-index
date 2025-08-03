import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "암호화폐 투자지표 대시보드",
    template: "%s | 암호화폐 투자지표 대시보드"
  },
  description: "실시간 비트코인 도미넌스, 김치 프리미엄, 달러 인덱스를 모니터링하는 암호화폐 투자지표 대시보드입니다. 한국 투자자를 위한 특화된 지표와 분석을 제공합니다.",
  keywords: ["암호화폐", "비트코인", "김치프리미엄", "비트코인도미넌스", "달러인덱스", "투자지표", "대시보드", "실시간"],
  authors: [{ name: "Coin Index Team" }],
  creator: "Coin Index",
  publisher: "Coin Index",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://coin-index-alpha.vercel.app",
    siteName: "암호화폐 투자지표 대시보드",
    title: "암호화폐 투자지표 대시보드",
    description: "실시간 비트코인 도미넌스, 김치 프리미엄, 달러 인덱스를 모니터링하는 투자지표 대시보드",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "암호화폐 투자지표 대시보드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "암호화폐 투자지표 대시보드",
    description: "실시간 비트코인 도미넌스, 김치 프리미엄, 달러 인덱스 모니터링",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "",
    other: {
      "naver-site-verification": "",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
