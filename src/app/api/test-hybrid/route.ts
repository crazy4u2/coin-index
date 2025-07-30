import { NextResponse } from 'next/server';
import { getBitcoinDominance, getKimchiPremium, getDollarIndex } from '@/entities/crypto/api';

export async function GET() {
  try {
    console.log('🧪 하이브리드 API 로직 테스트 시작...');
    
    const [btcDominance, kimchiPremium, dollarIndex] = await Promise.all([
      getBitcoinDominance(),
      getKimchiPremium(),
      getDollarIndex()
    ]);

    return NextResponse.json({
      success: true,
      message: '하이브리드 API 테스트 완료',
      data: {
        bitcoinDominance: {
          value: btcDominance.value,
          changePercent: btcDominance.changePercent,
          lastUpdated: btcDominance.lastUpdated,
          name: btcDominance.name
        },
        kimchiPremium: {
          value: kimchiPremium.value,
          changePercent: kimchiPremium.changePercent,
          lastUpdated: kimchiPremium.lastUpdated,
          name: kimchiPremium.name
        },
        dollarIndex: {
          value: dollarIndex.value,
          changePercent: dollarIndex.changePercent,
          lastUpdated: dollarIndex.lastUpdated,
          name: dollarIndex.name
        }
      },
      summary: `BTC: ${btcDominance.value}% | 김치: ${kimchiPremium.value}% | DXY: ${dollarIndex.value}`
    });

  } catch (error) {
    console.error('하이브리드 API 테스트 실패:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}