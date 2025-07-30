import { NextResponse } from 'next/server';

// 업비트 BTC 가격 조회
async function fetchUpbitBTCPrice(): Promise<number | null> {
  try {
    const response = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC', {
      signal: AbortSignal.timeout(8000), // 8초 타임아웃
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'coin-index/1.0'
      }
    });
    if (!response.ok) throw new Error(`Upbit API error: ${response.status}`);

    const data = await response.json();
    return data[0]?.trade_price || null;
  } catch (error) {
    console.error('Upbit BTC price fetch failed:', error);
    return null;
  }
}

// 바이낸스 BTC 가격 조회
async function fetchBinanceBTCPrice(): Promise<number | null> {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
      signal: AbortSignal.timeout(8000), // 8초 타임아웃
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'coin-index/1.0'
      }
    });
    if (!response.ok) throw new Error(`Binance API error: ${response.status}`);

    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Binance BTC price fetch failed:', error);
    return null;
  }
}

// USD/KRW 환율 조회
async function fetchUSDKRWRate(): Promise<number | null> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: AbortSignal.timeout(8000), // 8초 타임아웃
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'coin-index/1.0'
      }
    });
    if (!response.ok) throw new Error(`Exchange rate API error: ${response.status}`);

    const data = await response.json();
    return data.rates?.KRW || 1330; // 폴백 환율
  } catch (error) {
    console.error('USD/KRW rate fetch failed:', error);
    return 1330; // 대략적인 현재 환율
  }
}

export async function GET() {
  console.log('Kimchi Premium API called at:', new Date().toISOString());
  
  try {
    // 모든 데이터를 병렬로 가져오기 (Promise.allSettled 사용하여 부분 실패 허용)
    const results = await Promise.allSettled([
      fetchUpbitBTCPrice(),
      fetchBinanceBTCPrice(),
      fetchUSDKRWRate(),
    ]);

    const upbitPrice = results[0].status === 'fulfilled' ? results[0].value : null;
    const binancePrice = results[1].status === 'fulfilled' ? results[1].value : null;
    const usdKrwRate = results[2].status === 'fulfilled' ? results[2].value : null;

    console.log('API fetch results:', {
      upbitPrice: upbitPrice || 'FAILED',
      binancePrice: binancePrice || 'FAILED', 
      usdKrwRate: usdKrwRate || 'FAILED'
    });

    // 에러 로그 상세 출력
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const apis = ['Upbit', 'Binance', 'ExchangeRate'];
        console.error(`${apis[index]} API failed:`, result.reason);
      }
    });

    if (!upbitPrice || !binancePrice || !usdKrwRate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch required data',
          details: {
            upbitPrice: !!upbitPrice,
            binancePrice: !!binancePrice,
            usdKrwRate: !!usdKrwRate,
          },
          errors: results.map((result, index) => ({
            api: ['upbit', 'binance', 'exchangerate'][index],
            status: result.status,
            error: result.status === 'rejected' ? result.reason?.message : null
          }))
        },
        { status: 503 }
      );
    }

    // 김치 프리미엄 계산
    const binancePriceKRW = binancePrice * usdKrwRate;
    const premium = ((upbitPrice - binancePriceKRW) / binancePriceKRW) * 100;

    console.log('Kimchi Premium calculated successfully:', premium);

    return NextResponse.json({
      success: true,
      data: {
        premium: parseFloat(premium.toFixed(2)),
        upbitPrice,
        binancePrice: binancePriceKRW,
        usdKrwRate,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Kimchi Premium API critical error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
