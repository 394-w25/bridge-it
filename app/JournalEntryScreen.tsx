import React, { useState, useRef, useEffect } from "react";
import { Stack } from "expo-router";
import { useIsFocused } from '@react-navigation/native';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import colors from "./styles/color";
import TextEntryModal from "./screens/textEntry";
import VoiceEntryModal from "./screens/voiceEntry";
import { useRouter } from 'expo-router';
import LottieView from "lottie-react-native";
import { FontAwesome } from "@expo/vector-icons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import BottomNavBar from "../components/BottomNavBar";


const JournalEntryScreen = () => {
  const router = useRouter();
  const isFocused = useIsFocused(); // Only true when screen is focused
  const [textModalVisible, setTextModalVisible] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={['#F5F5F5', '#FFFFFF']}
        style={styles.container}
      >
        <Text style={styles.title}>Journal Entry</Text>
        <View style={styles.buttonGrid}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={() => setTextModalVisible(true)}
            >
              <View style={styles.lottieContainer}>
                {isFocused && (
                  <LottieView
                    source={require('../assets/lottie/orange.json')}
                    autoPlay
                    loop
                    style={styles.lottieButton}
                    renderMode="SOFTWARE" // Optionally add this prop for web stability
                  />
                )}
                <View style={styles.overlay}>
                  <FontAwesome5 name="keyboard" size={24} color={colors.neutralBlack} />
                  <Text style={styles.overlayText}>Text</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={() => setVoiceModalVisible(true)}
            >
              <View style={styles.lottieContainer}>
                {isFocused && (
                  <LottieView
                    source={require('../assets/lottie/teal.json')}
                    autoPlay
                    loop
                    style={styles.lottieButton}
                    renderMode="SOFTWARE"
                  />
                )}
                <View style={styles.overlay}>
                  <FontAwesome name="microphone" size={24} color={colors.neutralBlack} />
                  <Text style={styles.overlayText}>Voice</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={() => {}}
            >
              <View style={styles.lottieContainer}>
                {isFocused && (
                  <LottieView
                    source={require('../assets/lottie/green.json')}
                    autoPlay
                    loop
                    style={styles.lottieButton}
                    renderMode="SOFTWARE"
                  />
                )}
                <View style={styles.overlay}>
                  <FontAwesome name="camera" size={24} color={colors.neutralBlack} />
                  <Text style={styles.overlayText}>Camera</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.buttonWrapper} 
              onPress={() => {}}
            >
              <View style={styles.lottieContainer}>
                {isFocused && (
                  <LottieView
                    source={require('../assets/lottie/yellow.json')}
                    autoPlay
                    loop
                    style={styles.lottieButton}
                    renderMode="SOFTWARE"
                  />
                )}
                <View style={styles.overlay}>
                  <FontAwesome5 name="upload" size={24} color={colors.neutralBlack} />
                  <Text style={styles.overlayText}>Upload</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <Modal
          animationType="slide"
          transparent={false}
          visible={textModalVisible}
          onRequestClose={() => setTextModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TextEntryModal visible={textModalVisible} onClose={() => setTextModalVisible(false)} />
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
      <BottomNavBar showAddButton={false} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  title: {
    fontFamily: "Nunito",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 60,
    color: colors.neutralBlack,
    marginBottom: 40,
    marginLeft: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    // borderWidth: 1,
  },
  buttonGrid: {
    flexDirection: 'column',
    marginBottom: 30,
    // borderWidth: 1,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // width: '100%',
    // height: '100%',
    // backgroundColor: 'white',
  },
  modalContent: {
    // flex: 1,
    // width: '90%',
    backgroundColor: 'white',
    // borderRadius: 10,
    // padding: 20,
    alignItems: 'center',
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  lottieButton: {
    width: 80,
    height: 80,
    marginTop: -8,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 1
  },
  lottieContainer: {
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 4,
  },
  overlayText: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    color: colors.neutralBlack,
  },
});

export default JournalEntryScreen;
