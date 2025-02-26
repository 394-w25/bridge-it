import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import CircleButton from "../components/CircleButton";
import { colors } from "../styles/color";
import TextEntryModal from "../screens/textEntry";
import VoiceEntryModal from "../screens/voiceEntry";
import { useRouter } from 'expo-router';

const JournalEntryScreen = () => {
  const router = useRouter();
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#FFF6C8', '#FFFFFF']}
      style={styles.container}
    >
      <Text style={styles.title}>Journal Entry</Text>
      <View style={styles.buttonContainer}>
        <CircleButton 
          icon="create-outline" 
          label="Text" 
          color={colors.orange} 
          onPress={() => setTextModalVisible(true)} 
        />
        <CircleButton 
          icon="mic-outline" 
          label="Voice" 
          color={colors.teal} 
          onPress={() => setVoiceModalVisible(true)} 
        />
      </View>
      <View style={styles.buttonContainer}>
        <CircleButton 
          icon="camera-outline" 
          label="Camera" 
          color={colors.green} 
          onPress={() => {}} 
        />
        <CircleButton 
          icon="cloud-upload-outline" 
          label="Upload" 
          color={colors.yellow} 
          onPress={() => {}} 
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={textModalVisible}
        onRequestClose={() => setTextModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextEntryModal visible={textModalVisible} onClose={() => setTextModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={voiceModalVisible}
        onRequestClose={() => setVoiceModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <VoiceEntryModal visible={voiceModalVisible} onClose={() => setVoiceModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
  },
  title: {
    fontFamily: "Nunito",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
    color: colors.grey900,
    marginBottom: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FC4300',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Nunito',
    fontSize: 16,
  },
});

export default JournalEntryScreen;
