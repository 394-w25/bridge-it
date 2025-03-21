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
import { getUserEntries, listenToUserEntries, updateUserEntry } from '../../backend/dbFunctions';
import { useUser } from '../../context/UserContext';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../styles/color';
import { JournalEntry as ImportedJournalEntry } from '../../types/journal';

const { width, height } = Dimensions.get('window');

interface AllEntriesProps {
  onClose: () => void;
  onEntrySelect?: (entry: ImportedJournalEntry) => void;
}

type JournalEntry = ImportedJournalEntry;

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


function removeLeadingBulletOrDot(line: string): string {
  // Removes leading bullets, dots, or spaces: e.g. "• Node.js" → "Node.js", ". Node.js" → "Node.js"
  return line.replace(/^(\.|•|\s)+/, '');
}


const AllEntriesModal: React.FC<AllEntriesProps> = ({ onClose, onEntrySelect }) => {
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
          // identifiedHardSkills: entry.hardSkills ? entry.hardSkills.split(",").map(skill => skill.trim()) : [],
          // identifiedSoftSkills: entry.softSkills ? entry.softSkills.split(",").map(skill => skill.trim()) : [],
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

  const handleEntryPress = (item: JournalEntry) => {
    if (onEntrySelect) {
      onEntrySelect(item);
    } else {
      // Fall back to the old behavior if onEntrySelect is not provided
      setSelectedEntry(item);
      setEntryModalVisible(true);
    }
  };

  // 2. Filter the journal entries based on the searchQuery
  const filteredEntries = journalEntries.filter(entry => {
    const lowerTitle = entry.title.toLowerCase();
    const lowerSummary = (entry.shortSummary || "no shortsummary here").toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch = lowerTitle.includes(lowerQuery) || lowerSummary.includes(lowerQuery);
    const matchesCategory =
      !selectedCategory ||
      (entry.categories &&
        entry.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(prev => (prev === category ? null : category)); // Toggle category selection
    };

  return (
    <View style={styles.container}>
      {/* White rectangle (content background) */}
      <View style={[styles.whiteRect, { pointerEvents: 'none' }]} />
        <View style={styles.contentContainer}>
          {/* Header with title and close button */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={18} color={colors.neutral600} />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>All entries</Text>
            </View>
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
          <View style={{ flex: 1, alignSelf: 'stretch' }}>
              <FlatList
              style={{ flex: 1 }}
              data={filteredEntries}
              showsVerticalScrollIndicator={true}
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
                          <TouchableOpacity onPress={() => handleEntryPress(item)}>
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
                              >
                              </View>
                          ))}
                          </View>
                      </View>
                  </View>
              )}
              />
          </View>
        </View>



        {selectedEntry && (
          <EntryDetailModal
            visible={entryModalVisible}
            entry={selectedEntry}
            onClose={() => setEntryModalVisible(false)}
          />
        )}

{/* List of Journal Entries (filtered) 
        <View style={{ flex: 1 }}>
            <FlatList
            data={filteredEntries}
            keyExtractor={(item) => item.timestamp}
            contentContainerStyle={[styles.entriesContainer, { flexGrow: 1 }]}
            keyboardShouldPersistTaps="handled" // Fix scroll issue
            renderItem={({ item }) => (
                <View style={styles.entryCard}>
                    <View style={styles.entryRow}>

                        <View style={styles.dateContainer}>
                        <Text style={styles.dateText}>{item.day}</Text>
                        <Text style={styles.dayText}>{item.date}</Text>
                        </View>


                        <View style={styles.entryContent}>
                        <TouchableOpacity onPress={() => openEntryModal(item)}>
                            <Text style={styles.entryTitle}>{item.title}</Text>
                        </TouchableOpacity>

                        <Text style={styles.entrySummary}>{item.shortSummary}</Text>
                        </View>


                        <View style={styles.entryCategoriesContainer}>
                        {item.categories?.map(cat => (
                            console.log('cat', cat),
                            <View
                            key={cat}
                            style={[
                                styles.entryCategoryDot,
                                { backgroundColor: CATEGORIES.find(c => c.name.toLowerCase() === cat.trim().toLowerCase())?.color },
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
        </View>
*/} 

    </View>
  );
};

interface EntryDetailModalProps {
    visible: boolean;
    entry: JournalEntry;
    onClose: () => void;
  }
  

const EntryDetailModal: React.FC<EntryDetailModalProps> = ({ visible, entry, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState<JournalEntry>(entry);
  const [categoryText, setCategoryText] = useState(
    entry.categories?.join(', ') || ''
  );

  const { uid } = useUser();

  useEffect(() => {
    setCategoryText(entry.categories?.join(', ') || '');
  }, [entry.categories]);

  useEffect(() => {
    setEditedEntry(entry);
    setEditMode(false);
  }, [entry]);

  const handleEdit = async () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      if (!uid) {
        console.error("User ID is null");
        return;
      }
      
      await updateUserEntry(uid, editedEntry.id, {
        title: editedEntry.title || "Untitled",
        hardSkills: editedEntry.identifiedHardSkills ? editedEntry.identifiedHardSkills.join(', ') : "",
        softSkills: editedEntry.identifiedSoftSkills ? editedEntry.identifiedSoftSkills.join(', ') : "",
        reflection: editedEntry.reflection,
        categories: editedEntry.categories ?? [],
        shortSummary: editedEntry.shortSummary || "No short summary available",
      });
      setEditMode(false);
      onClose();
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };


  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.entryModalOverlay}>
        <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.entryModalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

        
          {editMode ? (
            <TextInput
              style={styles.titleInput}
              value={editedEntry.title}
              onChangeText={(text) => setEditedEntry({ ...editedEntry, title: text })}
              multiline
            />
          ) : (
            <Text style={styles.title}>{editedEntry.title}</Text>
          )}

          <ScrollView showsVerticalScrollIndicator={false}>
            {editMode ? (
              <TextInput
                style={styles.entryTextInputCat}
                value={categoryText}
                onChangeText={(text) => {
                  if (text.slice(-1) === ',' && !text.endsWith(', ')) {
                    text += ' ';
                  }
                  setCategoryText(text);
                }}
                onBlur={() => {
                  const updatedCategories = categoryText
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
                  setEditedEntry({ ...editedEntry, categories: updatedCategories });
                  setCategoryText(updatedCategories.join(', '));
                }}
              />
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {editedEntry.categories && editedEntry.categories.length > 0 ? (
                  editedEntry.categories.map((cat, index) => {
                    const matchedCat = CATEGORIES.find(
                      (c) =>
                        c.name.trim().toLowerCase() === cat.trim().toLowerCase()
                    );
                    return (
                      <View
                        key={index}
                        style={[
                          styles.categoryBadge,
                          { backgroundColor: matchedCat?.color || '#D1D5DB' },
                        ]}
                      >
                        <Text style={styles.categoryBadgeText}>{cat}</Text>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.entryText}>None</Text>
                )}
              </View>
            )}



            <Text style={styles.sectionTitle}>Summary</Text>
            {editMode ? (
              <TextInput
                style={styles.entryTextInput}
                value={editedEntry.shortSummary}
                onChangeText={(text) => setEditedEntry({ ...editedEntry, shortSummary: text })}
                multiline
              />
            ) : (
              <Text style={styles.entryText}>{editedEntry.shortSummary}</Text>
            )}

            <Text style={styles.sectionTitle}>Identified Hard Skills</Text>
            
            {editMode ? (
              <TextInput
              style={styles.entryTextInput}
              multiline
              // Display each line with a bullet prefix
              value={
                (editedEntry.identifiedHardSkills || [])
                  .map((line) => `• ${line}`)
                  .join('\n')
              }
              onChangeText={(text) => {
                // Split the text by newline and remove any leading bullet if present.
                // Do not filter out empty lines here so that a new line remains empty.
                const lines = text.split('\n').map((line) => line.replace(/^•\s*/, ''));
                setEditedEntry({ ...editedEntry, identifiedHardSkills: lines });
              }}
              onBlur={() => {
                // When the user leaves the field, remove any empty lines.
                setEditedEntry((prev) => ({
                  ...prev,
                  identifiedHardSkills: (prev.identifiedHardSkills || []).filter(
                    (line) => line.trim().length > 0
                  ),
                }));
              }}
            />
            
            
            ) : (
              <Text style={styles.entryText}>
                {(editedEntry.identifiedHardSkills || [])
                    .map((line) => `• ${line}`)
                    .join('\n')}
              </Text>
            )}

          <Text style={styles.sectionTitle}>Identified Soft Skills</Text>
            {editMode ? (
              <TextInput
              style={styles.entryTextInput}
              multiline
              // Display each line with a bullet prefix
              value={
                (editedEntry.identifiedSoftSkills || [])
                  .map((line) => `• ${line}`)
                  .join('\n')
              }
              onChangeText={(text) => {
                // Split the text by newline and remove any leading bullet if present.
                // Do not filter out empty lines here so that a new line remains empty.
                const lines = text.split('\n').map((line) => line.replace(/^•\s*/, ''));
                setEditedEntry({ ...editedEntry, identifiedSoftSkills: lines });
              }}
              onBlur={() => {
                // When the user leaves the field, remove any empty lines.
                setEditedEntry((prev) => ({
                  ...prev,
                  identifiedSoftSkills: (prev.identifiedSoftSkills || []).filter(
                    (line) => line.trim().length > 0
                  ),
                }));
              }}
            />
            
            
            ) : (
              <Text style={styles.entryText}>
                {(editedEntry.identifiedSoftSkills || [])
                    .map((line) => `• ${line}`)
                    .join('\n')}
              </Text>
            )}
            {/* <Text style={styles.sectionTitle}>Identified Soft Skills</Text>
            {editMode ? (
              <TextInput
                style={styles.entryTextInput}
                value={editedEntry.identifiedSoftSkills ? editedEntry.identifiedSoftSkills.join(', ') : ''}
                onChangeText={(text) => setEditedEntry({ ...editedEntry, identifiedSoftSkills: text.split(',').map(s => s.trim()) })}
                multiline
              />
            ) : (
              <Text style={styles.entryText}>
                {editedEntry.identifiedSoftSkills && editedEntry.identifiedSoftSkills.length > 0
                  ? editedEntry.identifiedSoftSkills.join(', ')
                  : 'None'}
              </Text>
            )} */}

            <Text style={styles.sectionTitle}>Reflection</Text>
            {editMode ? (
              <TextInput
                style={styles.entryTextInput}
                value={editedEntry.reflection}
                onChangeText={(text) => setEditedEntry({ ...editedEntry, reflection: text })}
                multiline
              />
            ) : (
              <Text style={styles.entryText}>{editedEntry.reflection}</Text>
            )}
    
          </ScrollView>

          {!editMode ? (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <FontAwesome name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    </Modal>
  );
}

export default AllEntriesModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    width: '95%',
    alignItems: 'center',
  },

  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#212121',
  },
  
  whiteRect: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height,
    backgroundColor: '#FFFFFF',
  },
  header: {
    top: 10,
    width: '100%',
    zIndex: 1,
  },
  titleContainer: {
    justifyContent: 'flex-end', // This pushes the text down to the bottom
  },
  headerTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 40,
    color: colors.neutralBlack,
  },
  closeButton: {
    padding: 6,
    width: '100%',
    alignItems: 'flex-end',
  },

  /* Search styles */
  searchContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 2, // ensure it's on top of the whiteRect
    borderWidth: 1,        // <--- Add
    borderColor: '#ccc', 
  },
  searchIcon: {
    marginRight: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    fontFamily: 'DM Sans',
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
    width: '100%',
    marginTop: 12,
    zIndex: 2, // ensure it's above the whiteRect
    gap: 12,
    overflow: 'scroll',
  },
  categoryChip: {
    backgroundColor: '#F1F1F1',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'center', // Center text
    justifyContent: 'center', // Center text
  },
  categoryChipActive: {
    backgroundColor: '#29B4D8',
  },
  categoryText: {
    color: colors.neutralBlack,
    fontSize: 12,
    fontFamily: 'DM Sans',
  },
  categoryTextActive: {
    color: '#FFF',
    fontWeight: '600',
    fontFamily: 'DM Sans',
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
  titleInput: { fontSize: 28, marginTop: 20, fontWeight: 'bold',paddingBottom: 5 },
//   sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 25 },
//   entryText: { fontSize: 16, color: '#555', marginTop: 10 },
  entryTextInput: { fontSize: 16, marginTop: 20, borderWidth: 1, height: 120, padding: 5},
  entryTextInputCat: { fontSize: 16, marginTop: 20, borderWidth: 1, height: 30, padding: 5},
  editButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007AFF', padding: 10, borderRadius: 50 },
  saveButton: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#28A745', padding: 12, borderRadius: 50 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

