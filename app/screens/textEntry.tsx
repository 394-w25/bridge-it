import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { postUserEntry } from '@/backend/dbFunctions';
import { Timestamp } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';
import { getCurrentDate } from '@/backend/utils';
import { getGeminiResponse } from '../../backend/gemini';

const { width, height } = Dimensions.get('window');

interface TextEntryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TextEntryModal({ visible, onClose }: TextEntryModalProps) {
  const router = useRouter();
  const { uid } = useUser();
  const [entryText, setEntryText] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  function parseGeminiCategories(csvString: string): string[] {
      return csvString
        .split(',')      // Split by commas
        .map(cat => cat.trim().toLowerCase())  // Trim spaces & normalize case
        .filter(cat => cat.length > 0);  // Remove any empty values
    }

  const handleSave = async () => {
    if (!entryText) {
      alert('Please complete the text entry.');
      return;
    }

    // Show the success alert
    setShowSuccessAlert(true);
    // Hide the alert after 2 seconds (or however long you want)
    setTimeout(() => {
      setShowSuccessAlert(false);
      // close the modal
      onClose();
    }, 1000);


    
    
    try {
      // const improvedContent = await postUserEntry(uid, {
      //   content: entryText,
      //   timestamp: Timestamp.now(),
      // });

      // instead of calling push to db here, call gemini and display data, TODO: edit db call to remove gemini call
      const improvedContent = await getGeminiResponse(entryText); 
      const parsedCategories = parseGeminiCategories(improvedContent.categories);
      
      console.log(improvedContent);
      router.push({
        pathname: './summary',
        params: {
          shortsummary: improvedContent.shortsummary || '',
          categories: parsedCategories,
          type: improvedContent.type || '',
          title: improvedContent.title || '',
          summary: improvedContent.summary || '',
          hardSkills: improvedContent.hardSkills || '',
          softSkills: improvedContent.softSkills || '',
          reflection: improvedContent.reflection || '',
        },
      });

    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Failed to save achievement. Please try again.');
    }
  };

  return (
      <View style={styles.modalOverlay}>
        <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
          {/* Success alert */}
          
          {showSuccessAlert && (
            <View style={styles.notificationContainer}>
              <Text style={styles.notificationText}>Entry added</Text>
            </View>
          )}

          {/* White rectangle (modal content background) */}
          <View style={styles.whiteRect} />

          {/* Header with title and close button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Journal Entry</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="close" size={24} color="#212121" />
            </TouchableOpacity>
          </View>

          {/* Date chip */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>

          {/* Text area */}
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Describe your achievement..."
              multiline
              value={entryText}
              onChangeText={setEntryText}
              textAlignVertical="top" // Ensure text starts at the top
              autoFocus // Automatically focus the input when the modal opens
            />
            <Text style={styles.charCount}>{entryText.length}</Text>
          </View>

          {/* Bottom bar with "Clear" and "Complete" */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setEntryText('')}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleSave}
            >
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', 
    justifyContent: 'center', 
  },
  container: {
    width: width,
    height: height,
    flex: 1,
    alignItems: "center",
  },
  notificationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ECFCE5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: '#D1E7D6',
  },
  notificationText: {
    color: '#2D6A4F',
    fontWeight: '600',
    fontSize: 16,
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
  header: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 40,
    lineHeight: 60,
    color: '#212121',
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 999,
  },
  dateText: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: '#212121',
  },
  textAreaContainer: {
    position: 'absolute',
    top: 160,
    left: 17,
    width: '91%',
    height: '64%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 8,
    padding: 10,
  },
  textAreaInput: {
    flex: 1,
    width: '100%',
    fontFamily: 'Nunito',
    fontSize: 14,
    lineHeight: 21,
    color: '#606060',
    textAlignVertical: 'top',
  },
  charCount: {
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 15,
    color: '#8E8E8E',
    textAlign: 'right',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    width: 242,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    shadowColor: '#585C5F',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearButton: {
    width: 74,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#212121',
  },
  completeButton: {
    width: 168,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FC4300',
    borderRadius: 999,
  },
  completeButtonText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#FFFFFF',
  },
});