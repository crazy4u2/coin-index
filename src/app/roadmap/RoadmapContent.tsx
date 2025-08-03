'use client';

import Link from 'next/link';
import { ArrowLeft, TrendingUp, Bell, BarChart3, Target, Users, Zap, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function RoadmapContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              대시보드로 돌아가기
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                제품 로드맵
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                암호화폐 투자지표 대시보드의 미래 계획
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vision Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">우리의 비전</h2>
          <p className="text-lg mb-6">
            단순한 정보 제공을 넘어, <strong>실제 투자 결정을 도와주는 AI 어시스턴트</strong>로 진화하여 
            한국 암호화폐 투자자들에게 특화된 인사이트를 제공합니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <Target className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">투자 신호 생성</h3>
              <p className="text-sm opacity-90">데이터 기반 매매 타이밍 제공</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <TrendingUp className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">개인화된 분석</h3>
              <p className="text-sm opacity-90">포트폴리오 맞춤 인사이트</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Zap className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">실시간 알림</h3>
              <p className="text-sm opacity-90">중요한 신호 즉시 전달</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
            현재 구현된 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">실시간 데이터 수집</h3>
                <p className="text-sm text-gray-600">비트코인 도미넌스, 김치 프리미엄, 달러 인덱스</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">히스토리컬 차트</h3>
                <p className="text-sm text-gray-600">7일간 데이터 시각화 및 트렌드 분석</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">자동 데이터 수집</h3>
                <p className="text-sm text-gray-600">GitHub Actions 기반 시간별 자동화</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">안정적인 인프라</h3>
                <p className="text-sm text-gray-600">Supabase 기반 데이터 저장 및 에러 핸들링</p>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">개발 로드맵</h2>

          {/* Phase 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 text-green-500 mr-2" />
                  1단계: 투자 신호 생성 시스템 (1-2주)
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  즉시 시작 가능
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                기존 데이터를 활용하여 실시간 투자 신호를 생성하고 표시합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Bell className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">김치 프리미엄 신호</h4>
                    <p className="text-sm text-gray-600">8% 이상 과열, -2% 이하 저평가 구간 알림</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">도미넌스 기반 신호</h4>
                    <p className="text-sm text-gray-600">알트코인 시즌 vs 비트코인 집중 구간 판별</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">신호 정확도 추적</h4>
                    <p className="text-sm text-gray-600">과거 신호의 성과 분석 및 정확도 개선</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">신호 강도 표시</h4>
                    <p className="text-sm text-gray-600">약함, 보통, 강함 단계별 신호 세분화</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 text-blue-500 mr-2" />
                  2단계: 개인 포트폴리오 추적 (2-4주)
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  단기 구현
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                사용자별 포트폴리오 관리 및 지표 기반 맞춤 분석을 제공합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">실시간 손익 계산</h4>
                    <p className="text-sm text-gray-600">보유 코인별 현재 가치 및 수익률 표시</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">리스크 평가</h4>
                    <p className="text-sm text-gray-600">지표 기반 포트폴리오 위험도 분석</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">리밸런싱 제안</h4>
                    <p className="text-sm text-gray-600">현재 지표 상황에 맞는 포트폴리오 조정 제안</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">성과 추적</h4>
                    <p className="text-sm text-gray-600">일일/주간/월간 수익률 변화 기록</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 text-yellow-500 mr-2" />
                  3단계: 고급 분석 및 예측 (1-2개월)
                </h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  중기 구현
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                머신러닝과 통계 분석을 통한 예측 및 패턴 분석 기능을 제공합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">상관관계 분석</h4>
                    <p className="text-sm text-gray-600">지표 간 상관성 시각화 및 패턴 발견</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">단기 예측</h4>
                    <p className="text-sm text-gray-600">통계 모델 기반 1-3일 예측</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">백테스팅 시스템</h4>
                    <p className="text-sm text-gray-600">투자 전략 과거 성과 시뮬레이션</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Bell className="w-5 h-5 text-indigo-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">텔레그램 알림</h4>
                    <p className="text-sm text-gray-600">중요 신호 실시간 모바일 푸시</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="w-6 h-6 text-purple-500 mr-2" />
                  4단계: 커뮤니티 및 고급 기능 (2개월+)
                </h3>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  장기 구현
                </span>
              </div>
              <p className="text-gray-700 mb-4">
                사용자 커뮤니티 구축 및 AI 기반 고급 분석 기능을 제공합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Users className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">투자 아이디어 공유</h4>
                    <p className="text-sm text-gray-600">커뮤니티 기반 투자 인사이트 교환</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <TrendingUp className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">포트폴리오 랭킹</h4>
                    <p className="text-sm text-gray-600">수익률 기반 리더보드 및 경쟁</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BarChart3 className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">AI 투자 어시스턴트</h4>
                    <p className="text-sm text-gray-600">개인 맞춤형 투자 조언 및 전략 제안</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Target className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">전문가 큐레이션</h4>
                    <p className="text-sm text-gray-600">검증된 투자 전문가 의견 및 분석</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mt-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            함께 만들어가는 투자 플랫폼
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            이 로드맵은 사용자 피드백과 시장 변화에 따라 지속적으로 업데이트됩니다. 
            여러분의 의견과 제안을 통해 더 나은 투자 도구를 만들어가겠습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              대시보드 체험하기
            </Link>
            <a
              href="https://github.com/crazy4u2/coin-index"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Users className="w-5 h-5 mr-2" />
              GitHub에서 기여하기
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}