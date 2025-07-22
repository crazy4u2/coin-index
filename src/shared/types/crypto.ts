export interface CryptoIndicator {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  unit: string;
  lastUpdated: Date;
}

export interface BitcoinDominance extends CryptoIndicator {
  name: 'Bitcoin Dominance';
  unit: '%';
}

export interface KimchiPremium extends CryptoIndicator {
  name: 'Kimchi Premium';
  unit: '%';
  upbitPrice: number;
  binancePrice: number;
}

export interface DollarIndex extends CryptoIndicator {
  name: 'Dollar Index';
  unit: 'DXY';
}

export interface CryptoPriceData {
  symbol: string;
  price: number;
  previousPrice: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: Date;
}

export interface DashboardData {
  bitcoinDominance: BitcoinDominance;
  kimchiPremium: KimchiPremium;
  dollarIndex: DollarIndex;
  cryptoPrices: CryptoPriceData[];
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}