import { useQuery, useQueries as useTanStackQueries } from '@tanstack/react-query';
import { 
  getBitcoinDominance,
  getKimchiPremium,
  getDollarIndex,
  getCryptoPrices,
  getChartData
} from '@/lib/api';
import { BitcoinDominance, KimchiPremium, DollarIndex, CryptoPriceData, ChartDataPoint } from '@/types/crypto';

// Query Keys
export const queryKeys = {
  bitcoinDominance: ['bitcoinDominance'] as const,
  kimchiPremium: ['kimchiPremium'] as const,
  dollarIndex: ['dollarIndex'] as const,
  cryptoPrices: ['cryptoPrices'] as const,
  chartData: (indicator: string, days: number) => ['chartData', indicator, days] as const,
};

// Individual Query Hooks
export const useBitcoinDominance = () => {
  return useQuery<BitcoinDominance>({
    queryKey: queryKeys.bitcoinDominance,
    queryFn: getBitcoinDominance,
    staleTime: 1000 * 3, // 3초
    refetchInterval: 1000 * 5, // 5초마다 자동 갱신
  });
};

export const useKimchiPremium = () => {
  return useQuery<KimchiPremium>({
    queryKey: queryKeys.kimchiPremium,
    queryFn: getKimchiPremium,
    staleTime: 1000 * 3, // 3초
    refetchInterval: 1000 * 5, // 5초마다 자동 갱신
  });
};

export const useDollarIndex = () => {
  return useQuery<DollarIndex>({
    queryKey: queryKeys.dollarIndex,
    queryFn: getDollarIndex,
    staleTime: 1000 * 3, // 3초
    refetchInterval: 1000 * 5, // 5초마다 자동 갱신
  });
};

export const useCryptoPrices = () => {
  return useQuery<CryptoPriceData[]>({
    queryKey: queryKeys.cryptoPrices,
    queryFn: getCryptoPrices,
    staleTime: 1000 * 3, // 3초
    refetchInterval: 1000 * 5, // 5초마다 자동 갱신
  });
};

export const useChartData = (indicator: string, days: number = 7) => {
  return useQuery<ChartDataPoint[]>({
    queryKey: queryKeys.chartData(indicator, days),
    queryFn: () => getChartData(indicator, days),
    staleTime: 1000 * 60 * 5, // 5분
    refetchInterval: 1000 * 60 * 10, // 10분마다 자동 갱신
  });
};

// Combined Dashboard Data Hook
export const useDashboardData = () => {
  const queries = useTanStackQueries({
    queries: [
      {
        queryKey: queryKeys.bitcoinDominance,
        queryFn: getBitcoinDominance,
        staleTime: 1000 * 3,
        refetchInterval: 1000 * 5,
      },
      {
        queryKey: queryKeys.kimchiPremium,
        queryFn: getKimchiPremium,
        staleTime: 1000 * 3,
        refetchInterval: 1000 * 5,
      },
      {
        queryKey: queryKeys.dollarIndex,
        queryFn: getDollarIndex,
        staleTime: 1000 * 3,
        refetchInterval: 1000 * 5,
      },
      {
        queryKey: queryKeys.cryptoPrices,
        queryFn: getCryptoPrices,
        staleTime: 1000 * 3,
        refetchInterval: 1000 * 5,
      },
    ]
  });

  const [
    bitcoinDominanceQuery,
    kimchiPremiumQuery,
    dollarIndexQuery,
    cryptoPricesQuery
  ] = queries;

  // 차트 데이터를 위한 추가 쿼리들
  const chartQueries = useTanStackQueries({
    queries: [
      {
        queryKey: queryKeys.chartData('btc-dominance', 7),
        queryFn: () => getChartData('btc-dominance', 7),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 10,
      },
      {
        queryKey: queryKeys.chartData('kimchi-premium', 7),
        queryFn: () => getChartData('kimchi-premium', 7),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 10,
      },
      {
        queryKey: queryKeys.chartData('dollar-index', 7),
        queryFn: () => getChartData('dollar-index', 7),
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 60 * 10,
      },
    ]
  });

  const [btcDominanceChart, kimchiPremiumChart, dollarIndexChart] = chartQueries;

  // 모든 쿼리의 로딩 상태
  const isLoading = queries.some(query => query.isLoading) || chartQueries.some(query => query.isLoading);
  
  // 모든 쿼리의 에러 상태
  const hasError = queries.some(query => query.isError) || chartQueries.some(query => query.isError);
  
  // 에러 메시지 수집
  const errors = [
    ...queries.filter(query => query.isError).map(query => query.error?.message),
    ...chartQueries.filter(query => query.isError).map(query => query.error?.message)
  ].filter(Boolean);

  // 개별 refetch 함수들
  const refetchAll = async () => {
    await Promise.all([
      ...queries.map(query => query.refetch()),
      ...chartQueries.map(query => query.refetch())
    ]);
  };

  // 마지막 업데이트 시간 (가장 최근 성공한 쿼리의 시간)
  const lastUpdated = Math.max(
    ...queries.filter(query => query.dataUpdatedAt).map(query => query.dataUpdatedAt),
    ...chartQueries.filter(query => query.dataUpdatedAt).map(query => query.dataUpdatedAt)
  );

  return {
    // Dashboard data
    dashboardData: (
      bitcoinDominanceQuery.data && 
      kimchiPremiumQuery.data && 
      dollarIndexQuery.data && 
      cryptoPricesQuery.data
    ) ? {
      bitcoinDominance: bitcoinDominanceQuery.data,
      kimchiPremium: kimchiPremiumQuery.data,
      dollarIndex: dollarIndexQuery.data,
      cryptoPrices: cryptoPricesQuery.data,
    } : undefined,

    // Chart data
    chartData: {
      btcDominance: btcDominanceChart.data || [],
      kimchiPremium: kimchiPremiumChart.data || [],
      dollarIndex: dollarIndexChart.data || [],
    },

    // States
    loading: isLoading,
    error: hasError ? errors.join(', ') : null,
    lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
    
    // Actions
    refetch: refetchAll,

    // Individual query states for more granular control
    queries: {
      bitcoinDominance: bitcoinDominanceQuery,
      kimchiPremium: kimchiPremiumQuery,
      dollarIndex: dollarIndexQuery,
      cryptoPrices: cryptoPricesQuery,
      charts: {
        btcDominance: btcDominanceChart,
        kimchiPremium: kimchiPremiumChart,
        dollarIndex: dollarIndexChart,
      }
    }
  };
};