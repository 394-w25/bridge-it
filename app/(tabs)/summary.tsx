import React from 'react';
import { View, Image, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface AchievementScreenParams {
  type?: string;
  title?: string;
  summary?: string;
  hardSkills?: string;
  softSkills?: string;
  reflection?: string;
}

export default function AchievementScreen() {
  // Use a type assertion to bypass the generic constraint error.
  const params = useLocalSearchParams() as AchievementScreenParams;
  const { type, title, summary, hardSkills, softSkills, reflection } = params;

  // const summaryPoints = description ? description.split(/\n|\. /).filter(Boolean) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Journal</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{type} Achievement</Text>

        <Text style={styles.label}>Title:</Text>
        <Text style={styles.value}>{title}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitleSummary}>Summary:</Text>
          <Text style={styles.sectionContent}>{summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleHardskills}>Identified Hard Skills</Text>
          <Text style={styles.sectionContent}>{hardSkills}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleSoftskills}>Identified Soft Skills</Text>
          <Text style={styles.sectionContent}>{softSkills}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleReflection}>Reflection for Interview</Text>
          <Text style={styles.sectionContent}>{reflection}</Text>
        </View>
      
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#40b4d8',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    height: 250,
    marginBottom: -56,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a000a0',
    marginTop: 10,
  },
  summaryContainer: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  section: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
  },
  sectionTitleSummary: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a000a0',
    marginBottom: 5,
  },
  sectionTitleHardskills: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF5350',
    marginBottom: 5,
  },
  sectionTitleSoftskills: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C6BC0',
    marginBottom: 5,
  },
  sectionTitleReflection: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#66BB6A',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
  },
});
