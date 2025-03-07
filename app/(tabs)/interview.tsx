import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  StyleSheet, 
  useWindowDimensions 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { getUserEntries, getContentByTitle } from '../../backend/dbFunctions';
import { useUser } from '../../context/UserContext';
import ChatbotModal from '../screens/chatBot';
import { getGeminiJobInfo } from '../../backend/gemini';

const InterviewPrepScreen = () => {
  const { width } = useWindowDimensions();
  const { uid } = useUser();
  const [experienceTitles, setExperienceTitles] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [jobPosting, setJobPosting] = useState('');
  const [positionName, setPositionName] = useState('');
  const [entries, setEntries] = useState<EntryInput[]>([]);

  useEffect(() => {
    async function fetchExperienceTitles() {
      if (uid) {
        const entries = await getUserEntries(uid);
        setEntries(entries);
        const titles = entries.map(entry => entry.title);
        setExperienceTitles(titles);
      }
    }
    fetchExperienceTitles();
  }, [uid]);

  const displayedTitles = showAll ? experienceTitles : experienceTitles.slice(0, 5);
  const styles = useMemo(() => createStyles(width), [width]);

  const handleTitlePress = (title: string) => {
    setSelectedTitles(prevSelected =>
      prevSelected.includes(title)
        ? prevSelected.filter(t => t !== title)
        : [...prevSelected, title]
    );
  };

<<<<<<< HEAD
  const handleSubmit = async() => {
    // console.log('user inputted', {
    //   link: jobPosting,
    //   positionName: positionName,
    //   experienceSelected: selectedTitles,
    // });

    // call backend to quary this user's journalEntry using title to return all information about that entry (TODO: currently only using content)
    //const contents = await getContentByTitle(uid, selectedTitles);
    console.log('submit pressed');
    const data = await getGeminiJobInfo(jobPosting, positionName, entries);
    console.log(data);
=======
  // Render the initial form view
  const renderForm = () => (
    <>
      <Text style={styles.header}>Interview Prep</Text>
      <TouchableOpacity style={styles.helpIcon}>
        <Ionicons name="help-circle-outline" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.subHeader}>Give us some context first!</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="link-outline" size={24} color="#4A4A4A" style={styles.icon} />
        <TextInput 
          placeholder="Link to Job Posting" 
          style={styles.input} 
          placeholderTextColor="#CCCCCC" 
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="briefcase-outline" size={24} color="#4A4A4A" style={styles.icon} />
        <TextInput 
          placeholder="Position Name" 
          style={styles.input} 
          placeholderTextColor="#CCCCCC" 
        />
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
      <Image 
        source={require("../../assets/images/interview-prep.png")} 
        style={styles.image} 
      />
      <TouchableOpacity 
        style={styles.bridgeButton}
        onPress={() => setIsSubmitted(true)}
      >
        <Text style={styles.bridgeButtonText}>Submit</Text>
      </TouchableOpacity>
    </>
  );

  // Render the sub-screen results view
  const renderSubScreen = () => {
    // Example data for the sub-screen
    const companyFacts = [
      "Founded in 1990 with a rich history of innovation.",
      "Market leader in its industry with a strong global presence.",
      "Committed to sustainability and ethical practices.",
      "Renowned for its employee-friendly culture."
    ];

    const interviewQuestions = [
      "Can you tell me about yourself?",
      "Why do you want to work for this company?",
      "Describe a challenging project you managed.",
      "How do you handle conflict in the workplace?"
    ];

    return (
      <>
        <Text style={styles.header}>Interview Prep Results</Text>

        {/* Important Company Facts */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Important Facts about the Company</Text>
          {companyFacts.map((fact, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{fact}</Text>
            </View>
          ))}
        </View>

        {/* Key Strengths and Alignment with Radar Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Key Strengths and Alignment</Text>
          <View style={styles.radarChart}>
            <Text style={styles.radarText}>Radar Chart Placeholder</Text>
          </View>
        </View>

        {/* Interview Questions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Interview Questions</Text>
          {interviewQuestions.map((question, index) => (
            <Text key={index} style={styles.questionText}>
              {index + 1}. {question}
            </Text>
          ))}
        </View>
        
        <Text style={styles.caption}>Still feeling uncertain?</Text>
        {/* Chat with Bridget Button */}
        <TouchableOpacity style={styles.chatButton} onPress={() => setIsChatbotVisible(true)}>
          <Text style={styles.chatButtonText}>Submit</Text>
        </TouchableOpacity>
        <ChatbotModal visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
      </>
    );
>>>>>>> main
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
<<<<<<< HEAD
        <Text style={styles.header}>Interview Prep</Text>
        <TouchableOpacity style={styles.helpIcon}>
          <Ionicons name="help-circle-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.subHeader}>Give us some context first!</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="link-outline" size={24} color="#4A4A4A" style={styles.icon} />
          <TextInput placeholder="Link to Job Posting" style={styles.input} placeholderTextColor="#CCCCCC" onChangeText={setJobPosting} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="briefcase-outline" size={24} color="#4A4A4A" style={styles.icon} />
          <TextInput placeholder="Position Name" style={styles.input} placeholderTextColor="#CCCCCC" onChangeText={setPositionName} />
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
          <Text style={styles.submitText} onPress={handleSubmit}>Submit</Text>
        </TouchableOpacity>
      </View>
      <ChatbotModal visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
=======
        { !isSubmitted ? renderForm() : renderSubScreen() }
      </ScrollView>
>>>>>>> main
    </View>
  );
};

const createStyles = (width: number) => StyleSheet.create({
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
    marginBottom: 20,
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
    margin: 2,
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
  bridgeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 20,
  },
  bridgeButtonText: {
    fontFamily: "Nunito",
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
  // Styles for the sub-screen sections
  section: {
    width: width * 0.9,
    marginVertical: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    fontFamily: "Nunito",
    fontSize: 18,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 8,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 6,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#212121",
    lineHeight: 20,
  },
  radarChart: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  radarText: {
    fontFamily: "Nunito",
    fontSize: 16,
    color: "#212121",
  },
  questionText: {
    fontFamily: "Nunito",
    fontSize: 14,
    color: "#212121",
    marginVertical: 2,
  },
  chatButton: {
    marginTop: 5,
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
  },
  chatButtonText: {
    fontFamily: "Nunito",
    color: "#FFFFFF",
    fontSize: 18,
  },
  caption: {
    fontFamily: "Nunito",
    color: "black",
    fontSize: 12,
    marginTop: 4,
  },
});

export default InterviewPrepScreen;
