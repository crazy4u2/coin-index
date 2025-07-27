// scripts/collect-crypto-data.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '.env.local' });

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

// 기존 API 함수들 임포트 (절대 경로로 수정 필요)
async function fetchBitcoinDominance() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/global');
    const data = await response.json();
    return data.data.market_cap_percentage.btc;
  } catch (error) {
    console.error('Bitcoin dominance fetch failed:', error);
    return null;
  }
}

async function fetchUpbitBTCPrice() {
  try {
    const response = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC');
    const data = await response.json();
    return data[0].trade_price;
  } catch (error) {
    console.error('Upbit BTC price fetch failed:', error);
    return null;
  }
}

async function fetchBinanceBTCPrice() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Binance BTC price fetch failed:', error);
    return null;
  }
}

async function fetchUSDKRWRate() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const data = await response.json();
    return data.rates.KRW;
  } catch (error) {
    console.error('USD/KRW rate fetch failed:', error);
    return 1330; // 대략적인 현재 환율
  }
}

async function fetchCryptoMarkets() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,cardano,solana&order=market_cap_desc&per_page=5&page=1');
    return await response.json();
  } catch (error) {
    console.error('Crypto markets fetch failed:', error);
    return null;
  }
}

async function calculateKimchiPremium() {
  const [upbitPrice, binancePrice, usdKrwRate] = await Promise.all([
    fetchUpbitBTCPrice(),
    fetchBinanceBTCPrice(),
    fetchUSDKRWRate()
  ]);

  if (!upbitPrice || !binancePrice || !usdKrwRate) {
    return null;
  }

  const binancePriceKRW = binancePrice * usdKrwRate;
  const premium = ((upbitPrice - binancePriceKRW) / binancePriceKRW) * 100;

  return {
    premium,
    upbitPrice,
    binancePrice: binancePriceKRW
  };
}

async function collectCryptoData() {
  try {
    console.log(`🚀 [${new Date().toISOString()}] 암호화폐 데이터 수집 시작...`);
    
    // 모든 데이터를 병렬로 수집
    const [
      btcDominance,
      kimchiData,
      cryptoMarkets
    ] = await Promise.allSettled([
      fetchBitcoinDominance(),
      calculateKimchiPremium(),
      fetchCryptoMarkets()
    ]);

    // 결과 처리
    const btcDominanceValue = btcDominance.status === 'fulfilled' ? btcDominance.value : null;
    const kimchiPremiumData = kimchiData.status === 'fulfilled' ? kimchiData.value : null;
    const marketsData = cryptoMarkets.status === 'fulfilled' ? cryptoMarkets.value : null;

    // BTC 가격 정보 추출
    const btcData = marketsData?.find(coin => coin.id === 'bitcoin');

    // DB에 저장할 데이터 구성
    const record = {
      timestamp: new Date().toISOString(),
      btc_dominance: btcDominanceValue,
      btc_dominance_change: null, // 이전 값과 비교는 나중에 구현
      kimchi_premium: kimchiPremiumData?.premium,
      kimchi_premium_change: null,
      dollar_index: 104.0, // Mock 값 (실제 API 연동 필요)
      dollar_index_change: null,
      btc_price: btcData?.current_price,
      btc_change_24h: btcData?.price_change_percentage_24h,
      crypto_prices: marketsData ? JSON.stringify(marketsData.map(coin => ({
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap
      }))) : null,
      collection_source: 'github-actions',
      api_health: {
        coingecko: btcDominanceValue ? 'ok' : 'failed',
        upbit: kimchiPremiumData?.upbitPrice ? 'ok' : 'failed',
        binance: kimchiPremiumData?.premium !== null ? 'ok' : 'failed',
        markets: marketsData ? 'ok' : 'failed'
      }
    };

    // Supabase에 데이터 저장
    console.log('💾 Supabase에 데이터 저장 중...');
    const { data, error } = await supabase
      .from('crypto_hourly_data')
      .insert([record])
      .select();

    if (error) {
      console.error('❌ 데이터 저장 실패:', error);
      throw error;
    }

    console.log('✅ 데이터 수집 및 저장 완료!');
    console.log('📊 수집된 데이터:');
    console.log(`   - BTC 도미넌스: ${btcDominanceValue?.toFixed(2)}%`);
    console.log(`   - 김치 프리미엄: ${kimchiPremiumData?.premium?.toFixed(2)}%`);
    console.log(`   - BTC 가격: $${btcData?.current_price?.toLocaleString()}`);
    console.log(`   - 레코드 ID: ${data[0].id}`);

    return { success: true, record: data[0] };

  } catch (error) {
    console.error('💥 데이터 수집 실패:', error);
    return { success: false, error: error.message };
  }
}

// 스크립트가 직접 실행될 때만 수집 함수 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  collectCryptoData()
    .then((result) => {
      if (result.success) {
        console.log('🎉 성공적으로 완료되었습니다!');
        process.exit(0);
      } else {
        console.error('❌ 실패:', result.error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ 예상치 못한 오류:', error);
      process.exit(1);
    });
}

export { collectCryptoData };