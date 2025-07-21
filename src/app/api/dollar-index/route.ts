import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Yahoo Finance API 호출 (서버 사이드에서는 CORS 제한 없음)
    const response = await fetch(
      'https://query1.finance.yahoo.com/v8/finance/chart/DX-Y.NYB',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        next: { revalidate: 300 } // 5분 캐시
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const currentPrice = result?.meta?.regularMarketPrice;

    if (currentPrice) {
      return NextResponse.json({
        value: parseFloat(currentPrice.toFixed(2)),
        timestamp: new Date().toISOString()
      });
    }

    throw new Error('No price data available');
  } catch (error) {
    console.error('Failed to fetch Dollar Index:', error);
    
    // 폴백: 대략적인 현재 달러 지수 값
    return NextResponse.json({
      value: 104.5,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
}