# 엔터(Enter) 개발

- 본 프로젝트는 Next.js + TypeScript로 구축된 웹 애플리케이션입니다.
- 하지만 개발자는 단 한 줄의 코드도 치지 않고 완성하는 것을 목표로 합니다.
- `claude code` 를 사용하고 code review는 `coderabbit` 를 사용합니다.

# 프로젝트 내용 및 특징

- 개인적으로 코인 투자할 때 사용하는 지표들을 내 입맛에 맞게 보기 위해 만들었습니다.
- api는 무료만 사용합니다.
- 백엔드를 구성하는 supabase 도 무료만 사용합니다.

# 프로젝트 목표

- ai 에게 개발을 맡겨놓고 원하는 기능들을 말하며 살을 붙여가는 과정에서 특이점을 지나는 순간에 사람이 손댈 수 없는 지경에 이르를 거 같은데 그 특이점이 언제쯤 올지 확인해보고자 합니다.
- ai vs ai 대결구도를 만들어보려고 합니다.
  - 개발은 `claude code`
  - 코드 리뷰는 `coderabbit`
- 그리고 $20 짜리 요금으로 얼마나 빨리 토큰 한도가 차는지 확인하고자 하는 목표가 있습니다.
- 그동안 하지 못했던 잔디심기 목적도 있습니다.

# 환경 설정 가이드

## 로컬 개발 환경 설정

1. **환경변수 파일 생성**

   ```bash
   cp .env.example .env.local
   ```

2. **Supabase 키 설정**

   - [Supabase Dashboard](https://supabase.com/dashboard) 접속
   - 프로젝트 선택 → Settings → API
   - 다음 값들을 `.env.local`에 입력:
     ```
     NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

3. **개발 서버 실행**
   ```bash
   npm install
   npm run dev
   ```

## Vercel 배포 환경 설정

**로컬과 배포 환경에서 차트 데이터가 다르게 나타나는 문제 해결:**

1. **Vercel Dashboard 접속**

   - [Vercel Dashboard](https://vercel.com/dashboard) → 프로젝트 선택

2. **환경변수 설정**

   - Settings → Environment Variables
   - 다음 변수들을 **Production** 환경에 추가:
     ```
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     SUPABASE_SERVICE_ROLE_KEY
     ```

3. **재배포**
   - 환경변수 설정 후 자동으로 재배포됨
   - 수동 재배포: Deployments → Redeploy

⚠️ **중요**: 환경변수 미설정 시 Supabase 연결 실패로 차트에 현재값만 표시됩니다.

## GitHub Actions 설정

자동 데이터 수집을 위한 Secrets 설정:

1. **Repository Settings**

   - GitHub 리포지토리 → Settings → Secrets and variables → Actions

2. **Secrets 추가**

   ```
   SUPABASE_URL = https://your-project-id.supabase.co
   SUPABASE_KEY = your_service_role_key
   ```

3. **실행 확인**
   - Actions 탭에서 "Collect Crypto Data" 워크플로우 상태 확인
   - 매시간 자동 실행됨

# 개발 작업 히스토리

## 2025-07-30: 차트 개선 및 Supabase 데이터 연동

### 작업 내용 요약

- **문제 인식**: Supabase에 데이터를 저장했지만 차트에서 활용되지 않는 문제 발견
- **차트 레이아웃 개선**: 3개 차트를 나란히 배치에서 세로 배치(100% 너비)로 변경
- **데이터 연동 문제 해결**: 히스토리컬 데이터가 차트에 표시되지 않는 근본 원인 해결
- **GitHub Actions 오류 수정**: ES 모듈 문법 문제로 데이터 수집이 실패하는 문제 해결

### 주요 기술적 개선사항

#### 1. 차트 레이아웃 개선

- **파일**: `src/views/main/page.tsx`
- **변경**: `grid-cols-1 lg:grid-cols-2 xl:grid-cols-3` → `grid-cols-1`
- **효과**: 비트코인 도미넌스, 김치프리미엄, 달러인덱스 차트가 각각 100% 너비로 세로 배치

#### 2. Supabase 히스토리컬 데이터 연동

- **파일**: `src/shared/api/api-services.ts`
- **문제**: 히스토리컬 데이터 함수들이 항상 `null` 반환
- **해결**: 각 히스토리컬 함수에 Supabase DB 우선 조회 로직 추가
  - `fetchBitcoinDominanceHistory()`: Supabase → CoinMarketCap API 백업
  - `fetchKimchiPremiumHistory()`: Supabase → Upbit+Binance API 백업
  - `fetchDollarIndexHistory()`: Supabase → FRED API 백업

#### 3. 데이터 조회 로직 개선

- **파일**: `src/entities/crypto-history/api.ts`
- **문제**: 7일치 데이터 요청 시 최근 생성한 데이터만 있어서 빈 결과 반환
- **해결**: Fallback 로직 추가 - 요청 범위에 데이터가 없으면 최근 모든 데이터 조회

#### 4. GitHub Actions 모듈 문제 해결

- **파일**: `package.json`, `scripts/collect-crypto-data.js`
- **문제**: ES 모듈 import 문법 사용하는데 `"type": "module"` 미설정
- **해결**:
  - `package.json`에 `"type": "module"` 추가
  - 의존성 import 문제 해결을 위해 `fetchBitcoinDominance` 함수 직접 구현

#### 5. TypeScript 타입 안전성 개선

- **파일**: `src/entities/crypto-history/api.ts`
- **개선**: Supabase 쿼리 결과의 타입 캐스팅 개선으로 빌드 오류 해결

### 데이터 플로우 개선

**기존**: 실시간 API만 사용 → 히스토리컬 차트에 단일 포인트만 표시
**개선**: Supabase DB 우선 → 실제 히스토리컬 데이터로 다중 포인트 차트 표시

### 자동화 개선

- **GitHub Actions**: 매시간 자동 데이터 수집이 정상 작동하도록 모듈 문제 해결
- **데이터 수집**: `collection_source: 'github-actions'`로 자동/수동 수집 데이터 구분

### 검증 및 테스트

- 로컬 환경에서 데이터 수집 스크립트 정상 작동 확인
- Next.js 빌드 성공 및 ESLint 통과 확인
- Supabase 연결 및 데이터 저장 정상 작동 확인

### 사용자 경험 개선

- 차트가 더 크고 보기 편한 레이아웃으로 변경
- 실제 히스토리컬 데이터를 활용한 의미있는 차트 표시
- 한국식 색상 적용으로 상승/하락 직관적 표시

## 2025-08-03: 차트 날짜 표시 개선

### 작업 내용 요약

- **문제 인식**: 차트에서 같은 날짜가 반복되어 표시되는 문제 발견 (시간 단위 데이터가 날짜별로 중복)
- **데이터 구조 개선**: 시간별 히스토리컬 데이터를 날짜별로 그룹화하여 하루에 하나의 데이터 포인트만 표시
- **차트 가독성 향상**: X축에 중복 날짜 제거로 차트 해석이 더 명확해짐

### 주요 기술적 개선사항

#### 1. 차트 데이터 그룹화 로직 구현

- **파일**: `src/widgets/crypto-dashboard/IndicatorChart.tsx`
- **문제**: DB에서 가져온 시간별 데이터(created_at)가 차트에서 같은 날짜로 중복 표시
- **해결**: 
  - 날짜별 데이터 그룹화 로직 추가 (`dailyData` useMemo)
  - 같은 날짜의 여러 시간 데이터 중 가장 최신 시간 데이터 선택
  - 날짜순 정렬로 차트 X축 순서 보장

#### 2. 차트 렌더링 최적화

- **변경**: `LineChart data={data}` → `LineChart data={dailyData}`
- **효과**: 
  - 중복 날짜 제거로 차트 가독성 향상
  - 날짜별 하나의 데이터 포인트로 트렌드 파악 용이
  - 메모이제이션으로 성능 최적화

#### 3. 색상 로직 업데이트

- **문제**: 기존 `data` 배열 기반 색상 계산
- **해결**: `dailyData` 배열 기반으로 상승/하락 색상 계산 로직 수정
- **효과**: 날짜별 데이터에 맞는 정확한 한국식 색상 표시

### 데이터 플로우 개선

**기존**: 시간별 데이터 → 차트에 같은 날짜 중복 표시
**개선**: 시간별 데이터 → 날짜별 그룹화 → 하루 하나의 데이터 포인트 표시

### 김치 프리미엄 데이터 부족 원인 분석

- **현상**: 7/27, 7/30, 7/31 데이터만 차트에 표시
- **원인**: Supabase DB에 해당 날짜의 데이터만 존재
- **분석**: 
  - 김치 프리미엄 히스토리컬 데이터는 전적으로 DB 의존
  - Upbit/Binance 히스토리컬 API 미구현
  - 현재 실시간 데이터 수집은 정상 작동

### 사용자 경험 개선

- 차트 X축에서 중복 날짜 제거로 가독성 향상
- 날짜별 트렌드 파악이 더 명확해짐
- 모든 차트(비트코인 도미넌스, 김치 프리미엄, 달러 인덱스)에 동일한 개선 적용

## 2025-08-03: Ondo Finance 투자지표 추가

### 작업 내용 요약

- **새로운 투자지표 추가**: Ondo Finance(ONDO) 코인 가격 정보를 대시보드에 추가
- **API 통합**: CoinGecko API를 통한 ONDO 가격 데이터 실시간 조회
- **Mock 데이터 지원**: API 호출 실패 시 대체 데이터 제공으로 안정성 확보

### 주요 기술적 개선사항

#### 1. ONDO Finance 데이터 서비스 구현

- **파일**: `src/shared/api/api-services.ts`
- **추가 기능**: `fetchOndoFinanceData()` 함수 구현
  - CoinGecko API를 통한 ONDO 현재 가격 조회
  - 24시간 변화율 정보 포함
  - USD, KRW 가격 정보 모두 제공
  - 에러 핸들링 및 null 반환으로 안정성 확보

#### 2. Mock 데이터 생성기 추가

- **파일**: `src/entities/crypto/mock-data.ts`
- **추가 기능**: `generateOndoFinanceData()` 함수 구현
  - 실제 ONDO 가격 범위($0.8-$1.5) 기반 랜덤 데이터 생성
  - 24시간 변화율 시뮬레이션 (-10% ~ +10%)
  - API 실패 시 대체 데이터로 서비스 연속성 보장

### 데이터 구조

```typescript
interface OndoFinanceData {
  price_usd: number;     // USD 가격
  price_krw: number;     // KRW 가격 (환율 적용)
  change_24h: number;    // 24시간 변화율
  last_updated: string;  // 마지막 업데이트 시간
}
```

### API 통합 방식

- **실시간 데이터**: CoinGecko API `/simple/price` 엔드포인트 활용
- **요청 파라미터**: `ids=ondo-finance&vs_currencies=usd,krw&include_24hr_change=true`
- **에러 처리**: Promise.allSettled를 통한 부분 실패 허용
- **백업 시스템**: Mock 데이터로 graceful degradation

### 사용자 경험 개선

- 새로운 투자지표 카드 추가로 대시보드 정보 확장
- ONDO Finance 관련 투자 의사결정 지원
- 일관된 UI/UX로 기존 지표들과 통합적 경험 제공

## 2025-08-03: 로드맵 페이지 및 SEO 최적화

### 작업 내용 요약

- **로드맵 페이지 추가**: 프로젝트의 미래 계획과 개발 로드맵을 투자자 관점으로 제시
- **SEO 최적화**: Meta 태그, Open Graph, Twitter Card 등 검색엔진 및 SNS 공유 최적화
- **사용자 경험 개선**: 네비게이션 추가 및 전문적인 서비스 이미지 구축

### 주요 기술적 개선사항

#### 1. 로드맵 페이지 (`/roadmap`) 구현

- **파일**: `src/app/roadmap/page.tsx`, `src/app/roadmap/RoadmapContent.tsx`
- **주요 기능**:
  - 4단계 개발 로드맵 (투자 신호 → 포트폴리오 → 고급 분석 → 커뮤니티)
  - 구현 난이도별 우선순위 및 예상 기간 제시
  - 현재 구현된 기능 vs 미래 계획 명확한 구분
  - CTA 섹션으로 GitHub 기여 및 체험 유도

#### 2. SEO 및 메타데이터 최적화

- **파일**: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/roadmap/page.tsx`
- **개선사항**:
  - 기본 제목 "Create Next App" → "암호화폐 투자지표 대시보드"로 변경
  - 페이지별 맞춤형 title, description, keywords 설정
  - Open Graph 태그로 SNS 공유 최적화 (1200×630 이미지)
  - Twitter Card 지원으로 트위터 공유 최적화
  - 한국어 로케일 및 언어 설정 (`lang="ko"`)

#### 3. 네비게이션 개선

- **파일**: `src/views/main/page.tsx`
- **추가 기능**:
  - 메인 페이지 헤더에 "로드맵" 버튼 추가
  - 로드맵 페이지에서 "대시보드로 돌아가기" 링크
  - 일관된 사용자 경험을 위한 네비게이션 통합

### 메타데이터 구조

#### 루트 Layout
```typescript
// 사이트 전체 기본 설정
title: {
  default: "암호화폐 투자지표 대시보드",
  template: "%s | 암호화폐 투자지표 대시보드"
}
```

#### 메인 페이지 (`/`)
- **제목**: "실시간 암호화폐 투자지표 대시보드"
- **키워드**: 실시간, 비트코인 도미넌스, 김치 프리미엄 등
- **OG 이미지**: `/og-dashboard.jpg`

#### 로드맵 페이지 (`/roadmap`)
- **제목**: "제품 로드맵" 
- **키워드**: 투자신호, 포트폴리오, AI예측, 백테스팅 등
- **OG 이미지**: `/og-roadmap.jpg`

### 로드맵 컨텐츠 하이라이트

#### 비전
> "단순한 정보 제공을 넘어, 실제 투자 결정을 도와주는 AI 어시스턴트로 진화"

#### 4단계 개발 계획
1. **투자 신호 생성** (1-2주): 김치 프리미엄/도미넌스 기반 매매 신호
2. **포트폴리오 추적** (2-4주): 개인 자산 관리 및 리스크 분석
3. **고급 분석** (1-2개월): 상관관계 분석, 예측, 백테스팅
4. **커뮤니티** (2개월+): 사용자 커뮤니티 및 AI 어시스턴트

### 사용자 경험 개선

- **전문성 강화**: 투자자 친화적 언어와 구체적 계획 제시
- **신뢰성 증대**: 단계별 구현 일정과 현실적 목표 설정
- **참여 유도**: GitHub 기여 및 피드백 수집 채널 제공
- **SEO 개선**: 검색 노출 향상 및 SNS 공유 최적화

## 2024-12-24: 직전 최고가(ATH) 기능 및 CoinGecko 우선 전략

### 작업 내용 요약

- **직전 최고가 표시**: 각 코인의 실제 최고가와 달성 날짜를 정확히 표시
- **데이터 소스 최적화**: CoinGecko API를 주 데이터 소스로 변경하여 정확성 향상
- **Mock 데이터 완전 제거**: 정확한 가격 정보 우선을 위해 가짜 데이터 완전 삭제
- **ATH 관련 UX 개선**: 툴팁, 차이 표시, 신기록 축하 표시 등 사용자 경험 강화

### 주요 기술적 개선사항

#### 1. 직전 최고가(ATH) 데이터 구조 추가

- **파일**: `src/shared/types/crypto.ts`
- **추가 필드**:
  - `allTimeHigh: number` - 역사적 최고가 금액
  - `athDate: Date` - 최고가 달성 날짜
- **API 연동**: CoinGecko의 `ath`, `ath_date` 필드와 완전 매핑

#### 2. CoinGecko API 우선 전략 구현

- **파일**: `src/shared/api/api-services.ts`
- **변경사항**:
  - Binance 우선 → CoinGecko 우선으로 데이터 소스 변경
  - `include_ath=true`, `include_ath_date=true` 파라미터 추가
  - ATH 관련 필드를 포함한 완전한 시장 데이터 조회
- **업데이트 주기**: 15초 → 1분 (CoinGecko 45초 업데이트 주기에 맞춤)

#### 3. Mock 데이터 완전 제거

- **삭제 파일**: `src/entities/crypto/mock-data.ts`
- **변경된 에러 처리**: API 실패 시 mock 데이터 대신 명확한 에러 메시지
- **정확성 우선**: 부정확한 데이터보다는 에러 상태를 투명하게 표시

#### 4. ATH 기능 UX/UI 구현

##### A. 직전 최고가 컬럼 추가
- **파일**: `src/widgets/crypto-dashboard/IndicatorTable.tsx`
- **기능**: 각 코인의 ATH 가격과 달성 날짜 표시
- **날짜 표시**: "3년 전", "2개월 전" 등 상대적 시간

##### B. 정확한 날짜 툴팁
- **기능**: 마우스 호버 시 정확한 날짜와 시간 표시
- **구현**: CSS `group-hover` + Tailwind 애니메이션
- **예시**: "2021년 11월 10일 오후 11:24" (한국어 로케일)

##### C. ATH 대비 차이 표시 컬럼
- **계산**: 현재가 - ATH 금액 및 퍼센티지
- **색상 구분**: 
  - 양수(ATH 돌파): 빨간색 (`text-red-600`)
  - 음수(ATH 미달): 파란색 (`text-blue-600`)
- **표시 형식**: `+$150.30 / +3.2%` 또는 `-$94.49 / -1.94%`

##### D. 신기록 축하 표시
- **조건**: 1주일 이내 ATH 달성 + 현재가가 ATH 99% 이상
- **시각 효과**:
  - 🏆 트로피 아이콘 + ⭐ 깜빡이는 별
  - 노란색-주황색 그라데이션 배경
  - 좌측 굵은 노란색 테두리
- **애니메이션**: `animate-pulse`로 주목도 향상

### 데이터 정확성 검증

#### ATH 데이터 검증 (이더리움 사례)
- **API 응답**: ATH $4,878.26 (2021-11-10)
- **현재 가격**: $4,783.77
- **차이**: -1.939% (ATH보다 약간 낮음)
- **결론**: 사용자 제기 "3일 전 신고가" 주장과 달리 실제로는 2021년 기록이 맞음

#### API 응답 구조 개선
```typescript
interface CoinGeckoMarketResponse {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  ath: number;           // 실제 최고가
  ath_date: string;      // ISO 8601 포맷 날짜
  ath_change_percentage: number; // ATH 대비 변화율
}
```

### 성능 및 안정성 개선

#### 1. 메모이제이션 최적화
- **함수들**: `calculateAthDifference`, `formatDateFromAth`, `formatExactDate`
- **효과**: 불필요한 재계산 방지로 렌더링 성능 향상

#### 2. 에러 처리 강화
- **방식**: Mock 데이터 폴백 → 명시적 에러 표시
- **장점**: 사용자가 실제 데이터 상태를 정확히 파악 가능

#### 3. 빌드 최적화
- **결과**: ESLint 경고 0개, TypeScript 컴파일 성공
- **번들 크기**: 156kB (변경 없음, 기능 추가에도 불구하고 효율적)

### 사용자 경험 개선

#### 1. 정보 투명성
- **실제 ATH**: 정확한 역사적 최고가 정보
- **명확한 차이**: 현재가와 ATH 간격을 금액과 퍼센트로 표시
- **상태 구분**: 색상으로 ATH 돌파/미달 직관적 구분

#### 2. 인터랙션 개선
- **툴팁**: 상대적 날짜에서 정확한 날짜로 상세 정보 제공
- **축하 효과**: 신기록 달성 시 시각적 축하 표시

#### 3. 일관성 확보
- **색상 체계**: 24h 변화와 ATH 차이 동일한 빨강/파랑 체계
- **폰트**: 가격 관련 정보는 모두 monospace로 정렬된 표시

### 향후 확장 가능성

- **실시간 ATH 업데이트**: CoinGecko의 45초 주기로 신기록 실시간 감지
- **ATH 기록 저장**: Supabase에 ATH 기록 히스토리 저장 가능
- **알림 기능**: 관심 코인의 ATH 돌파 시 알림 확장 가능
