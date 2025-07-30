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
