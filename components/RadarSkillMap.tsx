// RadarChart.tsx

import React from 'react';
import { View, Text, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';
import { RadarChart as RadarChartLib } from '@salmonco/react-native-radar-chart';

const { width } = Dimensions.get('window');

interface RadarChartProps {
  data?: Array<{label: string; value: number}>;
  startDate?: string;
  endDate?: string;
  title?: string;
}

// Adjust as you wish
const DEFAULT_DATA = [
  {label: 'Communication', value: 10},
  {label: 'Technical', value: 6},
  {label: 'Problem Solving', value: 10},
  {label: 'Teamwork', value: 4},
  {label: 'Leadership', value: 8},
];

export function RadarChart({
  data = DEFAULT_DATA,
  startDate = 'Feb 23 –',
  endDate = 'Mar 1',
  title = 'Your week in review',
}: RadarChartProps) {

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.dateText}>{startDate} {endDate}</Text>
        <Text style={styles.cardTitle}>{title}</Text>

        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <SafeAreaView style={styles.radarContainer}>
            {/* https://github.com/salmonco/react-native-radar-chart#readme */}
            <RadarChartLib
              data={data}
              maxValue={10}
              gradientColor={{
                startColor: '#FFFFFF',
                endColor: '#FFFFFF',
                count: 5,
              }}
              // circular stroke (inside to out)
              stroke={['#D2D2D2', '#D2D2D2', '#D2D2D2', '#D2D2D2', '#4A4A4A']}
              strokeWidth={[0.5, 0.5, 0.5, 0.5, 0.5]}
              strokeOpacity={[1, 1, 1, 1, 1]}

              // labels
              labelColor="#333333"
              labelFontFamily="DM Sans"
              labelSize={14}

              // coloured area inside
              dataFillColor="#4ECDC4"
              dataFillOpacity={0.5}
              dataStroke="#288C85"
              dataStrokeWidth={2}
              isCircle

              // division stroke inside graph
              divisionStroke="#D2D2D2"
            />
          </SafeAreaView>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: 'rgba(27, 28, 29, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    paddingVertical: 30,
    paddingHorizontal: 24,
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
  radarContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default RadarChart;
