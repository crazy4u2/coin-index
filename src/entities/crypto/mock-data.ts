import { BitcoinDominance, KimchiPremium, DollarIndex, CryptoPriceData } from '@/shared/types/crypto';

// 비트코인 도미넌스 Mock 데이터 생성
export const getBitcoinDominance = (): BitcoinDominance => {
  const baseValue = 54.2;
  const variation = (Math.random() - 0.5) * 2; // -1 to 1
  const currentValue = baseValue + variation;
  const previousValue = baseValue + (Math.random() - 0.5) * 1.5;
  const change = currentValue - previousValue;
  const changePercent = (change / previousValue) * 100;

  return {
    name: 'Bitcoin Dominance',
    value: parseFloat(currentValue.toFixed(2)),
    previousValue: parseFloat(previousValue.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    unit: '%',
    lastUpdated: new Date()
  };
};

// 김치 프리미엄 Mock 데이터 생성
export const getKimchiPremium = (): KimchiPremium => {
  const basePremium = 2.3;
  const variation = (Math.random() - 0.5) * 4; // -2 to 2
  const currentValue = basePremium + variation;
  const previousValue = basePremium + (Math.random() - 0.5) * 3;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? (change / Math.abs(previousValue)) * 100 : 0;

  return {
    name: 'Kimchi Premium',
    value: parseFloat(currentValue.toFixed(2)),
    previousValue: parseFloat(previousValue.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    unit: '%',
    upbitPrice: 135000000 + Math.random() * 5000000,
    binancePrice: 132000000 + Math.random() * 3000000,
    lastUpdated: new Date()
  };
};

// 달러 인덱스 Mock 데이터 생성
export const getDollarIndex = (): DollarIndex => {
  const baseValue = 104.2;
  const variation = (Math.random() - 0.5) * 1.5; // -0.75 to 0.75
  const currentValue = baseValue + variation;
  const previousValue = baseValue + (Math.random() - 0.5) * 1.2;
  const change = currentValue - previousValue;
  const changePercent = (change / previousValue) * 100;

  return {
    name: 'Dollar Index',
    value: parseFloat(currentValue.toFixed(2)),
    previousValue: parseFloat(previousValue.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    unit: 'DXY',
    lastUpdated: new Date()
  };
};

// 암호화폐 가격 Mock 데이터 생성
export const getCryptoPrices = (): CryptoPriceData[] => {
  const mockCoins = [
    { symbol: 'BTC', basePrice: 95420, baseCap: 1890000000000, baseVolume: 42000000000 },
    { symbol: 'ETH', basePrice: 3340, baseCap: 402000000000, baseVolume: 18000000000 },
    { symbol: 'XRP', basePrice: 2.15, baseCap: 125000000000, baseVolume: 8500000000 },
    { symbol: 'ADA', basePrice: 0.87, baseCap: 31000000000, baseVolume: 1200000000 },
    { symbol: 'SOL', basePrice: 185.5, baseCap: 89000000000, baseVolume: 3400000000 }
  ];

  return mockCoins.map(coin => {
    const priceVariation = (Math.random() - 0.5) * 0.1; // -5% to 5%
    const currentPrice = coin.basePrice * (1 + priceVariation);
    const previousPrice = coin.basePrice * (1 + (Math.random() - 0.5) * 0.08);
    const change24h = currentPrice - previousPrice;
    const changePercent24h = (change24h / previousPrice) * 100;

    return {
      symbol: coin.symbol,
      price: parseFloat(currentPrice.toFixed(coin.symbol === 'BTC' ? 0 : 2)),
      previousPrice: parseFloat(previousPrice.toFixed(coin.symbol === 'BTC' ? 0 : 2)),
      change24h: parseFloat(change24h.toFixed(2)),
      changePercent24h: parseFloat(changePercent24h.toFixed(2)),
      volume24h: coin.baseVolume * (1 + (Math.random() - 0.5) * 0.3),
      marketCap: coin.baseCap * (1 + (Math.random() - 0.5) * 0.2),
      lastUpdated: new Date()
    };
  });
};

// 차트용 히스토리 데이터 생성
export const generateChartData = (indicator: string, days: number = 7) => {
  const data = [];
  const now = new Date();
  
  let baseValue: number;
  let volatility: number;
  
  switch (indicator) {
    case 'btc-dominance':
      baseValue = 54;
      volatility = 2;
      break;
    case 'kimchi-premium':
      baseValue = 2;
      volatility = 3;
      break;
    case 'dollar-index':
      baseValue = 104;
      volatility = 1;
      break;
    default:
      baseValue = 50;
      volatility = 5;
  }

  let currentValue = baseValue;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // 시계열 데이터를 위한 약간의 트렌드와 노이즈 추가
    const trend = (Math.random() - 0.5) * 0.1;
    const noise = (Math.random() - 0.5) * volatility * 0.5;
    currentValue = currentValue + trend + noise;
    
    // 값이 너무 벗어나지 않도록 조정
    const minValue = baseValue - volatility * 2;
    const maxValue = baseValue + volatility * 2;
    currentValue = Math.max(minValue, Math.min(maxValue, currentValue));
    
    data.push({
      timestamp: date.toISOString().split('T')[0],
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  return data;
};

// MockDataGenerator 객체로 래핑 (기존 코드와의 호환성)
export const MockDataGenerator = {
  getBitcoinDominance,
  getKimchiPremium,
  getDollarIndex,
  getCryptoPrices,
  generateChartData
};