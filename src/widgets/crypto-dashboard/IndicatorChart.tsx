'use client';

import React, { memo, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '@/shared/types/crypto';

interface IndicatorChartProps {
  title: string;
  data: ChartDataPoint[];
  color: string;
  unit: string;
  showKoreanColors?: boolean; // 한국식 색상 사용 여부
}

const IndicatorChart = memo(function IndicatorChart({ title, data, color, unit, showKoreanColors = false }: IndicatorChartProps) {
  const formatTooltipValue = useMemo(() => (value: number) => {
    if (unit === '%') {
      return `${value.toFixed(2)}%`;
    } else if (unit === 'DXY') {
      return value.toFixed(2);
    }
    return value.toString();
  }, [unit]);

  const formatYAxisTick = useMemo(() => (value: number) => {
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else if (unit === 'DXY') {
      return value.toFixed(1);
    }
    return value.toString();
  }, [unit]);

  const labelFormatter = useMemo(() => (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('ko-KR');
  }, []);

  const tickFormatter = useMemo(() => (value: string) => {
    const date = new Date(value);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }, []);

  // 데이터가 단일 포인트인 경우의 색상 결정 (현재값만 있는 경우)
  const dynamicColor = useMemo(() => {
    if (data.length === 1 || !showKoreanColors) {
      return color; // 기본 색상 사용
    }
    
    // 데이터가 여러 개인 경우 마지막과 첫 번째 값 비교
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    
    if (lastValue > firstValue) {
      return '#dc2626'; // 상승 - 빨간색 (tailwind red-600)
    } else if (lastValue < firstValue) {
      return '#2563eb'; // 하락 - 파란색 (tailwind blue-600)
    } else {
      return color; // 변화없음 - 기본 색상
    }
  }, [data, color, showKoreanColors]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={tickFormatter}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              tickFormatter={formatYAxisTick}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '12px'
              }}
              labelFormatter={labelFormatter}
              formatter={(value: number) => [formatTooltipValue(value), title]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={dynamicColor}
              strokeWidth={2}
              dot={{ fill: dynamicColor, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: dynamicColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default IndicatorChart;