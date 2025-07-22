import axios, { AxiosResponse } from 'axios';

// Rate limiting을 위한 간단한 큐 구현
class RateLimiter {
  private queue: Array<() => void> = [];
  private tokens: number;
  private maxTokens: number;
  private refillRate: number;
  private lastRefill: number;

  constructor(maxTokens: number, refillRate: number) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  private refillTokens() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timePassed * this.refillRate);
    
    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      const tryAcquire = () => {
        this.refillTokens();
        
        if (this.tokens > 0) {
          this.tokens--;
          resolve();
        } else {
          // 다음 토큰이 사용 가능할 때까지 대기
          setTimeout(tryAcquire, 1000 / this.refillRate);
        }
      };
      
      tryAcquire();
    });
  }
}

// CoinGecko API용 rate limiter (분당 45회로 여유있게 설정)
const coinGeckoRateLimiter = new RateLimiter(45, 45 / 60); // 45 tokens, 0.75 tokens/sec

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
    TICKER_PRICE: '/ticker/price',
    TICKER_24HR: '/ticker/24hr'
  }
} as const;

// HTTP 클라이언트 설정
const createApiClient = (baseURL: string, timeout = 15000, rateLimiter?: RateLimiter) => {
  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Rate limiting 인터셉터 추가
  if (rateLimiter) {
    client.interceptors.request.use(async (config) => {
      await rateLimiter.acquire();
      return config;
    });
  }

  return client;
};

// API 클라이언트 인스턴스들
export const coinGeckoClient = createApiClient(API_ENDPOINTS.COINGECKO.BASE, 15000, coinGeckoRateLimiter);
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

// 재시도 로직이 있는 API 호출 (429 에러에 대한 특별 처리)
export const withRetry = async <T>(
  apiCall: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T | null> => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      const isRateLimited = axios.isAxiosError(error) && error.response?.status === 429;
      const isLastRetry = i === retries;
      
      if (isLastRetry) {
        console.error('API call failed after retries:', error);
        return null;
      }

      // 429 에러의 경우 더 긴 지연 시간 적용
      const retryDelay = isRateLimited 
        ? Math.min(delay * Math.pow(2, i + 2), 60000) // 최대 1분
        : Math.min(delay * Math.pow(2, i), 30000);    // 최대 30초
      
      console.warn(
        `API call failed${isRateLimited ? ' (rate limited)' : ''}, retrying in ${retryDelay}ms... (${i + 1}/${retries})`
      );
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  return null;
};