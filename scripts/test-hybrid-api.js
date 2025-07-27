// scripts/test-hybrid-api.js
import { getBitcoinDominance, getKimchiPremium, getDollarIndex } from '../src/entities/crypto/api.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testHybridAPI() {
  console.log('🧪 하이브리드 API 로직 테스트 시작...\n');
  
  try {
    console.log('1️⃣ 비트코인 도미넌스 테스트');
    const btcDominance = await getBitcoinDominance();
    console.log(`   - 값: ${btcDominance.value}%`);
    console.log(`   - 마지막 업데이트: ${btcDominance.lastUpdated.toLocaleString()}`);
    console.log('');

    console.log('2️⃣ 김치 프리미엄 테스트');
    const kimchiPremium = await getKimchiPremium();
    console.log(`   - 값: ${kimchiPremium.value}%`);
    console.log(`   - 마지막 업데이트: ${kimchiPremium.lastUpdated.toLocaleString()}`);
    console.log('');

    console.log('3️⃣ 달러 인덱스 테스트');
    const dollarIndex = await getDollarIndex();
    console.log(`   - 값: ${dollarIndex.value} ${dollarIndex.unit}`);
    console.log(`   - 마지막 업데이트: ${dollarIndex.lastUpdated.toLocaleString()}`);
    console.log('');

    console.log('✅ 모든 하이브리드 API 테스트 통과!');
    console.log('\n📊 요약:');
    console.log(`   - BTC 도미넌스: ${btcDominance.value}% (${btcDominance.changePercent >= 0 ? '+' : ''}${btcDominance.changePercent.toFixed(2)}%)`);
    console.log(`   - 김치 프리미엄: ${kimchiPremium.value}% (${kimchiPremium.changePercent >= 0 ? '+' : ''}${kimchiPremium.changePercent.toFixed(2)}%)`);
    console.log(`   - 달러 인덱스: ${dollarIndex.value} (${dollarIndex.changePercent >= 0 ? '+' : ''}${dollarIndex.changePercent.toFixed(2)}%)`);

  } catch (error) {
    console.error('❌ 하이브리드 API 테스트 실패:', error);
  }
}

testHybridAPI();