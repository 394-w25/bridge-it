import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchJobDetails, fetchInterviewQuestions } from '../../backend/jobAnalysis'; // Backend API functions


const BridgeItScreen = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const { jobLink, jobTitle } = route.params as { jobLink: string; jobTitle: string };

  const [companyFacts, setCompanyFacts] = useState<string[]>([]);
  const [keyStrengths, setKeyStrengths] = useState<{ skill: string; required: number; user: number }[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  useEffect(() => {
    async function analyzeJob() {
      if (!jobLink || !jobLink.startsWith("http")) {
        setIsInvalid(true);
        setIsLoading(false);
        return;
      }

      try {
        const companyData = await fetchJobDetails(jobLink);
        const questions = await fetchInterviewQuestions(jobTitle);

        if (!companyData || companyData.error) {
          setIsInvalid(true);
        } else {
          setCompanyFacts(companyData.facts);
          setKeyStrengths(companyData.skills);
          setInterviewQuestions(questions);
        }
      } catch (error) {
        setIsInvalid(true);
      }
      setIsLoading(false);
    }

    analyzeJob();
  }, [jobLink]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Interview Prep</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6C96B5" style={{ marginTop: 20 }} />
        ) : isInvalid ? (
          <Text style={styles.errorText}>Invalid job description link. Please check and try again.</Text>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <TextInput value={jobTitle} style={styles.input} editable={false} />
              <TextInput value={jobLink} style={styles.input} editable={false} />
            </View>

            {/* Important Facts */}
            <Text style={styles.subHeader}>Important Facts about the Company</Text>
            {companyFacts.map((fact, index) => (
              <Text key={index} style={styles.factText}>• {fact}</Text>
            ))}

            {/* Key Strengths & Radar Chart */}
            <Text style={styles.subHeader}>Key Strengths & Alignment</Text>

            {/* Interview Questions */}
            <Text style={styles.subHeader}>Mock Interview Questions</Text>
            {interviewQuestions.map((question, index) => (
              <Text key={index} style={styles.questionText}>• {question}</Text>
            ))}

            {/* Chat with Bridget */}
            <Text style={styles.caption}>Still feeling uncertain?</Text>
            <TouchableOpacity style={styles.chatButton} onPress={() => setIsChatbotVisible(true)}>
              <Text style={styles.chatButtonText}>Chat with Bridget</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FA",
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    fontFamily: "Nunito",
    fontSize: 32,
    fontWeight: "700",
    color: "#212121",
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
  inputContainer: {
    width: "90%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#BBBBBB",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    color: "#333",
  },
  factText: {
    fontSize: 14,
    marginVertical: 4,
    color: "#555",
  },
  questionText: {
    fontSize: 14,
    marginVertical: 4,
    color: "#444",
  },
  chatButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    marginTop: 20,
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  caption: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 50,  // Fully rounded corners
    position: "absolute",
    bottom: 80, 
    alignSelf: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeButton: {
    padding: 10,
    borderRadius: 50, // Rounded shape
    backgroundColor: "#F0F0F0", 
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#A0B7D1",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 50, // Rounded button shape
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BridgeItScreen;
