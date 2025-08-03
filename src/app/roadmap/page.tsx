import type { Metadata } from 'next';
import RoadmapContent from './RoadmapContent';

export const metadata: Metadata = {
  title: "제품 로드맵",
  description: "암호화폐 투자지표 대시보드의 미래 기능 명세서와 개발 계획을 확인하세요. 투자 신호 생성, 포트폴리오 추적, AI 기반 예측 등 새로운 기능들이 계획되어 있습니다.",
  keywords: ["로드맵", "제품계획", "투자신호", "포트폴리오", "AI예측", "백테스팅", "커뮤니티", "개발계획"],
  openGraph: {
    title: "암호화폐 대시보드 로드맵 - 미래 기능 계획",
    description: "투자 신호 생성, 포트폴리오 추적, AI 기반 예측 등 새로운 기능들이 계획되어 있습니다.",
    url: "https://coin-index-alpha.vercel.app/roadmap",
    images: [
      {
        url: "/og-roadmap.jpg",
        width: 1200,
        height: 630,
        alt: "암화폐 대시보드 로드맵",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "암호화폐 대시보드 로드맵",
    description: "투자 신호, 포트폴리오 추적, AI 예측 등 새로운 기능 계획",
    images: ["/og-roadmap.jpg"],
  },
};

export default function RoadmapPage() {
  return <RoadmapContent />;
}