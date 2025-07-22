import { DashboardData, ChartDataPoint, BitcoinDominance, KimchiPremium, DollarIndex, CryptoPriceData } from '@/shared/types/crypto';
import { 
  fetchBitcoinDominance, 
  fetchBitcoinDominanceHistory,
  calculateKimchiPremium,
  fetchKimchiPremiumHistory,
  fetchCurrentDollarIndex,
  fetchDollarIndexHistory,
  fetchCryptoMarkets
} from '@/shared/api/api-services';
import { MockDataGenerator } from './mock-data';

// 이전 값들을 저장하기 위한 간단한 캐시 (함수형)
const dataCache = new Map<string, number>();

const cacheUtils = {
  set: (key: string, value: number) => {
    dataCache.set(key, value);
  },
  get: (key: string): number | undefined => {
    return dataCache.get(key);
  },
  clear: () => {
    dataCache.clear();
  }
};

// 비트코인 도미넌스 가져오기
export const getBitcoinDominance = async (): Promise<BitcoinDominance> => {
  const dominance = await fetchBitcoinDominance();
  
  if (dominance !== null) {
    const previousValue = cacheUtils.get('btc-dominance') || dominance * 0.99;
    const change = dominance - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
    
    cacheUtils.set('btc-dominance', dominance);
    
    return {
      name: 'Bitcoin Dominance',
      value: parseFloat(dominance.toFixed(2)),
      previousValue: parseFloat(previousValue.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      unit: '%',
      lastUpdated: new Date()
    };
  }

  // API 실패 시 Mock 데이터 반환
  console.warn('Using mock data for Bitcoin dominance');
  return MockDataGenerator.getBitcoinDominance();
};

// 김치 프리미엄 계산
export const getKimchiPremium = async (): Promise<KimchiPremium> => {
  const kimchiData = await calculateKimchiPremium();
  
  if (kimchiData) {
    const { premium, upbitPrice, binancePrice } = kimchiData;
    const previousPremium = cacheUtils.get('kimchi-premium') || premium * 0.95;
    const change = premium - previousPremium;
    const changePercent = previousPremium !== 0 ? (change / Math.abs(previousPremium)) * 100 : 0;
    
    cacheUtils.set('kimchi-premium', premium);
    
    return {
      name: 'Kimchi Premium',
      value: parseFloat(premium.toFixed(2)),
      previousValue: parseFloat(previousPremium.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      unit: '%',
      upbitPrice,
      binancePrice,
      lastUpdated: new Date()
    };
  }

  // API 실패 시 Mock 데이터 반환
  console.warn('Using mock data for Kimchi premium');
  return MockDataGenerator.getKimchiPremium();
};

// 달러 인덱스 (실제 데이터 사용)
export const getDollarIndex = async (): Promise<DollarIndex> => {
  const currentDXY = await fetchCurrentDollarIndex();
  
  if (currentDXY !== null) {
    const previousValue = cacheUtils.get('dollar-index') || currentDXY * 0.998;
    const change = currentDXY - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
    
    cacheUtils.set('dollar-index', currentDXY);
    
    return {
      name: 'Dollar Index',
      value: parseFloat(currentDXY.toFixed(2)),
      previousValue: parseFloat(previousValue.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      unit: 'DXY',
      lastUpdated: new Date()
    };
  }

  // API 실패 시 Mock 데이터 반환
  console.warn('Using mock data for Dollar Index - Yahoo Finance API failed');
  return MockDataGenerator.getDollarIndex();
};

// 주요 암호화폐 가격 정보
export const getCryptoPrices = async (): Promise<CryptoPriceData[]> => {
  const marketData = await fetchCryptoMarkets();
  
  if (marketData && marketData.length > 0) {
    return marketData.map(coin => ({
      symbol: coin.symbol.toUpperCase(),
      price: coin.current_price,
      previousPrice: coin.current_price - (coin.price_change_24h || 0),
      change24h: coin.price_change_24h || 0,
      changePercent24h: coin.price_change_percentage_24h || 0,
      volume24h: coin.total_volume || 0,
      marketCap: coin.market_cap || 0,
      lastUpdated: new Date()
    }));
  }

  // API 실패 시 Mock 데이터 반환
  console.warn('Using mock data for crypto prices');
  return MockDataGenerator.getCryptoPrices();
};

// 전체 대시보드 데이터
export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const [bitcoinDominance, kimchiPremium, dollarIndex, cryptoPrices] = await Promise.allSettled([
      getBitcoinDominance(),
      getKimchiPremium(),
      getDollarIndex(),
      getCryptoPrices()
    ]);

    return {
      bitcoinDominance: bitcoinDominance.status === 'fulfilled' 
        ? bitcoinDominance.value 
        : MockDataGenerator.getBitcoinDominance(),
      kimchiPremium: kimchiPremium.status === 'fulfilled' 
        ? kimchiPremium.value 
        : MockDataGenerator.getKimchiPremium(),
      dollarIndex: dollarIndex.status === 'fulfilled' 
        ? dollarIndex.value 
        : MockDataGenerator.getDollarIndex(),
      cryptoPrices: cryptoPrices.status === 'fulfilled' 
        ? cryptoPrices.value 
        : MockDataGenerator.getCryptoPrices()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // 전체 실패 시 완전한 Mock 데이터 세트 반환
    return {
      bitcoinDominance: MockDataGenerator.getBitcoinDominance(),
      kimchiPremium: MockDataGenerator.getKimchiPremium(),
      dollarIndex: MockDataGenerator.getDollarIndex(),
      cryptoPrices: MockDataGenerator.getCryptoPrices()
    };
  }
};

// 차트용 히스토리 데이터
export const getChartData = async (indicator: string, days: number = 7): Promise<ChartDataPoint[]> => {
  let realData: { timestamp: string; value: number }[] | null = null;

  // 실제 히스토리컬 데이터 시도
  switch (indicator) {
    case 'btc-dominance':
      realData = await fetchBitcoinDominanceHistory(days);
      break;
    case 'kimchi-premium':
      realData = await fetchKimchiPremiumHistory(days);
      break;
    case 'dollar-index':
      realData = await fetchDollarIndexHistory(days);
      break;
  }

  // 실제 데이터가 있으면 사용, 없으면 현재값으로만 구성된 단일 포인트 차트 생성
  if (realData && realData.length > 0) {
    return realData;
  }

  // 히스토리컬 데이터가 없으면 현재값만으로 단일 포인트 차트 생성
  const today = new Date().toISOString().split('T')[0];
  let currentValue = 0;

  switch (indicator) {
    case 'btc-dominance':
      const btcDominance = await getBitcoinDominance();
      currentValue = btcDominance.value;
      break;
    case 'kimchi-premium':
      const kimchiPremium = await getKimchiPremium();
      currentValue = kimchiPremium.value;
      break;
    case 'dollar-index':
      const dollarIndex = await getDollarIndex();
      currentValue = dollarIndex.value;
      break;
  }

  console.warn(`No historical data available for ${indicator}, showing current value only`);
  return [{
    timestamp: today,
    value: currentValue
  }];
};

// CryptoAPI 객체로 래핑 (기존 코드와의 호환성)
export const CryptoAPI = {
  getBitcoinDominance,
  getKimchiPremium, 
  getDollarIndex,
  getCryptoPrices,
  getDashboardData,
  getChartData
};