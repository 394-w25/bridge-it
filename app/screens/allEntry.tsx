import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  ScrollView,
  Modal
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getUserEntries, listenToUserEntries } from '../../backend/dbFunctions';
import { useUser } from '../../context/UserContext';

const { width, height } = Dimensions.get('window');

interface AllEntriesProps {
  visible: boolean;
  onClose: () => void;
}

interface JournalEntry {
  title: string;
  shortSummary: string;
  timestamp: string;
  day: string;
  date: string;
  categories?: string[];
  identifiedHardSkills?: string[];
  identifiedSoftSkills?: string[];
  reflection?: string;
}

const CATEGORIES = [
    { name: 'Academic', color: '#FDE68A' }, // Yellow
    { name: 'Personal', color: '#99E9F2' }, // Light Blue
    { name: 'Leadership', color: '#F8B4C0' }, // Pink
    { name: 'Research', color: '#BBF7D0' }, // Light Green
    { name: 'Project', color: '#FDAF75' }, // Orange
  ];

// Convert Firestore Timestamp to formatted day and date
function formatTimestamp(timestamp: string) {
  const dateObj = new Date(timestamp);
  return {
    day: dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    date: dateObj.getDate().toString().padStart(2, "0"),
  };
}

const AllEntriesModal: React.FC<AllEntriesProps> = ({ visible, onClose }) => {
  const { uid } = useUser();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');  // <--- Search state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryModalVisible, setEntryModalVisible] = useState(false);

  useEffect(() => {
    let isFirstLoad = true;

    async function loadInitialEntries() {
      if (uid) {
        const initialEntries = await getUserEntries(uid);
        const formattedEntries = initialEntries.map(entry => ({
          title: entry.title || "Untitled",
          shortSummary: entry.shortSummary || "No short summary available",
          timestamp: entry.timestamp.toDate().toISOString(),
          categories: Array.isArray(entry.categories) ? entry.categories : [],
          identifiedHardSkills: entry.hardSkills ? entry.hardSkills.split(",").map(skill => skill.trim()) : [],
          identifiedSoftSkills: entry.softSkills ? entry.softSkills.split(",").map(skill => skill.trim()) : [],
          reflection: entry.reflection || "No reflection provided.",
          ...formatTimestamp(entry.timestamp.toDate().toISOString()),
        }));
        setJournalEntries(formattedEntries);
      }
    }

    loadInitialEntries();

    const unsubscribe = uid ? listenToUserEntries(uid, (entries) => {
      if (!isFirstLoad) {
        const formattedEntries = entries.map(entry => ({
          ...entry,
          timestamp: entry.timestamp.toDate().toISOString(),
          ...formatTimestamp(entry.timestamp.toDate().toISOString()),
          categories: entry.categories || [],
        }));
        setJournalEntries(formattedEntries);
      }
      isFirstLoad = false;
    }) : null;

    return () => {
      if (uid) unsubscribe?.();
    };
  }, [uid]);

  const openEntryModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEntryModalVisible(true);
  };

  // 2. Filter the journal entries based on the searchQuery
  const filteredEntries = journalEntries.filter(entry => {
    // Convert to lowercase for case-insensitive match
    const lowerTitle = entry.title.toLowerCase() ? entry.title.toLowerCase() : '';
    const lowerSummary = entry.shortSummary.toLowerCase() ? entry.shortSummary.toLowerCase() : '';
    const lowerQuery = searchQuery.toLowerCase();

    
    const matchesSearch = lowerTitle.includes(lowerQuery) || lowerSummary.includes(lowerQuery);
    const matchesCategory =
      !selectedCategory || (entry.categories && entry.categories.includes(selectedCategory.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category)); // Toggle category selection
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
    <View style={styles.modalOverlay}>
    {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
      <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
        
        {/* White rectangle (modal content background) */}
        {/* <View style={styles.whiteRect} /> */}
        <View style={[styles.whiteRect, { pointerEvents: 'none' }]} />


        {/* Header with title and close button */}
        <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>All entries</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <FontAwesome name="close" size={24} color="#212121" />
            </TouchableOpacity>
        </View>


        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { outline: 'none' }]}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            underlineColorAndroid="transparent"
            selectionColor="transparent"
          />
        </View>

        {/* Category Chips */}
        {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}> */}
        <View style={styles.categoryContainer}>
        {CATEGORIES.map(cat => (
            <TouchableOpacity
            key={cat.name}
            style={[
                styles.categoryChip,
                { backgroundColor: cat.color },
                selectedCategory === cat.name && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryPress(cat.name)}
            >
            <Text
                style={[
                styles.categoryText,
                selectedCategory === cat.name && styles.categoryTextActive,
                ]}
            >
                {cat.name}
            </Text>
            </TouchableOpacity>
        ))}
        </View>

        {/* List of Journal Entries (filtered) */}
        <View style={{ flex: 1 }}>
            <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.timestamp}
            contentContainerStyle={[styles.entriesContainer, { flexGrow: 1 }]}
            keyboardShouldPersistTaps="handled" // Fix scroll issue
            renderItem={({ item }) => (
                <View style={styles.entryCard}>
                    <View style={styles.entryRow}>
                        {/* Left - Date */}
                        <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{item.day}</Text>
                        <Text style={styles.dayText}>{item.date}</Text>
                        </View>

                        {/* Middle - Title and Summary */}
                        <View style={styles.entryContent}>
                        <TouchableOpacity onPress={() => openEntryModal(item)}>
                            <Text style={styles.entryTitle}>{item.title}</Text>
                        </TouchableOpacity>

                        <Text style={styles.entrySummary}>{item.shortSummary}</Text>
                        </View>

                        {/* Right - Categories */}
                        <View style={styles.entryCategoriesContainer}>
                        {item.categories?.map(cat => (
                            console.log('cat', cat),
                            <View
                            key={cat}
                            style={[
                                styles.entryCategoryDot,
                                { backgroundColor: CATEGORIES.find(c => c.name.toLowerCase() === cat)?.color },
                            ]}
                            >
                            </View>
                        ))}
                        </View>
                    </View>
                </View>
            )}
            />
        </View>
      </LinearGradient>
      {/* </ScrollView> */}
    </View>

    {/* Entry Detail Modal */}
    <Modal animationType="slide" transparent={true} visible={entryModalVisible}>
        <View style={styles.entryModalOverlay}>
        
        <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.entryModalContainer}>
        {/* <View style={[styles.whiteRect2, { pointerEvents: 'none' }]} /> */}
        {/* <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}> */}
            {/* Back Button */}
            <TouchableOpacity onPress={() => setEntryModalVisible(false)} style={styles.backButton} >
              {/* <Text style={styles.backText}>←</Text> */}
              <View style={styles.backButtonInner}>
                <Text style={styles.backText}>←</Text>
            </View>
            </TouchableOpacity>

            <Text style={styles.title}>{selectedEntry?.title}</Text>

            {/* Categories */}
            <View style={styles.categoriesContainer}>
              {selectedEntry?.categories?.map(cat => (
                <View
                  key={cat}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: CATEGORIES.find(c => c.name.toLowerCase() === cat)?.color },
                  ]}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
            {/* Summary */}
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.entryText}>{selectedEntry?.shortSummary}</Text>

            {/* Identified Hard Skills */}
            <Text style={styles.sectionTitle}>Identified Hard Skills</Text>
            {selectedEntry?.identifiedHardSkills?.map(skill => (
              <Text key={skill} style={styles.listItem}>{skill}</Text>
            ))}

            {/* Identified Soft Skills */}
            <Text style={styles.sectionTitle}>Identified Soft Skills</Text>
            {selectedEntry?.identifiedSoftSkills?.map(skill => (
              <Text key={skill} style={styles.listItem}>{skill}</Text>
            ))}

            {/* Reflection */}
            <Text style={styles.sectionTitle}>Reflection</Text>
            <Text style={styles.entryText}>{selectedEntry?.reflection}</Text>
            </ScrollView>
          </LinearGradient>
          
        </View>
    </Modal>
    
    </Modal>
  );
};

export default AllEntriesModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent backdrop
    // justifyContent: 'center', // Align modal content at the center
  },
  container: {
    flex: 1,
    width: width,
    position: 'relative',
  },
  whiteRect: {
    position: 'absolute',
    top: 30,
    width: width,
    height: height - 64,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  whiteRect2: {
    position: 'absolute',
    top: 30,
    width: width,
    // height: height - 64,
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    // height: 60,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  titleContainer: {
    // Give it a fixed height so we can push the text down within that space
    height: 60,
    justifyContent: 'flex-end', // This pushes the text down to the bottom
  },
  headerTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 33,
    color: '#212121',
  },
  closeButton: {
    width: 48,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Search styles */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 120, // adjust as needed
    marginHorizontal: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 2, // ensure it's on top of the whiteRect
    borderWidth: 1,        // <--- Add
    borderColor: '#ccc', 
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },

  entriesContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  entryCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 16,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  dateContainer: {
    width: 60,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: "#777",
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: 22,
    color: "#000",
  },
  entryContent: {
    flex: 1,
    paddingLeft: 15,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#52AFA3",
  },
  entrySummary: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
  },
  entryCategoriesContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginLeft: 5,
    verticalAlign: 'top',
  },
  entryCategoryDot: {
    width: 13,
    height: 13,
    borderRadius: '50%',
    marginLeft: 5,
  },
  /* Category styles */
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    height: 40,
    zIndex: 2, // ensure it's above the whiteRect
  },
  categoryChip: {
    backgroundColor: '#F1F1F1',
    borderRadius: 16,
    width: 70,
    height: 28,
    alignItems: 'center', // Center text
    justifyContent: 'center', // Center text
    marginHorizontal: 4, // Keep small gap between buttons
  },
  categoryChipActive: {
    backgroundColor: '#29B4D8',
  },
  categoryText: {
    color: '#555',
    fontSize: 12,
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  categoryScrollView: {
    marginTop: 10,
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,  // Ensures the list uses remaining space
    marginTop: 8,
  },
  entryModalContainer: {
    width: width,
    flex: 1,
    marginTop: 30,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  entryModalOverlay: { flex: 1, justifyContent: 'center' },
  entryModalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, // Ensure it's above other elements
  },
  
  backButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0, // Prevents extra spacing
    marginBottom: 10,
  },
  
  backText: {
    fontSize: 20,
    color: '#007AFF',
    textAlign: 'center', 
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, marginTop: 30, },
  categoriesContainer: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 25 },
  entryText: { fontSize: 16, color: '#555', marginTop: 10 },
  listItem: { fontSize: 16, color: '#555', marginLeft: 10, marginTop: 5 },
});

