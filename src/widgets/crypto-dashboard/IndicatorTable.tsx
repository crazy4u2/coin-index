'use client';

import React, { memo, useMemo } from 'react';
import { TrendingUp, TrendingDown, Trophy, Star } from 'lucide-react';
import { CryptoIndicator, CryptoPriceData } from '@/shared/types/crypto';

interface IndicatorTableProps {
  indicators: CryptoIndicator[];
  cryptoPrices: CryptoPriceData[];
}

const IndicatorTable = memo(function IndicatorTable({ indicators, cryptoPrices }: IndicatorTableProps) {
  const formatValue = useMemo(() => (value: number, unit: string) => {
    if (unit === '%') {
      return `${value.toFixed(2)}%`;
    } else if (unit === 'DXY') {
      return value.toFixed(2);
    }
    return value.toString();
  }, []);

  const formatPrice = useMemo(() => (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price > 1 ? 2 : 6
    }).format(price);
  }, []);

  const formatMarketCap = useMemo(() => (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(2)}`;
  }, []);

  const formatDateFromAth = useMemo(() => (athDate: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - athDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1일 전';
    } else if (diffDays < 30) {
      return `${diffDays}일 전`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}개월 전`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years}년 전`;
    }
  }, []);

  const formatExactDate = useMemo(() => (athDate: Date) => {
    return athDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    });
  }, []);

  const calculateAthDifference = useMemo(() => (currentPrice: number, athPrice: number) => {
    const difference = currentPrice - athPrice;
    const percentage = ((difference / athPrice) * 100);
    return {
      difference,
      percentage,
      isPositive: difference >= 0
    };
  }, []);

  const isRecentAthRecord = useMemo(() => (athDate: Date, currentPrice: number, athPrice: number) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - athDate.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    const isWithinWeek = diffDays <= 7;
    const isAtOrNearAth = currentPrice >= athPrice * 0.99; // ATH의 99% 이상이면 최고가 근접
    
    return isWithinWeek && isAtOrNearAth;
  }, []);

  return (
    <div className="space-y-6">
      {/* 주요 지표 테이블 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">주요 투자 지표</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지표명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  현재값
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  전일 대비
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  변화율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  업데이트
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {indicators.map((indicator, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {indicator.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {formatValue(indicator.value, indicator.unit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm flex items-center font-mono ${
                      indicator.change >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {indicator.change >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {indicator.change >= 0 ? '+' : ''}
                      {formatValue(indicator.change, indicator.unit)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono ${
                      indicator.changePercent >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {indicator.changePercent >= 0 ? '+' : ''}
                      {indicator.changePercent.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {indicator.lastUpdated.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 암호화폐 가격 테이블 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">주요 암호화폐 현황</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  심볼
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  현재 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  직전 최고가
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ATH 대비
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h 변화
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  24h 변화율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시가총액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  거래량 (24h)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cryptoPrices.map((crypto, index) => {
                const isNewAthRecord = isRecentAthRecord(crypto.athDate, crypto.price, crypto.allTimeHigh);
                return (
                <tr key={index} className={`hover:bg-gray-50 ${isNewAthRecord ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {crypto.symbol}
                      </div>
                      {isNewAthRecord && (
                        <div className="ml-2 flex items-center">
                          <Trophy className="w-4 h-4 text-yellow-500 mr-1" />
                          <Star className="w-3 h-3 text-yellow-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {formatPrice(crypto.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {formatPrice(crypto.allTimeHigh)}
                    </div>
                    <div className="relative group">
                      <div className="text-xs text-gray-500 mt-1 cursor-help">
                        {formatDateFromAth(crypto.athDate)}
                      </div>
                      <div className="absolute left-0 top-full mt-1 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                        {formatExactDate(crypto.athDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      const athDiff = calculateAthDifference(crypto.price, crypto.allTimeHigh);
                      return (
                        <div className="text-sm">
                          <div className={`font-mono ${
                            athDiff.isPositive ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {athDiff.isPositive ? '+' : ''}
                            {formatPrice(athDiff.difference)}
                          </div>
                          <div className={`text-xs mt-1 ${
                            athDiff.isPositive ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {athDiff.isPositive ? '+' : ''}
                            {athDiff.percentage.toFixed(2)}%
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm flex items-center font-mono ${
                      crypto.change24h >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {crypto.change24h >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {crypto.change24h >= 0 ? '+' : ''}
                      {formatPrice(crypto.change24h)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono ${
                      crypto.changePercent24h >= 0 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {crypto.changePercent24h >= 0 ? '+' : ''}
                      {crypto.changePercent24h.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {formatMarketCap(crypto.marketCap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {formatMarketCap(crypto.volume24h)}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default IndicatorTable;