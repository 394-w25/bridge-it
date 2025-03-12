import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput
} from 'react-native';
import { Sheet } from 'tamagui';
import AllEntriesModal from '../app/screens/allEntry';
import { JournalEntry } from '../types/journal';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUser } from '../context/UserContext';
import { updateUserEntry } from '../backend/dbFunctions';
import { colors } from '@/app/styles/color';

const { width, height } = Dimensions.get('window');

const CATEGORIES = [
    { name: 'Academic', color: '#FDE68A' }, // Yellow
    { name: 'Personal', color: '#99E9F2' }, // Light Blue
    { name: 'Leadership', color: '#F8B4C0' }, // Pink
    { name: 'Research', color: '#BBF7D0' }, // Light Green
    { name: 'Project', color: '#FDAF75' }, // Orange
  ];
  
interface EntriesSheetProps {
  visible: boolean;
  onClose: () => void;
}

const EntriesSheet: React.FC<EntriesSheetProps> = ({ visible, onClose }) => {
  const [modal, setModal] = useState(true);
  const [open, setOpen] = useState(visible);
  const [position, setPosition] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showEntryDetail, setShowEntryDetail] = useState(false);
  
  // For editing entry
  const [editMode, setEditMode] = useState(false);
  const [editedEntry, setEditedEntry] = useState<JournalEntry | null>(null);
  const [categoryText, setCategoryText] = useState('');
  
  const { uid } = useUser();
  
  useEffect(() => {
    setOpen(visible);
  }, [visible]);

  useEffect(() => {
    if (selectedEntry) {
      setEditedEntry(selectedEntry);
      setCategoryText(selectedEntry.categories?.join(', ') || '');
    }
  }, [selectedEntry]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose();
    }
  };

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEditedEntry(entry);
    setCategoryText(entry.categories?.join(', ') || '');
    setEditMode(false);
    setShowEntryDetail(true);
  };

  const handleBackToList = () => {
    setShowEntryDetail(false);
    setSelectedEntry(null);
    setEditedEntry(null);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!editedEntry || !uid) return;
    
    try {
      await updateUserEntry(uid, editedEntry.id, {
        title: editedEntry.title || "Untitled",
        hardSkills: editedEntry.identifiedHardSkills ? editedEntry.identifiedHardSkills.join(', ') : "",
        softSkills: editedEntry.identifiedSoftSkills ? editedEntry.identifiedSoftSkills.join(', ') : "",
        reflection: editedEntry.reflection,
        categories: editedEntry.categories ?? [],
        shortSummary: editedEntry.shortSummary || "No short summary available",
        identifiedHardSkills: editedEntry.identifiedHardSkills || [],
        identifiedSoftSkills: editedEntry.identifiedSoftSkills || [],
      });
      setEditMode(false);
      // Update the selected entry with edited values
      setSelectedEntry(editedEntry);
    } catch (error) {
      console.error("Failed to update entry:", error);
    }
  };

  // Render the entry detail content
  const renderEntryDetail = () => {
    if (!editedEntry) return null;
    
    return (
      <View style={styles.entryDetailContainer}>
        <TouchableOpacity onPress={handleBackToList} style={styles.backTextContainer}>
          <FontAwesome name="angle-left" size={24} color={colors.neutral600} />
          <Text style={styles.backText}>Back to entries</Text>
        </TouchableOpacity>

        
        <ScrollView showsVerticalScrollIndicator={false}>
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

          {editMode ? (
            <View style={styles.categoryContainer}> 
              <Text style={styles.sectionTitle}>Category</Text>
              <TextInput
                style={styles.catTextInput}
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
            </View>
            
          ) : (
            <View style={styles.categoriesContainer}>
              {editedEntry.categories && editedEntry.categories.length > 0 ? (
                editedEntry.categories.map((category) => {
                  // Find the matching category from CATEGORIES array
                  const categoryInfo = CATEGORIES.find(
                    (cat) => cat.name.toLowerCase() === category.toLowerCase()
                  );
                  
                  return (
                    <View
                      key={category}
                      style={[
                        styles.categoryChip,
                        { backgroundColor: categoryInfo?.color || '#ccc' },
                      ]}
                    >
                      <Text style={styles.categoryText}>{category}</Text>
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
              style={styles.catTextInput}
              value={editedEntry.shortSummary}
              onChangeText={(text) => setEditedEntry({ ...editedEntry, shortSummary: text })}
              multiline
            />
          ) : (
            <Text style={styles.entryText}>{editedEntry.shortSummary}</Text>
          )}

          <Text style={styles.sectionTitle}>Identified Skills</Text>
          {editMode ? (
            <View style={styles.skillsContainer}>
              <View style={styles.skillColumn}>
                <Text style={styles.skillColumnTitle}>Hard Skills</Text>
                <TextInput
                  style={styles.skillTextInput}
                  multiline
                  value={
                    (editedEntry.identifiedHardSkills || [])
                      .map((line) => `• ${line}`)
                      .join('\n')
                  }
                  onChangeText={(text) => {
                    const lines = text.split('\n');
                    
                    const skills = lines
                      .map(line => line.replace(/^•\s*/, '').trim())
                      .filter((item, index) => {
                        if (item.length > 0) return true;
                        
                        if (index === lines.length - 1 && text.endsWith('\n')) {
                          return true;
                        }
                        
                        return false;
                      });
                    
                    setEditedEntry(prev => {
                      if (!prev) return null;
                      return { ...prev, identifiedHardSkills: skills };
                    });
                  }}
                  placeholder="• Add hard skills here"
                />
              </View>
              
              <View style={styles.skillColumn}>
                <Text style={styles.skillColumnTitle}>Soft Skills</Text>
                <TextInput
                  style={styles.skillTextInput}
                  multiline
                  value={
                    (editedEntry.identifiedSoftSkills || [])
                      .map((line) => `• ${line}`)
                      .join('\n')
                  }
                  onChangeText={(text) => {
                    const lines = text.split('\n');
                    
                    const skills = lines
                      .map(line => line.replace(/^•\s*/, '').trim())
                      .filter((item, index) => {
                        if (item.length > 0) return true;
                        
                        if (index === lines.length - 1 && text.endsWith('\n')) {
                          return true;
                        }
                        
                        return false;
                      });
                    
                    setEditedEntry(prev => {
                      if (!prev) return null;
                      return { ...prev, identifiedSoftSkills: skills };
                    });
                  }}
                  placeholder="• Add soft skills here"
                />
              </View>
            </View>
          ) : (
            <View style={styles.skillsContainer}>
              <View style={styles.skillColumn}>
                <Text style={styles.skillColumnTitle}>Hard Skills</Text>
                {(editedEntry.identifiedHardSkills || []).length > 0 ? (
                  <View style={styles.skillsList}>
                    {editedEntry.identifiedHardSkills.map((skill, index) => (
                      <Text key={index} style={styles.entryText}>• {skill}</Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.entryText}>None</Text>
                )}
              </View>
              
              <View style={styles.skillColumn}>
                <Text style={styles.skillColumnTitle}>Soft Skills</Text>
                {(editedEntry.identifiedSoftSkills || []).length > 0 ? (
                  <View style={styles.skillsList}>
                    {editedEntry.identifiedSoftSkills.map((skill, index) => (
                      <Text key={index} style={styles.entryText}>• {skill}</Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.entryText}>None</Text>
                )}
              </View>
            </View>
          )}

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

          {!editMode ? (
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <FontAwesome name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <Sheet
        modal={modal}
        open={open}
        onOpenChange={handleOpenChange}
        snapPoints={[95]}
        snapPointsMode="percent"
        dismissOnSnapToBottom
        position={position}
        onPositionChange={setPosition}
        zIndex={100_000}
        animation="medium"
    >
      <Sheet.Handle />
      
      <Sheet.Frame>
        {showEntryDetail && selectedEntry ? (
          // Show entry detail view
          renderEntryDetail()
        ) : (
          // Show all entries list
          <AllEntriesModal 
            onClose={() => handleOpenChange(false)} 
            onEntrySelect={handleEntrySelect}
          />
        )}
      </Sheet.Frame>
      
      <Sheet.Overlay 
        animation="lazy"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
    </Sheet>
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
    flexDirection: 'column',
    width: '100%',

    zIndex: 2, // ensure it's above the whiteRect
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
  categoryText: {
    color: colors.neutralBlack,
    fontSize: 12,
    fontFamily: 'DM Sans',
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
  backTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  entryDetailContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 16,
    color: colors.neutral600,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginTop: 10,
    fontFamily: 'Nunito',
    color: colors.neutralBlack,
  },
  titleInput: { 
    fontSize: 28, 
    marginTop: 10, 
    fontWeight: 'bold',
    paddingBottom: 5,
    fontFamily: 'Nunito',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 600, 
    marginTop: 25,
    marginBottom: 4,
    fontFamily: 'Nunito',
    color: colors.neutralBlack,
  },
  entryText: { 
    fontSize: 16, 
    fontFamily: 'DM Sans',
    color: colors.neutralBlack,
    fontWeight: 300,
  },
  entryTextInput: { 
    fontSize: 16, 
    borderWidth: 1, 
    padding: 5,
    borderColor: '#ccc',
    borderRadius: 5,
    minHeight: 150,
  },
  catTextInput: { 
    fontSize: 16, 
    borderWidth: 1, 
    padding: 5,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  editButton: { 
    backgroundColor: colors.warning400, 
    borderRadius: 50,
    alignSelf: 'flex-end', 
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveButton: { 
    backgroundColor: colors.success500, 
    borderRadius: 50,
    alignSelf: 'flex-end', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
    fontFamily: 'Nunito',
    paddingHorizontal: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  skillColumn: {
    flex: 1,
    // marginHorizontal: 5,
  },
  skillColumnTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.neutral1000,
    fontFamily: 'DM Sans',
  },
  skillTextInput: {
    fontSize: 16,
    borderWidth: 1,
    height: 120,
    padding: 5,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  skillsList: {
    flexDirection: 'column',
    gap: 4,
  },
});

export default EntriesSheet;
