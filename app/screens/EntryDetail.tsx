import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

type EntryDetailParams = {
  Entry: {
    entry: {
      title: string;
      categories: string[];
      shortSummary: string;
      identifiedHardSkills: string[];
      identifiedSoftSkills: string[];
      reflection?: string;
    };
  };
};

const EntryDetail = ({ route }: { route: RouteProp<EntryDetailParams, 'Entry'> }) => {
  const { entry } = route.params;
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{entry.title}</Text>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {entry.categories.map((cat: string) => (
          <Text key={cat} style={[styles.categoryChip, { backgroundColor: getCategoryColor(cat) }]}>
            {cat}
          </Text>
        ))}
      </View>

      {/* Summary */}
      <Text style={styles.sectionTitle}>Summary</Text>
      <Text style={styles.entryText}>{entry.shortSummary}</Text>

      {/* Identified Hard Skills */}
      <Text style={styles.sectionTitle}>Identified Hard Skills</Text>
      {entry.identifiedHardSkills.length > 0 ? (
        entry.identifiedHardSkills.map((skill: string) => <Text key={skill} style={styles.listItem}>• {skill}</Text>)
      ) : (
        <Text style={styles.entryText}>No hard skills identified.</Text>
      )}

      {/* Identified Soft Skills */}
      <Text style={styles.sectionTitle}>Identified Soft Skills</Text>
      {entry.identifiedSoftSkills.length > 0 ? (
        entry.identifiedSoftSkills.map((skill: string) => <Text key={skill} style={styles.listItem}>• {skill}</Text>)
      ) : (
        <Text style={styles.entryText}>No soft skills identified.</Text>
      )}

      {/* Reflection */}
      <Text style={styles.sectionTitle}>Reflection</Text>
      <Text style={styles.entryText}>{entry.reflection || "No reflection provided."}</Text>
    </ScrollView>
  );
};

// Helper function to match category colors
const getCategoryColor = (category: string) => {
  const CATEGORIES: Record<string, string> = {
    Academic: '#FDE68A',
    Personal: '#99E9F2',
    Leadership: '#F8B4C0',
    Research: '#BBF7D0',
    Project: '#FDAF75',
  };
  
  // Check if the category is a valid key
  return CATEGORIES[category as keyof typeof CATEGORIES] || '#ccc';
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  backButton: { marginBottom: 10 },
  backText: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  categoriesContainer: { flexDirection: 'row', marginBottom: 10 },
  categoryChip: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, marginRight: 5, color: 'white'
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  entryText: { fontSize: 16, color: '#555', marginTop: 5 },
  listItem: { fontSize: 16, marginLeft: 10, marginTop: 2 },
});

export default EntryDetail;
