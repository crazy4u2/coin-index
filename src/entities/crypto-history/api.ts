import { createClient } from '@supabase/supabase-js';

// Lazy initialization으로 환경변수 문제 해결
let supabaseClient: ReturnType<typeof createClient> | null = null;

const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is missing');
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  }
  
  if (!supabaseKey) {
    console.error('Supabase key is missing. Available keys:', {
      serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is required');
  }
  
  supabaseClient = createClient(supabaseUrl, supabaseKey);
  return supabaseClient;
};

// 히스토리컬 데이터 타입 정의
export interface HistoricalDataPoint {
  id: number;
  timestamp: string;
  btc_dominance: number | null;
  kimchi_premium: number | null;
  dollar_index: number | null;
  btc_price: number | null;
  created_at: string;
}

// 최신 데이터 조회 (30분 이내)
export const getLatestData = async (): Promise<HistoricalDataPoint | null> => {
  try {
    const supabase = getSupabaseClient();
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('crypto_hourly_data')
      .select('*')
      .gte('created_at', thirtyMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Latest data fetch error:', error);
      return null;
    }

    return (data?.[0] as unknown as HistoricalDataPoint) || null;
  } catch (error) {
    console.error('Error fetching latest data:', error);
    return null;
  }
};

// 특정 지표의 히스토리컬 데이터 조회
export const getHistoricalData = async (
  indicator: 'btc_dominance' | 'kimchi_premium' | 'dollar_index',
  hours: number = 24
): Promise<{ timestamp: string; value: number }[]> => {
  try {
    const supabase = getSupabaseClient();
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('crypto_hourly_data')
      .select(`created_at, ${indicator}`)
      .gte('created_at', hoursAgo)
      .not(indicator, 'is', null)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`Historical ${indicator} data fetch error:`, error);
      return [];
    }

    return data.map(item => ({
      timestamp: item.created_at as string,
      value: item[indicator as keyof typeof item] as number
    }));
  } catch (error) {
    console.error(`Error fetching historical ${indicator} data:`, error);
    return [];
  }
};

// 데이터 신선도 체크
export const isDataFresh = (timestamp: string, maxAgeMinutes: number = 30): boolean => {
  const dataTime = new Date(timestamp).getTime();
  const now = Date.now();
  const maxAge = maxAgeMinutes * 60 * 1000;
  
  return (now - dataTime) <= maxAge;
};

// 전체 히스토리컬 데이터 조회 (페이지네이션 지원)
export const getAllHistoricalData = async (
  limit: number = 100,
  offset: number = 0
): Promise<HistoricalDataPoint[]> => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('crypto_hourly_data')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('All historical data fetch error:', error);
      return [];
    }

    return (data as unknown as HistoricalDataPoint[]) || [];
  } catch (error) {
    console.error('Error fetching all historical data:', error);
    return [];
  }
};

// 통계 정보 조회 (평균, 최대, 최소)
export const getDataStats = async (
  indicator: 'btc_dominance' | 'kimchi_premium' | 'dollar_index',
  hours: number = 24
) => {
  try {
    const supabase = getSupabaseClient();
    const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('crypto_hourly_data')
      .select(indicator)
      .gte('created_at', hoursAgo)
      .not(indicator, 'is', null);

    if (error || !data) {
      return null;
    }

    const values = data.map(item => item[indicator as keyof typeof item] as number).filter(v => v !== null);
    
    if (values.length === 0) return null;

    return {
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  } catch (error) {
    console.error(`Error calculating ${indicator} stats:`, error);
    return null;
  }
};