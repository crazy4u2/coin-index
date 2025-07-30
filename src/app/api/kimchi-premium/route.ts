import { NextResponse } from 'next/server';

// 업비트 BTC 가격 조회
async function fetchUpbitBTCPrice(): Promise<number | null> {
  try {
    const response = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
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
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
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
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) throw new Error(`Exchange rate API error: ${response.status}`);

    const data = await response.json();
    return data.rates?.KRW || 1330; // 폴백 환율
  } catch (error) {
    console.error('USD/KRW rate fetch failed:', error);
    return 1330; // 대략적인 현재 환율
  }
}

export async function GET() {
  console.log('Kimchi Premium API called');
  
  // 단순 테스트: 하드코딩된 데이터 반환
  try {
    return NextResponse.json({
      success: true,
      data: {
        premium: -0.5,
        upbitPrice: 163000000,
        binancePrice: 163500000,
        usdKrwRate: 1390,
        timestamp: new Date().toISOString(),
        note: 'Hardcoded test data'
      },
    });
  } catch (error) {
    console.error('Critical error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed'
    }, { status: 500 });
  }
}
