import { NextRequest, NextResponse } from 'next/server';
import { 
  getLatestData, 
  getHistoricalData, 
  getAllHistoricalData,
  getDataStats 
} from '@/entities/crypto-history/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'latest';
    const indicator = searchParams.get('indicator') as 'btc_dominance' | 'kimchi_premium' | 'dollar_index';
    const hours = parseInt(searchParams.get('hours') || '24');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    switch (type) {
      case 'latest':
        // 최신 데이터 조회 (30분 이내)
        const latestData = await getLatestData();
        return NextResponse.json({
          success: true,
          data: latestData,
          isFresh: latestData ? true : false
        });

      case 'historical':
        // 특정 지표의 히스토리컬 데이터
        if (!indicator) {
          return NextResponse.json({
            success: false,
            error: 'indicator parameter is required for historical data'
          }, { status: 400 });
        }
        
        const historicalData = await getHistoricalData(indicator, hours);
        return NextResponse.json({
          success: true,
          data: historicalData,
          meta: {
            indicator,
            hours,
            count: historicalData.length
          }
        });

      case 'all':
        // 전체 데이터 (페이지네이션)
        const allData = await getAllHistoricalData(limit, offset);
        return NextResponse.json({
          success: true,
          data: allData,
          meta: {
            limit,
            offset,
            count: allData.length
          }
        });

      case 'stats':
        // 통계 정보
        if (!indicator) {
          return NextResponse.json({
            success: false,
            error: 'indicator parameter is required for stats'
          }, { status: 400 });
        }
        
        const stats = await getDataStats(indicator, hours);
        return NextResponse.json({
          success: true,
          data: stats,
          meta: {
            indicator,
            hours
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type parameter. Use: latest, historical, all, or stats'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Crypto history API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}