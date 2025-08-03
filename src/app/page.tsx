import type { Metadata } from 'next';
import MainDashboard from '@/views/main/page';

export const metadata: Metadata = {
  title: "실시간 암호화폐 투자지표 대시보드",
  description: "비트코인 도미넌스, 김치 프리미엄, 달러 인덱스를 실시간으로 모니터링하세요. 한국 투자자를 위한 전문적인 암호화폐 투자 지표와 차트를 제공합니다.",
  keywords: ["실시간", "암호화폐", "비트코인 도미넌스", "김치 프리미엄", "달러 인덱스", "투자지표", "차트", "모니터링"],
  openGraph: {
    title: "실시간 암호화폐 투자지표 대시보드",
    description: "비트코인 도미넌스, 김치 프리미엄, 달러 인덱스를 실시간으로 모니터링하세요.",
    url: "https://coin-index-alpha.vercel.app",
    images: [
      {
        url: "/og-dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "암호화폐 투자지표 대시보드 메인 화면",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "실시간 암호화폐 투자지표 대시보드",
    description: "비트코인 도미넌스, 김치 프리미엄, 달러 인덱스 실시간 모니터링",
    images: ["/og-dashboard.jpg"],
  },
};

export default function Home() {
  return <MainDashboard />;
}
