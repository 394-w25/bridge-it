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
import { getUserEntries, postJobInfo  } from '../../backend/dbFunctions';
import { useUser } from '../../context/UserContext';
import ChatbotModal from '../screens/chatBot';
import { getGeminiJobInfo } from '../../backend/gemini';

const InterviewPrepScreen = () => {
  const { width, height } = useWindowDimensions();
  const { uid } = useUser();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);
  const [jobPosting, setJobPosting] = useState('');
  const [positionName, setPositionName] = useState('');
  const [entries, setEntries] = useState<EntryInput[]>([]);
  const [companyInfo, setCompanyInfo] = useState('');
  const [keyStrength, setKeyStrenth] = useState('');
  const [mockInterviewQ, setMockInterviewQ] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEntries() {
      if (uid) {
        const fetchedEntries = await getUserEntries(uid);
        setEntries(fetchedEntries);
      }
    }
    fetchEntries();
  }, [uid]);

  const styles = useMemo(() => createStyles(width, height), [width, height]);

  const handleSubmit = async() => {
    console.log('submit pressed');
    setIsLoading(true);
    const data = await getGeminiJobInfo(jobPosting, positionName, entries);
    console.log(data);
    setCompanyInfo(data.companyInfo);
    setKeyStrenth(data.keyStrength);
    setMockInterviewQ(data.mockInterviewQ);
    await postJobInfo(uid, {
      positionName: positionName,
      jobPosting: jobPosting,
      companyInfo: data.companyInfo,
      keyStrength: data.keyStrength,
      interviewQ: data.mockInterviewQ,
     })
    setIsLoading(false);
    setIsSubmitted(true);
  };

  const parseGeminiOutput = (response: string): string[] => {
    return response.split('•').filter(str => str.trim() !== '');
  };

  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingHeader}>Interview Prep</Text>
      {/* <View style={styles.statusBar}>
        <View style={styles.notch}></View>
        <View style={styles.statusIcons}>
          <View style={styles.signalIcon}></View>
          <View style={styles.wifiIcon}></View>
          <View style={styles.batteryIcon}></View>
        </View>
      </View> */}
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

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
          onChangeText={setJobPosting}
        />
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="briefcase-outline" size={24} color="#4A4A4A" style={styles.icon} />
        <TextInput 
          placeholder="Position Name" 
          style={styles.input} 
          placeholderTextColor="#CCCCCC" 
          onChangeText={setPositionName}
        />
      </View>
      <Image 
        source={require("../../assets/images/interview-prep.png")} 
        style={styles.image} 
      />
      <TouchableOpacity 
        style={styles.bridgeButton}
        onPress={handleSubmit}
      >
        <Text style={styles.bridgeButtonText}>Submit</Text>
      </TouchableOpacity>
    </>
  );

  // Render the sub-screen results view
  const renderSubScreen = () => {
    const companyFacts = parseGeminiOutput(companyInfo);
    const keyStrengths = parseGeminiOutput(keyStrength);
    const interviewQuestions = parseGeminiOutput(mockInterviewQ);

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
          {keyStrengths.map((strength, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>{'\u2022'}</Text>
              <Text style={styles.bulletText}>{strength.trim()}</Text>
            </View>
          ))}
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
          <Text style={styles.chatButtonText}>Chat with Bridget</Text>
        </TouchableOpacity>
        <ChatbotModal visible={isChatbotVisible} onClose={() => setIsChatbotVisible(false)} />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        { isLoading? <LoadingScreen /> : (!isSubmitted ? renderForm() : renderSubScreen())}
      </ScrollView>
    </View>
  );
};

const createStyles = (width: number, height: number) => StyleSheet.create({
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(180deg, #D9EAF5 0%, #FFFFFF 100%)',
  },
  loadingHeader: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 40,
    color: '#212121',
  },
  statusBar: {
    position: 'absolute',
    width: '100%',
    height: 44,
    left: 0,
    top: 0,
  },
  notch: {
    position: 'absolute',
    width: 219,
    height: 30,
    left: '50%',
    transform: [{ translateX: -109.5 }],
    top: -2,
    backgroundColor: '#020202',
  },
  statusIcons: {
    position: 'absolute',
    width: 65,
    height: 16,
    right: 15,
    top: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 2,
  },
  signalIcon: {
    width: 20,
    height: 16,
    backgroundColor: '#020202',
  },
  wifiIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#020202',
  },
  batteryIcon: {
    width: 25,
    height: 16,
    backgroundColor: '#020202',
  },
  loadingText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: 24,
    color: '#212121',
  },
});

export default InterviewPrepScreen;