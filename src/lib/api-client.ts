import axios, { AxiosResponse } from 'axios';

// API 엔드포인트 상수
export const API_ENDPOINTS = {
  COINGECKO: {
    BASE: 'https://api.coingecko.com/api/v3',
    GLOBAL: '/global',
    MARKETS: '/coins/markets'
  },
  UPBIT: {
    BASE: 'https://api.upbit.com/v1',
    TICKER: '/ticker'
  },
  BINANCE: {
    BASE: 'https://api.binance.com/api/v3',
    TICKER_PRICE: '/ticker/price'
  }
} as const;

// HTTP 클라이언트 설정
const createApiClient = (baseURL: string, timeout = 10000) => {
  return axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// API 클라이언트 인스턴스들
export const coinGeckoClient = createApiClient(API_ENDPOINTS.COINGECKO.BASE);
export const upbitClient = createApiClient(API_ENDPOINTS.UPBIT.BASE);
export const binanceClient = createApiClient(API_ENDPOINTS.BINANCE.BASE);

// 공통 에러 처리 래퍼
export const withErrorHandling = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  errorMessage: string
): Promise<T | null> => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return null;
  }
};

// 재시도 로직이 있는 API 호출
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  retries = 2,
  delay = 1000
): Promise<T | null> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === retries) {
        console.error('API call failed after retries:', error);
        return null;
      }
      console.warn(`API call failed, retrying in ${delay}ms... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  return null;
};