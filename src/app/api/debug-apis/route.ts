import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const api = searchParams.get('api');
  
  console.log('Debug API called for:', api);

  try {
    switch (api) {
      case 'upbit':
        console.log('Testing Upbit API...');
        const upbitResponse = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
        console.log('Upbit response status:', upbitResponse.status);
        
        if (!upbitResponse.ok) {
          throw new Error(`Upbit API error: ${upbitResponse.status}`);
        }
        
        const upbitData = await upbitResponse.json();
        console.log('Upbit data received:', !!upbitData);
        
        return NextResponse.json({
          success: true,
          api: 'upbit',
          data: upbitData[0]?.trade_price || null
        });

      case 'binance':
        console.log('Testing Binance API...');
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        console.log('Binance response status:', binanceResponse.status);
        
        if (!binanceResponse.ok) {
          throw new Error(`Binance API error: ${binanceResponse.status}`);
        }
        
        const binanceData = await binanceResponse.json();
        console.log('Binance data received:', !!binanceData);
        
        return NextResponse.json({
          success: true,
          api: 'binance',
          data: parseFloat(binanceData.price)
        });

      case 'exchange':
        console.log('Testing Exchange Rate API...');
        const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        console.log('Exchange rate response status:', exchangeResponse.status);
        
        if (!exchangeResponse.ok) {
          throw new Error(`Exchange rate API error: ${exchangeResponse.status}`);
        }
        
        const exchangeData = await exchangeResponse.json();
        console.log('Exchange rate data received:', !!exchangeData);
        
        return NextResponse.json({
          success: true,
          api: 'exchange',
          data: exchangeData.rates?.KRW || null
        });

      case 'all':
        console.log('Testing all APIs...');
        const results = await Promise.allSettled([
          fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
          fetch('https://api.exchangerate-api.com/v4/latest/USD')
        ]);

        const testResults = results.map((result, index) => ({
          api: ['upbit', 'binance', 'exchange'][index],
          status: result.status,
          success: result.status === 'fulfilled' && result.value.ok,
          error: result.status === 'rejected' ? result.reason?.message : null
        }));

        return NextResponse.json({
          success: true,
          testResults
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid API parameter. Use ?api=upbit|binance|exchange|all'
        });
    }
  } catch (error) {
    console.error(`Debug API error for ${api}:`, error);
    return NextResponse.json({
      success: false,
      api,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}