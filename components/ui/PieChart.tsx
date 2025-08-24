import { PieChartData } from '@/lib/charts';
import React from 'react';
import { View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  strokeWidth?: number;
}

export function PieChart({ data, size = 200, strokeWidth = 2 }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <G>
            <Path
              d={`M ${size / 2} ${size / 2} L ${size / 2} ${size / 2 - 50} A 50 50 0 0 1 ${size / 2 + 50} ${size / 2} Z`}
              fill="#e5e7eb"
            />
            <SvgText
              x={size / 2}
              y={size / 2 + 5}
              fontSize="14"
              fill="#6b7280"
              textAnchor="middle"
            >
              No data
            </SvgText>
          </G>
        </Svg>
      </View>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  let currentAngle = -90; // Start from top

  const paths = data.map((item, index) => {
    const percentage = item.percentage / 100;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    // Convert angles to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    // Calculate start and end points
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    // Determine if we need to draw a large arc
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Create the path
    const path = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
    
    currentAngle = endAngle;
    
    return (
      <Path
        key={index}
        d={path}
        fill={item.color}
        stroke="#ffffff"
        strokeWidth={strokeWidth}
      />
    );
  });

  // Add labels
  const labels = data.map((item, index) => {
    if (item.percentage < 5) return null; // Skip small slices
    
    const percentage = item.percentage / 100;
    const angle = (percentage * 360) / 2 + currentAngle - (percentage * 360);
    const labelRadius = radius * 0.7;
    const labelAngle = (angle * Math.PI) / 180;
    
    const x = center + labelRadius * Math.cos(labelAngle);
    const y = center + labelRadius * Math.sin(labelAngle);
    
    return (
      <SvgText
        key={`label-${index}`}
        x={x}
        y={y}
        fontSize="12"
        fill="#ffffff"
        textAnchor="middle"
      >
        {item.percentage}%
      </SvgText>
    );
  });

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <G>
          {paths}
          {labels}
        </G>
      </Svg>
    </View>
  );
}
