import axios from 'axios';
import { coinGeckoClient, upbitClient, binanceClient, withErrorHandling, withRetry, API_ENDPOINTS } from './api-client';

// API 응답 타입 정의
interface CoinGeckoGlobalResponse {
  data: {
    market_cap_percentage: {
      btc: number;
    };
  };
}

interface UpbitTickerResponse {
  trade_price: number;
}

interface BinanceTickerResponse {
  price: string;
}

// Binance 24시간 티커 응답 타입은 제거됨 (CoinGecko 우선 정책으로 미사용)

interface CoinGeckoMarketResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number;
  ath: number;
  ath_date: string;
  ath_change_percentage: number;
}

// 실시간 USD/KRW 환율 조회
const fetchUSDKRWRate = async (): Promise<number | null> => {
  try {
    // 무료 환율 API 사용 (exchangerate-api.com)
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    return response.data.rates.KRW || null;
  } catch (error) {
    console.error('Failed to fetch USD/KRW rate:', error);
    // 폴백: 대략적인 현재 환율 (실제 서비스에서는 사용하지 말 것)
    return 1330;
  }
};

// 비트코인 도미넌스 API 호출
export const fetchBitcoinDominance = async (): Promise<number | null> => {
  const data = await withRetry(
    () => withErrorHandling(
      () => coinGeckoClient.get<CoinGeckoGlobalResponse>(API_ENDPOINTS.COINGECKO.GLOBAL),
      'Failed to fetch Bitcoin dominance'
    )
  );
  
  return data?.data?.market_cap_percentage?.btc ?? null;
};

// 비트코인 히스토리컬 도미넌스 데이터 - Supabase DB 우선, 외부 API 백업
export const fetchBitcoinDominanceHistory = async (days: number = 365): Promise<{ timestamp: string; value: number }[] | null> => {
  try {
    // 먼저 Supabase에서 히스토리컬 데이터 조회
    const { getHistoricalData } = await import('@/entities/crypto-history/api');
    const hours = days * 24; // 일수를 시간으로 변환
    const historicalData = await getHistoricalData('btc_dominance', hours);
    
    if (historicalData && historicalData.length > 0) {
      console.log(`📈 Using DB historical data for Bitcoin dominance (${historicalData.length} points)`);
      return historicalData;
    }
  } catch (error) {
    console.warn('Failed to fetch Bitcoin dominance history from DB:', error);
  }

  // DB에 데이터가 없으면 외부 API 시도 (현재는 지원하지 않음)
  console.warn(`Bitcoin dominance historical data requires CoinMarketCap Pro API or similar service (requested ${days} days)`);
  return null;
};

// 업비트 BTC 가격 조회
export const fetchUpbitBTCPrice = async (): Promise<number | null> => {
  const data = await withRetry(
    () => withErrorHandling(
      () => upbitClient.get<UpbitTickerResponse[]>(`${API_ENDPOINTS.UPBIT.TICKER}?markets=KRW-BTC`),
      'Failed to fetch Upbit BTC price'
    )
  );

  return data?.[0]?.trade_price ?? null;
};

// 바이낸스 BTC 가격 조회
export const fetchBinanceBTCPrice = async (): Promise<number | null> => {
  const data = await withRetry(
    () => withErrorHandling(
      () => binanceClient.get<BinanceTickerResponse>(`${API_ENDPOINTS.BINANCE.TICKER_PRICE}?symbol=BTCUSDT`),
      'Failed to fetch Binance BTC price'
    )
  );

  return data ? parseFloat(data.price) : null;
};

// 김치 프리미엄 계산 (서버사이드 API Route 사용하여 CORS 해결)
export const calculateKimchiPremium = async (): Promise<{
  premium: number;
  upbitPrice: number;
  binancePrice: number;
} | null> => {
  try {
    // Next.js API Route를 통해 서버 사이드에서 김치 프리미엄 계산
    const response = await axios.get('/api/kimchi-premium', { timeout: 15000 });
    
    if (response.data?.success && response.data?.data) {
      const { premium, upbitPrice, binancePrice } = response.data.data;
      return {
        premium,
        upbitPrice,
        binancePrice
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch Kimchi Premium via internal API:', error);
    return null;
  }
};

// 레거시: 직접 외부 API 호출 (CORS 문제로 사용 안함)
export const calculateKimchiPremiumLegacy = async (): Promise<{
  premium: number;
  upbitPrice: number;
  binancePrice: number;
} | null> => {
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
};

// 김치 프리미엄 히스토리컬 데이터 - Supabase DB 우선, 외부 API 백업
export const fetchKimchiPremiumHistory = async (days: number = 365): Promise<{ timestamp: string; value: number }[] | null> => {
  try {
    // 먼저 Supabase에서 히스토리컬 데이터 조회
    const { getHistoricalData } = await import('@/entities/crypto-history/api');
    const hours = days * 24; // 일수를 시간으로 변환
    const historicalData = await getHistoricalData('kimchi_premium', hours);
    
    if (historicalData && historicalData.length > 0) {
      console.log(`📈 Using DB historical data for Kimchi premium (${historicalData.length} points)`);
      return historicalData;
    }
  } catch (error) {
    console.warn('Failed to fetch Kimchi premium history from DB:', error);
  }

  // DB에 데이터가 없으면 외부 API 시도 (현재는 지원하지 않음)
  console.warn(`Kimchi Premium historical data requires Upbit and Binance historical APIs (requested ${days} days)`);
  return null;
};

// 달러 인덱스 현재값 조회 (내부 API Route 사용)
export const fetchCurrentDollarIndex = async (): Promise<number | null> => {
  try {
    // Next.js API Route를 통해 서버 사이드에서 Yahoo Finance API 호출
    const response = await axios.get('/api/dollar-index', { timeout: 10000 });
    
    if (response.data?.value) {
      return response.data.value;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch Dollar Index via internal API:', error);
    return null;
  }
};

// 달러 인덱스 히스토리컬 데이터 - Supabase DB 우선, FRED API 백업
export const fetchDollarIndexHistory = async (days: number = 365): Promise<{ timestamp: string; value: number }[] | null> => {
  try {
    // 먼저 Supabase에서 히스토리컬 데이터 조회
    const { getHistoricalData } = await import('@/entities/crypto-history/api');
    const hours = days * 24; // 일수를 시간으로 변환
    const historicalData = await getHistoricalData('dollar_index', hours);
    
    if (historicalData && historicalData.length > 0) {
      console.log(`📈 Using DB historical data for Dollar Index (${historicalData.length} points)`);
      return historicalData;
    }
  } catch (error) {
    console.warn('Failed to fetch Dollar Index history from DB:', error);
  }

  // DB에 데이터가 없으면 FRED API 시도
  const FRED_API_KEY = process.env.NEXT_PUBLIC_FRED_API_KEY;
  
  if (!FRED_API_KEY) {
    console.warn('Dollar Index historical data requires FRED API key. Set NEXT_PUBLIC_FRED_API_KEY environment variable');
    return null;
  }

  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const response = await axios.get(
      `https://api.stlouisfed.org/fred/series/observations?series_id=DEXUSEU&api_key=${FRED_API_KEY}&file_type=json&start_date=${startDate}&end_date=${endDate}`
    );

    const observations = response.data?.observations;
    if (!observations) return null;

    return observations
      .filter((obs: { value: string }) => obs.value !== '.')
      .map((obs: { date: string; value: string }) => ({
        timestamp: obs.date,
        value: parseFloat(obs.value)
      }));
  } catch (error) {
    console.error('Failed to fetch Dollar Index history from FRED:', error);
    return null;
  }
};

// Binance 24시간 티커 데이터 조회 (현재 미사용 - CoinGecko 우선 정책으로 변경)
export const fetchBinanceCryptoMarkets = async (): Promise<CoinGeckoMarketResponse[] | null> => {
  console.warn('Binance crypto markets function is deprecated. Using CoinGecko as primary source.');
  return null;
};

// CoinGecko 암호화폐 시장 데이터 조회 (정확한 ATH 데이터 포함)
export const fetchCryptoMarketsLegacy = async (): Promise<CoinGeckoMarketResponse[] | null> => {
  const params = new URLSearchParams({
    vs_currency: 'usd',
    ids: 'bitcoin,ethereum,ripple,cardano,solana,ondo-finance',
    order: 'market_cap_desc',
    per_page: '6',
    page: '1',
    sparkline: 'false',
    price_change_percentage: '24h',
    include_24hr_vol: 'true',
    include_market_cap: 'true',
    include_ath: 'true',
    include_ath_date: 'true',
    include_ath_change_percentage: 'true'
  });

  const data = await withRetry(
    () => withErrorHandling(
      () => coinGeckoClient.get<CoinGeckoMarketResponse[]>(`${API_ENDPOINTS.COINGECKO.MARKETS}?${params}`),
      'Failed to fetch crypto markets'
    )
  );

  return data;
};

// 암호화폐 시장 데이터 조회 (CoinGecko 우선, 정확한 ATH 데이터 제공)
export const fetchCryptoMarkets = async (): Promise<CoinGeckoMarketResponse[] | null> => {
  // CoinGecko API를 주 데이터 소스로 사용 (정확한 ATH 데이터 제공)
  console.log('Fetching crypto data from CoinGecko API (primary source)');
  return await fetchCryptoMarketsLegacy();
};

// APIService 객체로 래핑 (기존 코드와의 호환성)
export const APIService = {
  fetchBitcoinDominance,
  fetchBitcoinDominanceHistory,
  fetchUpbitBTCPrice,
  fetchBinanceBTCPrice,
  calculateKimchiPremium,
  fetchKimchiPremiumHistory,
  fetchCurrentDollarIndex,
  fetchDollarIndexHistory,
  fetchCryptoMarkets
};