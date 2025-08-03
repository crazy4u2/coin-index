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
