import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { getUserEntries } from '../../backend/dbFunctions';
import { useUser } from '../../context/UserContext';
import ChatbotModal from '../screens/chatBot';

const { width } = Dimensions.get('window');

const InterviewPrepScreen = () => {
  const { uid } = useUser();
  const [experienceTitles, setExperienceTitles] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  useEffect(() => {
    async function fetchExperienceTitles() {
      if (uid) {
        const entries = await getUserEntries(uid);
        const titles = entries.map(entry => entry.title);
        setExperienceTitles(titles);
      }
    }

    fetchExperienceTitles();
  }, [uid]);

  const displayedTitles = showAll ? experienceTitles : experienceTitles.slice(0, 5);

  const handleTitlePress = (title: string) => {
    setSelectedTitles(prevSelected =>
      prevSelected.includes(title)
        ? prevSelected.filter(t => t !== title)
        : [...prevSelected, title]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Interview Prep</Text>
        <TouchableOpacity style={styles.helpIcon}>
          <Ionicons name="help-circle-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.subHeader}>Give us some context first!</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="link-outline" size={24} color="#4A4A4A" style={styles.icon} />
          <TextInput placeholder="Link to Job Posting" style={styles.input} placeholderTextColor="#CCCCCC" />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="briefcase-outline" size={24} color="#4A4A4A" style={styles.icon} />
          <TextInput placeholder="Position Name" style={styles.input} placeholderTextColor="#CCCCCC" />
        </View>
        <Text style={styles.subHeader}>What experiences do you want to highlight?</Text>
        <View style={styles.tagContainer}>
          {displayedTitles.map((title, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tag, selectedTitles.includes(title) && styles.tagSelected]}
              onPress={() => handleTitlePress(title)}
            >
              <Text style={styles.tagText}>{title}</Text>
            </TouchableOpacity>
          ))}
          {experienceTitles.length > 5 && !showAll && (
            <TouchableOpacity style={styles.tag} onPress={() => setShowAll(true)}>
              <Text style={styles.tagText}>+ More</Text>
            </TouchableOpacity>
          )}
          {showAll && (
            <TouchableOpacity style={styles.tag} onPress={() => setShowAll(false)}>
              <Text style={styles.tagText}>Show Less</Text>
            </TouchableOpacity>
          )}
        </View>
        <Image source={require("../../assets/images/interview-prep.png")} style={styles.image} />
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.homeButton}>
          <Ionicons name="home" size={24} color="#BBBBBB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={() => setIsChatbotVisible(true)}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <ChatbotModal visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9EAF5",
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    fontFamily: "Nunito", 
    fontSize: 40,
    fontWeight: "700",
    color: "#212121",
    marginTop: 60,
  },
  helpIcon: {
    position: "absolute",
    right: 20,
    top: 60,
  },
  subHeader: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: "#212121",
    marginVertical: 10,
  },
  inputContainer: {
    fontFamily: "Nunito",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#6C96B5",
    borderWidth: 1,
    borderRadius: 8,
    width: width * 0.9,
    padding: 12,
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: "#212121",
    fontFamily: "Nunito",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    width: width * 0.9,
  },
  tag: {
    backgroundColor: "#6C96B5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagSelected: {
    backgroundColor: "#4A4A4A",
  },
  tagText: {
    fontFamily: "Nunito",
    color: "#FFFFFF",
    fontSize: 12,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 20,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#EEEEEE",
    position: "absolute",
    bottom: 70,
    width: "100%",
  },
  homeButton: {
    padding: 10,
  },
  submitButton: {
    backgroundColor: "rgba(81, 127, 165, 0.5)",
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 999,
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default InterviewPrepScreen;
