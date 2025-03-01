import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Link } from 'expo-router';
import { useUser } from '../../context/UserContext';
import AllEntriesModal from '../screens/allEntry'; // Import fixed modal

interface JournalEntry {
  title: string;
  summary: string;
  timestamp: string;
  day: string;
  date: string;
}

// Convert Firestore Timestamp to formatted day and date
function formatTimestamp(timestamp: string) {
  const dateObj = new Date(timestamp);
  return {
    day: dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(), // "MON"
    date: dateObj.getDate().toString().padStart(2, "0"), // "01"
  };
}

const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const };
  return date.toLocaleDateString('en-US', options);
};

export default function WelcomePage() {
  const { displayName } = useUser();
  const [allEntriesVisible, setAllEntriesVisible] = useState(false); // State to control modal visibility

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      {/* Welcome Section */}
      <View style={styles.fixedContent}>
        <Text style={styles.date}>{getCurrentDate()}</Text>
        <Text style={styles.welcomeMessage}>Hi, {displayName}!</Text>

        <Link href="/(tabs)/JournalEntryScreen" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Today's Journal</Text>
          </TouchableOpacity>
        </Link>

        {/* Button to Open "All Entries" Modal */}
        <TouchableOpacity style={styles.viewAllButton} onPress={() => setAllEntriesVisible(true)}>
          <Text style={styles.viewAllButtonText}>View All Entries</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for "All Entries" Page */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={allEntriesVisible}
        onRequestClose={() => setAllEntriesVisible(false)}
      >
        <AllEntriesModal visible={allEntriesVisible} onClose={() => setAllEntriesVisible(false)} />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#29B4D8',
    height: 110,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5,
  },
  logo: {
    width: 112,
    height: 50,
    resizeMode: 'contain',
  },
  fixedContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
    paddingBottom: 20, 
  },
  date: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B5563',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAllButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  viewAllButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

