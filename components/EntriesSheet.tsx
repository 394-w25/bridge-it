import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Modal,
  Animated,
  PanResponder
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getUserEntries, listenToUserEntries } from '../backend/dbFunctions';
import { useUser } from '../context/UserContext';
import { EntryDetailModal } from './EntryDetailModal';

const { width, height } = Dimensions.get('window');

function removeLeadingBulletOrDot(line: string): string {
  // Removes leading bullets, dots, or spaces: e.g. "• Node.js" → "Node.js", ". Node.js" → "Node.js"
  return line.replace(/^(\.|•|\s)+/, '');
}

interface EntriesSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface JournalEntry {
  id: string,
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

const EntriesSheet: React.FC<EntriesSheetProps> = ({ visible, onClose }) => {
  const { uid } = useUser();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryModalVisible, setEntryModalVisible] = useState(false);
  
  // Animation for the sheet
  const translateY = useRef(new Animated.Value(height)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: height,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 65,
            friction: 11
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    let isFirstLoad = true;

    async function loadInitialEntries() {
      if (uid) {
        const initialEntries = await getUserEntries(uid);
        const formattedEntries = initialEntries.map(entry => ({
          id: entry.id || "Undefined id",
          title: entry.title || "Untitled",
          shortSummary: entry.shortSummary || "No short summary available!",
          timestamp: entry.timestamp.toDate().toISOString(),
          categories: Array.isArray(entry.categories) ? entry.categories : [],
          identifiedHardSkills: entry.hardSkills
            ? entry.hardSkills
                .split(',')
                .map((skill) => removeLeadingBulletOrDot(skill.trim()))
            : [],
          identifiedSoftSkills: entry.softSkills
            ? entry.softSkills
                .split(',')
                .map((skill) => removeLeadingBulletOrDot(skill.trim()))
            : [],
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
          id: entry.id,
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

  // Filter the journal entries based on the searchQuery
  const filteredEntries = journalEntries.filter(entry => {
    const lowerTitle = entry.title.toLowerCase() ? entry.title.toLowerCase() : '';
    const lowerSummary = (entry.shortSummary || "no shortsummary here").toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = lowerTitle.includes(lowerQuery) || lowerSummary.includes(lowerQuery);
    const matchesCategory =
      !selectedCategory || (entry.categories && entry.categories.includes(selectedCategory.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(prev => (prev === category ? null : category)); // Toggle category selection
  };

  // Handle drag indicator press to close
  const handleDragIndicatorPress = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdropTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.sheetContainer,
            { transform: [{ translateY }] }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Drag indicator */}
          <TouchableOpacity 
            style={styles.dragIndicator} 
            onPress={handleDragIndicatorPress}
          >
            <View style={styles.dragIndicatorBar} />
          </TouchableOpacity>

          {/* Header with title */}
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
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Chips */}
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
              contentContainerStyle={styles.entriesContainer}
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
                        <View
                          key={cat}
                          style={[
                            styles.entryCategoryDot,
                            { backgroundColor: CATEGORIES.find(c => c.name.toLowerCase() === cat)?.color },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </Animated.View>
      </View>

      {selectedEntry && (
        <EntryDetailModal
          visible={entryModalVisible}
          entry={selectedEntry}
          onClose={() => setEntryModalVisible(false)}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    height: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicatorBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DDDDDD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    height: 60,
    justifyContent: 'flex-end',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 16,
    height: 40,
  },
  categoryChip: {
    backgroundColor: '#F1F1F1',
    borderRadius: 16,
    width: 70,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
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
  entriesContainer: {
    paddingBottom: 20,
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
    alignItems: 'flex-start',
  },
  entryCategoryDot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    marginLeft: 5,
  },
});

export default EntriesSheet;
