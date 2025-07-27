// scripts/test-supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// 환경변수 로드
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  console.log('🔗 Supabase 연결 테스트 시작...');
  
  try {
    // 1. 간단한 테스트 데이터 삽입
    const testData = {
      timestamp: new Date().toISOString(),
      btc_dominance: 54.23,
      kimchi_premium: 2.45,
      dollar_index: 104.12,
      btc_price: 95420.50,
      collection_source: 'test',
      api_health: { test: 'ok' }
    };
    
    console.log('📝 테스트 데이터 삽입 중...');
    const { data, error } = await supabase
      .from('crypto_hourly_data')
      .insert([testData])
      .select();
    
    if (error) {
      console.error('❌ 삽입 실패:', error.message);
      console.error('상세 에러:', error);
      return;
    }
    
    console.log('✅ 데이터 삽입 성공!');
    
    // 2. 데이터 조회 테스트
    console.log('🔍 데이터 조회 테스트...');
    const { data: selectData, error: selectError } = await supabase
      .from('crypto_hourly_data')
      .select('*')
      .eq('collection_source', 'test')
      .limit(1);
    
    if (selectError) {
      console.error('❌ 조회 실패:', selectError.message);
      return;
    }
    
    console.log('✅ 데이터 조회 성공:', selectData);
    
    // 3. 테스트 데이터 정리
    console.log('🧹 테스트 데이터 정리...');
    await supabase
      .from('crypto_hourly_data')
      .delete()
      .eq('collection_source', 'test');
    
    console.log('🎉 모든 테스트 통과! Supabase 연결 성공!');
    
  } catch (error) {
    console.error('💥 연결 테스트 실패:', error.message);
    console.error('상세 에러:', error);
  }
}

testConnection();