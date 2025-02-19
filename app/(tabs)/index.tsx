import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Link } from 'expo-router';
export default function WelcomePage() {
  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const };
    return date.toLocaleDateString('en-US', options);
  };

  // Sample Journal Entries (Replace with API data if needed)
  const journalEntries = [
    { id: '1', day: 'SAT', date: '07', title: 'Group Project on Renewable Energy', description: 'Collaborated with peers to research solar energy solutions and presented findings in class.', location: 'Campus, Engineering Lab' },
    { id: '2', day: 'MON', date: '10', title: 'Python Automation Challenge', description: 'Coded a script to automate data entry and resolved bugs independently.', location: 'Home, San Francisco' },
    { id: '3', day: 'Fri', date: '14', title: 'Career Pathways Workshop', description: 'Organized a student workshop with alumni speakers, improving my leadership skills.', location: 'Student Center' },
    { id: '4', day: 'MON', date: '17', title: 'Science Fair Presentation', description: 'Presented a project on water filtration techniques and received positive feedback from judges.', location: 'School Auditorium' },
    // { id: '5', day: 'WED', date: '14', title: 'Hackathon Participation', description: 'Developed a mobile app prototype in 24 hours with a team.', location: 'Tech Conference' },
    // { id: '6', day: 'THU', date: '15', title: 'Networking Event', description: 'Met industry professionals and expanded career connections.', location: 'Downtown Hub' },
    // { id: '7', day: 'WED', date: '14', title: 'Hackathon Participation', description: 'Developed a mobile app prototype in 24 hours with a team.', location: 'Tech Conference' },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
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
        <FlatList
          data={journalEntries}
          keyExtractor={(item) => item.id}
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
                  {/* <Link href="/(tabs)/journal" asChild> */}
                    <TouchableOpacity>
                      <Text style={styles.entryTitle}>{item.title}</Text>
                    </TouchableOpacity>
                  {/* </Link> */}
                  <Text style={styles.entryDescription}>{item.description}</Text>
                  <Text style={styles.entryLocation}>• {item.location}</Text>
                </View>
              </View>
            </View>
          )}
          // contentContainerStyle={{ paddingBottom: 1000 }} // Prevents last item from being cut off
          ListFooterComponent={<View style={{ height: 10 }} />} // Adds space at the bottom
          showsVerticalScrollIndicator={true} // Hides scrollbar
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