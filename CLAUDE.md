# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
암호화폐 투자지표 대시보드는 Next.js + TypeScript로 구축된 웹 애플리케이션입니다. 실시간으로 비트코인 도미넌스, 김치 프리미엄, 달러 인덱스 등의 주요 투자 지표를 모니터링하고 시각화합니다.

## Common Development Commands

### Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Dependencies
- `npm install` - Install all dependencies
- Key libraries: recharts, axios, lucide-react

## Architecture & Code Structure

### Core Architecture
```
src/
├── app/                    # Next.js App Router
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── ErrorBoundary.tsx  # Error handling wrapper
│   ├── LoadingSpinner.tsx # Loading state components
│   ├── IndicatorChart.tsx # Chart visualization (memoized)
│   └── IndicatorTable.tsx # Data table display (memoized)
├── hooks/                 # Custom React hooks
│   └── useDashboardData.ts # Data fetching & state management
├── lib/                   # Core business logic
│   ├── api.ts            # Main API orchestration layer
│   ├── api-client.ts     # HTTP client configuration
│   ├── api-services.ts   # Raw API service calls
│   └── mock-data.ts      # Fallback mock data generation
└── types/
    └── crypto.ts         # TypeScript type definitions
```

### Data Flow
1. **Data Fetching**: `useDashboardData` hook manages all data fetching
2. **API Layer**: Modular API services with retry logic and error handling
3. **Fallback Strategy**: Graceful degradation to mock data on API failures
4. **Caching**: Simple in-memory cache for previous values calculation
5. **Real-time Updates**: Auto-refresh every 5 minutes

### Key Design Patterns
- **Error Boundaries**: Component-level error isolation
- **React.memo**: Performance optimization for chart/table components
- **Custom Hooks**: Centralized data management logic
- **Promise.allSettled**: Partial failure handling for multiple APIs
- **Graceful Degradation**: Mock data fallback system

### API Integration Points
- **CoinGecko API**: Bitcoin dominance, crypto market data
- **Upbit API**: Korean exchange BTC prices (김치 프리미엄)
- **Binance API**: Global BTC prices for premium calculation
- **Mock Services**: Dollar Index (requires real API integration)

### Performance Considerations
- Components are memoized to prevent unnecessary re-renders
- Formatting functions are memoized with useMemo
- Automatic retries with exponential backoff for API calls
- Efficient data structures for chart rendering

### Error Handling Strategy
- **HTTP Client Level**: Axios interceptors with timeout/retry
- **Service Level**: Null returns on API failures
- **Component Level**: Error boundaries catch rendering errors
- **Hook Level**: Error state management with user feedback
- **Fallback Data**: Mock data ensures UI never breaks

### State Management
- Local component state via React hooks
- No external state management library needed
- Cache for previous values to calculate changes
- Automatic cleanup of intervals and subscriptions

## Development Notes

### Adding New Indicators
1. Define types in `src/types/crypto.ts`
2. Add API service in `src/lib/api-services.ts`
3. Create mock data generator in `src/lib/mock-data.ts`
4. Update main API orchestration in `src/lib/api.ts`

### Styling Guidelines
- Uses Tailwind CSS for all styling
- Responsive design with mobile-first approach
- Consistent color scheme: blue primary, gray neutrals
- Icons from Lucide React library

### Testing & Debugging
- Development server includes hot reloading
- Console logging for API failures (check browser dev tools)
- Error boundaries provide user-friendly error messages
- Mock data fallback allows development without API dependencies