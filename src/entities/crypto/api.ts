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
import { getLatestData, isDataFresh } from '@/entities/crypto-history/api';

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

// 비트코인 도미넌스 가져오기 (DB 우선, 실시간 API 백업)
export const getBitcoinDominance = async (): Promise<BitcoinDominance> => {
  try {
    // 1. DB에서 최신 데이터 확인 (30분 이내)
    const latestData = await getLatestData();
    
    if (latestData && latestData.btc_dominance !== null && isDataFresh(latestData.created_at, 30)) {
      console.log('📊 Using DB data for Bitcoin dominance');
      
      // 이전 값 계산 (캐시에서 또는 이전 DB 데이터에서)
      const previousValue = cacheUtils.get('btc-dominance') || latestData.btc_dominance * 0.99;
      const change = latestData.btc_dominance - previousValue;
      const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
      
      cacheUtils.set('btc-dominance', latestData.btc_dominance);
      
      return {
        name: 'Bitcoin Dominance',
        value: parseFloat(latestData.btc_dominance.toFixed(2)),
        previousValue: parseFloat(previousValue.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        unit: '%',
        lastUpdated: new Date(latestData.created_at)
      };
    }
  } catch (error) {
    console.warn('DB data fetch failed, falling back to real-time API:', error);
  }

  // 2. DB 데이터가 없거나 오래됐으면 실시간 API 사용
  console.log('🔄 Using real-time API for Bitcoin dominance');
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

  // 3. 모든 방법이 실패하면 Mock 데이터 반환
  console.warn('Using mock data for Bitcoin dominance');
  return MockDataGenerator.getBitcoinDominance();
};

// 김치 프리미엄 계산 (DB 우선, 실시간 API 백업)
export const getKimchiPremium = async (): Promise<KimchiPremium> => {
  try {
    // 1. DB에서 최신 데이터 확인 (30분 이내)
    const latestData = await getLatestData();
    
    if (latestData && latestData.kimchi_premium !== null && isDataFresh(latestData.created_at, 30)) {
      console.log('📊 Using DB data for Kimchi premium');
      
      const previousPremium = cacheUtils.get('kimchi-premium') || latestData.kimchi_premium * 0.95;
      const change = latestData.kimchi_premium - previousPremium;
      const changePercent = previousPremium !== 0 ? (change / Math.abs(previousPremium)) * 100 : 0;
      
      cacheUtils.set('kimchi-premium', latestData.kimchi_premium);
      
      return {
        name: 'Kimchi Premium',
        value: parseFloat(latestData.kimchi_premium.toFixed(2)),
        previousValue: parseFloat(previousPremium.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        unit: '%',
        upbitPrice: 0, // DB에는 계산된 프리미엄만 저장되므로 0으로 설정
        binancePrice: 0,
        lastUpdated: new Date(latestData.created_at)
      };
    }
  } catch (error) {
    console.warn('DB data fetch failed, falling back to real-time API:', error);
  }

  // 2. DB 데이터가 없거나 오래됐으면 실시간 API 사용
  console.log('🔄 Using real-time API for Kimchi premium');
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

  // 3. 모든 방법이 실패하면 Mock 데이터 반환
  console.warn('Using mock data for Kimchi premium');
  return MockDataGenerator.getKimchiPremium();
};

// 달러 인덱스 (DB 우선, 실시간 API 백업)
export const getDollarIndex = async (): Promise<DollarIndex> => {
  try {
    // 1. DB에서 최신 데이터 확인 (30분 이내)
    const latestData = await getLatestData();
    
    if (latestData && latestData.dollar_index !== null && isDataFresh(latestData.created_at, 30)) {
      console.log('📊 Using DB data for Dollar Index');
      
      const previousValue = cacheUtils.get('dollar-index') || latestData.dollar_index * 0.998;
      const change = latestData.dollar_index - previousValue;
      const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
      
      cacheUtils.set('dollar-index', latestData.dollar_index);
      
      return {
        name: 'Dollar Index',
        value: parseFloat(latestData.dollar_index.toFixed(2)),
        previousValue: parseFloat(previousValue.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        unit: 'DXY',
        lastUpdated: new Date(latestData.created_at)
      };
    }
  } catch (error) {
    console.warn('DB data fetch failed, falling back to real-time API:', error);
  }

  // 2. DB 데이터가 없거나 오래됐으면 실시간 API 사용
  console.log('🔄 Using real-time API for Dollar Index');
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

  // 3. 모든 방법이 실패하면 Mock 데이터 반환
  console.warn('Using mock data for Dollar Index - all APIs failed');
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