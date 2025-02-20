import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { getUserEntries, listenToUserEntries } from '../../backend/dbFunctions';


interface JournalEntry {
  title: string;
  content: string;
  timestamp: string;
  day: string;
  date: string;
}

const getCurrentDate = () => {
  const date = new Date();
  const options = { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const };
  return date.toLocaleDateString('en-US', options);
};

export default function WelcomePage() {
  const userId = '0R5lwzBSq4dkMb2FXvJC';
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const parseTimestamp = (timestamp: any) => {
    if (!timestamp || !timestamp.toDate) return { day: "INVALID", date: "DATE" };
  
    const dateObj = timestamp.toDate();
  
    return {
      day: dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(), 
      date: dateObj.getDate().toString().padStart(2, "0"), 
    };
  };
  


  useEffect(() => {
    let isFirstLoad = true; // Track whether it's the initial load

    async function loadInitialEntries() {
      const initialEntries = await getUserEntries(userId); // Fetch initial data once
      const formattedEntries = initialEntries.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp.toDate().toISOString(), // Convert Firestore Timestamp to string
        ...parseTimestamp(entry.timestamp),
      }));
      setJournalEntries(formattedEntries); // Set initial entries before real-time updates
    }

    loadInitialEntries();

    const unsubscribe = listenToUserEntries(userId, (entries) => {
      const formattedEntries = entries.map((entry) => ({
        ...entry,
        timestamp: entry.timestamp.toDate().toISOString(), // Convert Firestore Timestamp to string
        ...parseTimestamp(entry.timestamp),
      }));
      
      if (!isFirstLoad) {
        setJournalEntries(formattedEntries);
      }
      isFirstLoad = false;
    });

    return () => unsubscribe(); // Cleanup listener when the component unmounts
  }, [userId]);

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
      </View>

      {/* Welcome Section */}
      <View style={styles.fixedContent}>
        <Text style={styles.date}>{getCurrentDate()}</Text>
        <Text style={styles.welcomeMessage}>Welcome back Guillermo!</Text>

        {/* Button */}
        <Link href="/(tabs)/two" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Today's Journal</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.listContainer}>
        <FlatList<JournalEntry>
          data={journalEntries}
          keyExtractor={(item) => item.timestamp} // Use timestamp as unique
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <View style={styles.entryRow}>
                {/* Date Section (Left) */}
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{item.day}</Text> 
                  <Text style={styles.dayText}>{item.date}</Text>
                </View>

                {/* Journal Entry Content (Right) */}
                <View style={styles.entryContent}>
                  <TouchableOpacity>
                    <Text style={styles.entryTitle}>{item.title}</Text>
                  </TouchableOpacity>
                  <Text style={styles.entryDescription}>{item.content || "No content available"}</Text>
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>

      
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 40,
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
    // fontFamily: 'System',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4B5563',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    
  },
  entryContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  entryTitle: {
    fontSize: 14,
    color: '#29B4D8',
    marginTop: 5,
  },
  entryDescription: {
    fontSize: 12,
    color: '#333',
    marginTop: 1,
  },
  entryLocation: {
    fontSize: 12,
    color: '#333',
    marginTop: 1,
  },

  // Arrange Date & Text in a Row
entryRow: {
  flexDirection: 'row',   
  alignItems: 'center',   
},

// Left Side - Date
dateContainer: {
  width: 60,   
  alignItems: 'center', 
},

dateText: {
  fontSize: 12, 
  color: '#777',
  textTransform: 'uppercase', 
},

dayText: {
  fontSize: 22, 
  color: '#000',
  alignItems: 'center',
},

// Right Side - Journal Entry Content
entryContent: {
  flex: 1,  
  paddingLeft: 15, 
},

fixedContent: {
  alignItems: 'center',
  paddingHorizontal: 20,
  marginTop: 40,

  paddingBottom: 20, 
},

listContainer: {
  flex: 1,
},


});