import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { colors } from "../styles/color";
import { getCurrentDate } from '@/backend/utils';
import BottomNavBar from '../components/BottomNavBar';

const { width, height } = Dimensions.get('window');

interface VoiceEntryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function VoiceEntryModal({ visible, onClose }: VoiceEntryModalProps) {
  const [entryText, setEntryText] = useState('');

  const handleClear = () => {
    setEntryText('');
  };

  const handleComplete = () => {
    // TODO: handle saving or transcribing the voice entry
    console.log('Complete pressed, text:', entryText);
  };

  return (
      <View style={styles.modalOverlay}>
        {/* Main content */}
        <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
          {/* White rectangle top layer */}
          <View style={styles.whiteRect} />

          {/* Header: "Journal Entry", mic icon, and close button */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Journal Entry</Text>

            {/* Microphone icon (top right) */}
            <TouchableOpacity style={styles.micIconButton}>
              <FontAwesome name="microphone" size={24} color={colors.teal} />
            </TouchableOpacity>

            {/* Close (X) button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <FontAwesome name="close" size={24} color="#212121" />
            </TouchableOpacity>
          </View>

          {/* Date chip */}
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{getCurrentDate()}</Text>
          </View>

          {/* Text area (for transcribed speech) */}
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Speech to Text area placeholder"
              multiline
              value={entryText}
              onChangeText={setEntryText}
            />
            <Text style={styles.charCount}>{entryText.length}</Text>
          </View>

          {/* Large microphone icon in center */}
          <View style={styles.micContainer}>
            <FontAwesome name="microphone" size={60} color="#6C6C6C" />
          </View>

          {/* Bottom bar with "Clear" & "Complete" */}
          {/* <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          </View> */}
          <BottomNavBar addButtonColour="#288C85" completeVariation={true} completeText="Submit" clearText="Clear"/>
        </LinearGradient>
      </View>
  );
}

const styles = StyleSheet.create({
  /** Dark translucent backdrop */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  container: {
    width,
    height,
    position: 'relative',
  },

  whiteRect: {
    position: 'absolute',
    top: 30,
    width,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 40,
    color: '#212121',
  },
  micIconButton: {
    marginLeft: 'auto',
    marginRight: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#212121',
  },

  dateContainer: {
    position: 'absolute',
    top: 110,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 999,
    height: 26,
  },
  dateText: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: '#212121',
  },

  textAreaContainer: {
    position: 'absolute',
    width: '90%',
    height: 114,
    left: 17,
    top: 160,
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

  /** Large mic icon in center (Group 8) */
  micContainer: {
    position: 'absolute',
    width: 144,
    height: 144,
    top: 360,
    left: width / 2 - 72 + 2.5, // approximate offset to match Figma's "calc(50% - 144px/2 + 2.5px)"
    borderRadius: 72,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /** Bottom bar with Clear & Complete */
  bottomBar: {
    position: 'absolute',
    flexDirection: 'row',
    width: 242,
    height: 48,
    bottom: 40,
    alignSelf: 'center',
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
    backgroundColor: '#4BA17C', // Example green color
    borderRadius: 999,
  },
  completeButtonText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
