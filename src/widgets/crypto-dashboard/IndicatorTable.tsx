'use client';

import React, { memo, useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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
              {cryptoPrices.map((crypto, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {crypto.symbol}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {formatPrice(crypto.price)}
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

export default IndicatorTable;