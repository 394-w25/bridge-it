import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useUser } from '../context/UserContext';
import { updateUserEntry } from '../backend/dbFunctions';

const { width } = Dimensions.get('window');

interface JournalEntry {
  id: string;
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

interface EntryDetailModalProps {
  visible: boolean;
  entry: JournalEntry;
  onClose: () => void;
}

export const EntryDetailModal: React.FC<EntryDetailModalProps> = ({ visible, entry, onClose }) => {
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
      onClose(); // Close the modal after saving
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
            <Text style={styles.sectionTitle}>Categories</Text>
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
              <Text style={styles.entryText}>
                {editedEntry.categories && editedEntry.categories.length > 0
                  ? editedEntry.categories.join(', ')
                  : 'None'}
              </Text>
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
                value={
                  (editedEntry.identifiedHardSkills || [])
                    .map((line) => `• ${line}`)
                    .join('\n')
                }
                onChangeText={(text) => {
                  const lines = text.split('\n').map((line) => line.replace(/^•\s*/, ''));
                  setEditedEntry({ ...editedEntry, identifiedHardSkills: lines });
                }}
                onBlur={() => {
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
                value={
                  (editedEntry.identifiedSoftSkills || [])
                    .map((line) => `• ${line}`)
                    .join('\n')
                }
                onChangeText={(text) => {
                  const lines = text.split('\n').map((line) => line.replace(/^•\s*/, ''));
                  setEditedEntry({ ...editedEntry, identifiedSoftSkills: lines });
                }}
                onBlur={() => {
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
};

const styles = StyleSheet.create({
  entryModalOverlay: { 
    flex: 1, 
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backText: {
    fontSize: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 30 
  },
  titleInput: { 
    fontSize: 28, 
    marginTop: 20, 
    fontWeight: 'bold',
    paddingBottom: 5 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 25 
  },
  entryText: { 
    fontSize: 16, 
    color: '#555', 
    marginTop: 10 
  },
  entryTextInput: { 
    fontSize: 16, 
    marginTop: 20, 
    borderWidth: 1, 
    height: 120, 
    padding: 5,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  entryTextInputCat: { 
    fontSize: 16, 
    marginTop: 20, 
    borderWidth: 1, 
    height: 30, 
    padding: 5,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  editButton: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    backgroundColor: '#007AFF', 
    padding: 10, 
    borderRadius: 50 
  },
  saveButton: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    backgroundColor: '#28A745', 
    padding: 12, 
    borderRadius: 50 
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});
