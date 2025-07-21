'use client';

import { useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import IndicatorTable from '@/components/IndicatorTable';
import IndicatorChart from '@/components/IndicatorChart';
import QueryErrorBoundary from '@/components/QueryErrorBoundary';
import LoadingSpinner, { TableLoadingSpinner, ChartLoadingSpinner } from '@/components/LoadingSpinner';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function Home() {
  const { 
    dashboardData, 
    chartData, 
    loading, 
    error, 
    lastUpdated, 
    refetch 
  } = useDashboardData(); // TanStack Query가 자동으로 캐싱과 갱신을 관리

  // BTC 가격 정보로 title과 favicon 동적 업데이트
  useEffect(() => {
    if (dashboardData?.cryptoPrices) {
      const btcData = dashboardData.cryptoPrices.find(crypto => crypto.symbol === 'BTC');
      if (btcData) {
        const price = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(btcData.price);
        
        const changePercent = btcData.changePercent24h;
        const trendIcon = changePercent >= 0 ? '🔴' : '🔵';
        const changeText = changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
        
        document.title = `${trendIcon} BTC ${price} (${changeText}) - 암호화폐 투자지표`;
        
        // Favicon도 추세에 따라 변경
        updateFavicon(changePercent >= 0 ? '🔴' : '🔵');
      }
    } else if (loading) {
      document.title = '📊 로딩 중... - 암호화폐 투자지표 대시보드';
      updateFavicon('📊');
    } else if (error) {
      document.title = '❌ 연결 오류 - 암호화폐 투자지표 대시보드';
      updateFavicon('❌');
    } else {
      document.title = '암호화폐 투자지표 대시보드';
      updateFavicon('₿');
    }
  }, [dashboardData?.cryptoPrices, loading, error]);

  // Favicon 업데이트 함수
  const updateFavicon = (emoji: string) => {
    const canvas = document.createElement('canvas');
    canvas.height = 64;
    canvas.width = 64;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = '40px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, 32, 32);
    }
    
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  // 전체 로딩 상태
  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  암호화폐 투자지표 대시보드
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  실시간 비트코인 도미넌스, 김치 프리미엄, 달러 인덱스 모니터링
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" message="대시보드 초기화 중..." className="py-20" />
        </main>
      </div>
    );
  }

  // 에러 상태
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  암호화폐 투자지표 대시보드
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  실시간 비트코인 도미넌스, 김치 프리미엄, 달러 인덱스 모니터링
                </p>
              </div>
              <div className="flex items-center gap-4">
                
                {error && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span>일부 데이터 로딩 실패</span>
                  </div>
                )}
                {lastUpdated && !error && (
                  <span className="text-sm text-gray-500">
                    마지막 업데이트: {lastUpdated.toLocaleTimeString('ko-KR')}
                  </span>
                )}
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* 테이블 섹션 */}
            {dashboardData ? (
              <IndicatorTable
                indicators={[
                  dashboardData.bitcoinDominance,
                  dashboardData.kimchiPremium,
                  dashboardData.dollarIndex
                ]}
                cryptoPrices={dashboardData.cryptoPrices}
              />
            ) : (
              <TableLoadingSpinner />
            )}

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {chartData.btcDominance.length > 0 ? (
                <IndicatorChart
                  title="비트코인 도미넌스 (현재)"
                  data={chartData.btcDominance}
                  color="#f7931a"
                  unit="%"
                  showKoreanColors={true}
                />
              ) : (
                <ChartLoadingSpinner />
              )}
              
              {chartData.kimchiPremium.length > 0 ? (
                <IndicatorChart
                  title="김치 프리미엄 (현재)"
                  data={chartData.kimchiPremium}
                  color="#6b7280"
                  unit="%"
                  showKoreanColors={true}
                />
              ) : (
                <ChartLoadingSpinner />
              )}
              
              {chartData.dollarIndex.length > 0 ? (
                <IndicatorChart
                  title="달러 인덱스 (현재)"
                  data={chartData.dollarIndex}
                  color="#6b7280"
                  unit="DXY"
                  showKoreanColors={true}
                />
              ) : (
                <ChartLoadingSpinner />
              )}
            </div>

            {/* 정보 섹션 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">지표 설명</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">비트코인 도미넌스</h4>
                  <p className="text-sm text-gray-600">
                    전체 암호화폐 시가총액 대비 비트코인 시가총액 비율. 
                    비트코인의 시장 지배력을 나타내는 지표입니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">김치 프리미엄</h4>
                  <p className="text-sm text-gray-600">
                    국내 거래소와 해외 거래소 간 비트코인 가격 차이. 
                    국내 투자자들의 암호화폐에 대한 관심도를 반영합니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">달러 인덱스</h4>
                  <p className="text-sm text-gray-600">
                    주요 통화 대비 미국 달러의 강도를 측정하는 지표. 
                    리스크 자산인 암호화폐와 역상관 관계를 보이는 경우가 많습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </QueryErrorBoundary>
  );
}
