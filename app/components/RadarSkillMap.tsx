// RadarChart.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface RadarChartProps {
  // You can pass in actual data if you want
  // each skill is a value between 0 and 10
  data?: {
    communication: number;
    leadership: number;
    teamwork: number;
    problemSolving: number;
    technical: number;
  };
  startDate?: string;  // e.g. "Feb 23 –"
  endDate?: string;    // e.g. "Mar 1"
  title?: string;      // e.g. "Your week in review"
}

interface SimpleRadarChartProps {
  data?: {
    communication: number;
    leadership: number;
    teamwork: number;
    problemSolving: number;
    technical: number;
  };
}

// Adjust as you wish
const DEFAULT_DATA = {
  communication: 7,
  leadership: 6,
  teamwork: 8,
  problemSolving: 9,
  technical: 5,
};

export function RadarChart({
  data = DEFAULT_DATA,
  startDate = 'Feb 23 –',
  endDate = 'Mar 1',
  title = 'Your week in review',
}: RadarChartProps) {
  // We'll assume a max skill value of 10 for scaling.
  const maxValue = 10;

  // Skills in the order we want them around the circle
  const skillKeys = [
    'communication',
    'leadership',
    'teamwork',
    'technical',
    'problemSolving',
  ] as const;

  // Convert skill name -> angle around the circle
  // We have 5 data points, so each is 72 degrees apart (360/5).
  const angleSlice = (2 * Math.PI) / skillKeys.length;

  // Radar size (we match the Figma shape ~250px for the largest circle).
  // We'll center it in the container.
  const chartSize = 250;
  const center = chartSize / 2;

  // "Rings" in the radar (we'll draw 5 concentric circles).
  const ringCount = 5;
  const ringRadius = chartSize / 2 / ringCount; // distance between each ring

  // Helper to convert a skill value (0..10) to (x,y) coords on the radar
  // given which "slice" it is on
  const getCoordinates = (index: number, value: number) => {
    const angle = angleSlice * index - Math.PI / 2; // start from top
    const radius = (value / maxValue) * (chartSize / 2);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Build the polygon points from data
  const polygonPoints = skillKeys
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, data[skill]);
      return `${x},${y}`;
    })
    .join(' ');

  // We'll place labels around the outer ring
  // The label coordinates are based on the skill's angle but pinned further out
  const labelOffset = 0; // push text out beyond the largest circle
  const getLabelCoordinates = (index: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = center + (chartSize / 2 + labelOffset) * Math.cos(angle) + width / 2 - 160;
    const y = center + (chartSize / 2 + labelOffset) * Math.sin(angle) + 94;
    return { x, y };
  };

  return (
    <View style={styles.container}>
      {/* White card that holds the entire radar + labels */}
      <View style={styles.card}>
        {/* Date + Title */}
        <Text style={styles.dateText}>{startDate} {endDate}</Text>
        <Text style={styles.cardTitle}>{title}</Text>

        {/* SVG Radar */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Svg width={chartSize} height={chartSize}>
            {/* Draw concentric circles (the "rings") */}
            {[...Array(ringCount)].map((_, i) => (
              <Circle
                key={`ring-${i}`}
                cx={center}
                cy={center}
                r={ringRadius * (i + 1)}
                stroke={i === ringCount - 1 ? '#4A4A4A' : '#E8E8E8'} 
                strokeWidth={i === ringCount - 1 ? 1 : 1}
                fill="none"
              />
            ))}

            {/* Draw the lines for each axis */}
            {skillKeys.map((skill, i) => {
              const { x, y } = getCoordinates(i, maxValue);
              return (
                <Line
                  key={`axis-${skill}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#E8E8E8"
                  strokeWidth={1}
                />
              );
            })}

            {/* Draw the polygon for the data */}
            <Polygon
              points={polygonPoints}
              fill="rgba(78, 205, 196, 0.5)" // matches your #4ECDC4 with 50% alpha
              stroke="#288C85"
              strokeWidth={2}
            />
          </Svg>
        </View>

        {/* Skill Labels around the chart */}
        {skillKeys.map((skill, i) => {
          const { x, y } = getLabelCoordinates(i);
          const skillLabel = toTitleCase(skill); // e.g. "Communication"
          return (
            <Text
              key={`label-${skill}`}
              style={[
                styles.skillLabel,
                {
                  left: x - 20, // offset horizontally
                  top: y - 10,  // offset vertically
                },
              ]}
            >
              {skillLabel}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

export function SimpleRadarChart({
  data = DEFAULT_DATA,
}: SimpleRadarChartProps) {
  // We'll assume a max skill value of 10 for scaling.
  const maxValue = 10;

  // Skills in the order we want them around the circle
  const skillKeys = [
    'communication',
    'leadership',
    'teamwork',
    'technical',
    'problemSolving',
  ] as const;

  // Convert skill name -> angle around the circle
  // We have 5 data points, so each is 72 degrees apart (360/5).
  const angleSlice = (2 * Math.PI) / skillKeys.length;

  // Radar size (we match the Figma shape ~250px for the largest circle).
  // We'll center it in the container.
  const chartSize = 250;
  const center = chartSize / 2;

  // "Rings" in the radar (we'll draw 5 concentric circles).
  const ringCount = 5;
  const ringRadius = chartSize / 2 / ringCount; // distance between each ring

  // Helper to convert a skill value (0..10) to (x,y) coords on the radar
  // given which "slice" it is on
  const getCoordinates = (index: number, value: number) => {
    const angle = angleSlice * index - Math.PI / 2; // start from top
    const radius = (value / maxValue) * (chartSize / 2);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Build the polygon points from data
  const polygonPoints = skillKeys
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, data[skill]);
      return `${x},${y}`;
    })
    .join(' ');

  // We'll place labels around the outer ring
  // The label coordinates are based on the skill's angle but pinned further out
  const labelOffset = 0; // push text out beyond the largest circle
  const getLabelCoordinates = (index: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const x = center + (chartSize / 2 + labelOffset) * Math.cos(angle) + width / 2 - 160;
    const y = center + (chartSize / 2 + labelOffset) * Math.sin(angle) + 16;
    return { x, y };
  };

  return (
    <View style={simpleStyles.container}>
      {/* White card that holds the entire radar + labels */}
      
        {/* SVG Radar */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Svg width={chartSize} height={chartSize}>
            {/* Draw concentric circles (the "rings") */}
            {[...Array(ringCount)].map((_, i) => (
              <Circle
                key={`ring-${i}`}
                cx={center}
                cy={center}
                r={ringRadius * (i + 1)}
                stroke={i === ringCount - 1 ? '#4A4A4A' : '#E8E8E8'} 
                strokeWidth={i === ringCount - 1 ? 1 : 1}
                fill="none"
              />
            ))}

            {/* Draw the lines for each axis */}
            {skillKeys.map((skill, i) => {
              const { x, y } = getCoordinates(i, maxValue);
              return (
                <Line
                  key={`axis-${skill}`}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="#E8E8E8"
                  strokeWidth={1}
                />
              );
            })}

            {/* Draw the polygon for the data */}
            <Polygon
              points={polygonPoints}
              fill="rgba(78, 205, 196, 0.5)" // matches your #4ECDC4 with 50% alpha
              stroke="#288C85"
              strokeWidth={2}
            />
          </Svg>
        </View>

        {/* Skill Labels around the chart */}
        {skillKeys.map((skill, i) => {
          const { x, y } = getLabelCoordinates(i);
          const skillLabel = toTitleCase(skill); // e.g. "Communication"
          return (
            <Text
              key={`label-${skill}`}
              style={[
                simpleStyles.skillLabel,
                {
                  left: x - 20, // offset horizontally
                  top: y - 10,  // offset vertically
                },
              ]}
            >
              {skillLabel}
            </Text>
          );
        })}
      
    </View>
  );
}

// Just a helper to convert "problemSolving" -> "Problem Solving"
function toTitleCase(text: string) {
  // split on capital letters to handle "problemSolving"
  const spaced = text.replace(/([A-Z])/g, ' $1').trim();
  // uppercase first letter of each word
  return spaced.replace(/\b\w/g, (char) => char.toUpperCase());
}

const simpleStyles = StyleSheet.create({
  container: {
    // This container can be adjusted or wrapped as needed
    width: width - 32,
    marginTop: 16,
    marginBottom: 70,
  },
  skillLabel: {
    position: 'absolute',
    width: 60,
    textAlign: 'center',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#333333',
  },
});

const styles = StyleSheet.create({
  container: {
    // This container can be adjusted or wrapped as needed
    width: width,
    alignItems: 'center',
    
  },
  card: {
    width: width - 32,
    height: 428,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: 'rgba(27, 28, 29, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  dateText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: '#333333',
  },
  cardTitle: {
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 30,
    color: '#333333',
    marginBottom: 10,
  },
  skillLabel: {
    position: 'absolute',
    width: 60,
    textAlign: 'center',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#333333',
  },
});

export default RadarChart;
