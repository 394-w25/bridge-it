import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  // ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
// import { getCurrentDate } from '@/backend/utils';
import { getGeminiResponse } from '../../backend/gemini';
import BottomNavBar from '../components/BottomNavBar';
import { colors } from '../styles/color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { Timestamp } from 'firebase/firestore';  // ✅ Import Firestore Timestamp
import { postUserEntry } from '../../backend/dbFunctions';  // ✅ Import Firestore function

const { width, height } = Dimensions.get('window');



const CATEGORIES = [
  { name: 'Academic', color: '#FDE68A' }, // Yellow
  { name: 'Personal', color: '#99E9F2' }, // Light Blue
  { name: 'Leadership', color: '#F8B4C0' }, // Pink
  { name: 'Research', color: '#BBF7D0' }, // Light Green
  { name: 'Project', color: '#FDAF75' }, // Orange
];


interface TextEntryModalProps {
  visible: boolean;
  onClose: () => void;
}


const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};


export default function TextEntryModal({ visible, onClose }: TextEntryModalProps) {
  const router = useRouter();
  const { uid } = useUser();
  const [entryText, setEntryText] = useState('');
  const [entryData, setEntryData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const resetModal = () => {
    setEntryText('');
    setEntryData(null);
    setIsProcessed(false);
    setEditMode(false);
  };

  // const handleSave = () => {
  //   setEntryData((prev: any) => ({ ...prev })); // ✅ Ensure state update
  //   setEditMode(false);
  // };
  const handleSave = () => {
    setEntryData((prevEntryData: any) => ({ ...prevEntryData })); // ✅ Ensure latest state update
    setEditMode(false);
  };
  
  const handleProcessEntry = async () => {
    if (isProcessed) return;
    if (!entryText) {
      alert('Please enter some text.');
      return;
    }

    setLoading(true);
    try {
      const improvedContent = await getGeminiResponse(entryText);
      setEntryData({
        title: improvedContent.title || 'Untitled',
        category: improvedContent.categories || 'General',
        shortsummary: improvedContent.shortsummary || '',
        hardSkills: Array.isArray(improvedContent.hardSkills) 
          ? improvedContent.hardSkills 
          : improvedContent.hardSkills 
            ? improvedContent.hardSkills.split(',').map(skill => skill.trim()) // Convert comma-separated string to array
            : [],
        softSkills: Array.isArray(improvedContent.softSkills) 
          ? improvedContent.softSkills 
          : improvedContent.softSkills 
            ? improvedContent.softSkills.split(',').map(skill => skill.trim()) 
            : [],
        reflection: improvedContent.reflection || '',
      });

      setIsProcessed(true);
      console.log("improvedContent: ", improvedContent);
    } catch (error) {
      console.error('Error processing entry:', error);
      alert('Failed to process entry. Please try again.');
    }
    setLoading(false);
  };


  const handleSaveToDatabase = async () => {
    if (!uid || !entryData) {
      alert('No user ID or entry data found.');
      return;
    }
    
    const updatedEntry = {
      title: entryData.title || 'Untitled',
      // Use the edited summary as content; adjust this if you have a separate content field.
      content: entryData.shortsummary, 
      summary: entryData.shortsummary || '',
      hardSkills: Array.isArray(entryData.hardSkills) ? entryData.hardSkills.join(', ') : '',
      softSkills: Array.isArray(entryData.softSkills) ? entryData.softSkills.join(', ') : '',
      reflection: entryData.reflection || '',
      categories: [entryData.category],  // Ensure category is an array
      timestamp: Timestamp.now(),         // Save current timestamp
      shortSummary: entryData.shortsummary || '',
    };

    try {
  
        // ✅ Save to Firestore using the most updated state
        await postUserEntry(uid, updatedEntry);

      console.log("Entry successfully saved to Firestore!");
      alert('Entry saved!');
      resetModal();
      setEditMode(false);
      onClose();  // ✅ Close modal after saving
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };


  return (
    <View style={styles.modalOverlay}>
    <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
      <View style={styles.whiteRect} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitle}>{isProcessed ? "Journal Insights" : "Journal Entry"}</Text>
            <MaterialCommunityIcons name="keyboard" size={36} color="#E94E1B" style={styles.keyboardIcon} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="close" size={24} color="#212121" />
          </TouchableOpacity>
        </View>

        {/* Date */}
        <View style={styles.dateWrapper}>
          <FontAwesome name="clock-o" size={14} color="#606060" />
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>

        {/* Show Entry Form when NOT processed */}
        {!isProcessed ? (
          <>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your achievement..."
              multiline
              value={entryText}
              onChangeText={setEntryText}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => setEntryText('')}>
                <Text style={styles.editButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={handleProcessEntry}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.completeButtonText}>Submit</Text>}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {/* Processed Journal Insights UI */}
            {/* <ScrollView> */}
            <View style={styles.contentBox}>
              {/* <Text style={styles.sectionTitle}>Title</Text> */}
              {editMode ? (
                // <TextInput style={styles.inputField1} value={entryData?.title} onChangeText={(text) => setEntryData({ ...entryData, title: text })} />
                <TextInput
                  style={styles.inputField1}
                  value={entryData?.title}
                  onChangeText={(text) => setEntryData((prev: any) => ({ ...prev, title: text }))}
                />
              ) : (
                <Text style={styles.title}>{entryData?.title}</Text>
              )}
              {/* <View style={styles.titleContainer}> */}
                {/* <Text style={styles.title}>{entryData?.title}</Text> */}
              {/* </View> */}

              <View
                style={[
                  styles.categoryBadge,
                  // { backgroundColor: CATEGORIES.find(cat => cat.name.trim() === entryData?.category.trim())?.color || '#D1D5DB' }
                  { backgroundColor: CATEGORIES.find(cat => 
                    entryData?.category && cat.name.trim() === entryData.category.trim()
                  )?.color || '#D1D5DB' }                
                ]}
              >
                <Text style={styles.categoryText}>{entryData?.category}</Text>
              </View>

              {/* Summary */}
              {/* <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.sectionContent}>{entryData?.shortsummary}</Text> */}
              <Text style={styles.sectionTitle}>Summary</Text>
              {editMode ? (
                // <TextInput style={styles.inputField} multiline value={entryData?.shortsummary} onChangeText={(text) => setEntryData({ ...entryData, shortsummary: text })} />
                <TextInput
                  style={styles.inputField}
                  multiline
                  value={entryData?.shortsummary}
                  onChangeText={(text) => setEntryData((prev: any) => ({ ...prev, shortsummary: text }))}
                />

              ) : (
                <Text style={styles.sectionContent}>{entryData?.shortsummary}</Text>
              )}

              {/* Identified Skills */}
              {/* <Text style={styles.sectionTitle}>Identified Skills</Text>
              <View style={styles.skillsContainer}>
                <View style={styles.skillsColumn}>
                  <Text style={styles.subTitle}>Hard</Text>
                  {entryData?.hardSkills.map((skill: string, index: number) => (
                    <Text key={index} style={styles.skillItem}>{skill}</Text>
                  ))}
                </View>
                <View style={styles.skillsColumn}>
                  <Text style={styles.subTitle}>Soft</Text>
                  {entryData?.softSkills.map((skill: string, index: number) => (
                    <Text key={index} style={styles.skillItem}>{skill}</Text>
                  ))}
                </View>
              </View> */}
              {/* Editable Hard and Soft Skills */}
              <Text style={styles.sectionTitle}>Identified Hard Skills</Text>
                  {editMode ? (
                    // <TextInput
                    //   style={styles.inputField}
                    //   multiline
                    //   value={entryData?.hardSkills.join('\n')}
                    //   onChangeText={(text) => setEntryData({ ...entryData, hardSkills: text.split('\n') })}
                    // />
                    // <TextInput
                    //   style={styles.inputField}
                    //   multiline
                    //   value={entryData?.hardSkills.join('\n')}
                    //   onChangeText={(text) =>
                    //     setEntryData((prev: any) => ({ ...prev, hardSkills: text.split('\n') }))
                    //   }
                    // />
                    <TextInput
                      style={styles.inputField}
                      multiline
                      value={Array.isArray(entryData?.hardSkills) ? entryData.hardSkills.join('\n') : ''}
                      onChangeText={(text) =>
                        setEntryData((prev: any) => ({ ...prev, hardSkills: text.split('\n') }))
                      }
                    />


                  ) : (
                    <Text style={styles.sectionContent}>{Array.isArray(entryData?.hardSkills) 
                      ? entryData.hardSkills.map((skill: string) => `${skill}`).join('\n') 
                      : entryData?.hardSkills || 'No hard skills identified'}
                    </Text>
                  )}

                  <Text style={styles.sectionTitle}>Identified Soft Skills</Text>
                  {editMode ? (
                    // <TextInput
                    //   style={styles.inputField}
                    //   multiline
                    //   value={entryData?.softSkills.join('\n')}
                    //   onChangeText={(text) => setEntryData({ ...entryData, softSkills: text.split('\n') })}
                    // />
                    // <TextInput
                    //   style={styles.inputField}
                    //   multiline
                    //   value={entryData?.softSkills.join('\n')}
                    //   onChangeText={(text) =>
                    //     setEntryData((prev: any) => ({ ...prev, softSkills: text.split('\n') }))
                    //   }
                    // />
                    <TextInput
                      style={styles.inputField}
                      multiline
                      value={Array.isArray(entryData?.softSkills) ? entryData.softSkills.join('\n') : ''}
                      onChangeText={(text) =>
                        setEntryData((prev: any) => ({ ...prev, softSkills: text.split('\n') }))
                      }
                    />


                  ) : (
                    <Text style={styles.sectionContent}>{Array.isArray(entryData?.softSkills) 
                      ? entryData.softSkills.map((skill: string) => `${skill}`).join('\n') 
                      : (entryData?.softSkills ? entryData?.softSkills : 'No soft skills identified')}
                    </Text>
                  )}
            </View>
            {/* </ScrollView> */}

            {/* Reflection */}
            <View style={styles.contentBox1}>
              {/* <Text style={styles.sectionTitle}>Reflection for Interview</Text>
              <Text style={styles.sectionContent}>{entryData?.reflection}</Text> */}
            
            <Text style={styles.sectionTitle}>Reflection for Interview</Text>
            {editMode ? (
              // <TextInput style={styles.inputField} multiline value={entryData?.reflection} onChangeText={(text) => setEntryData({ ...entryData, reflection: text })} />
              <TextInput
                style={styles.inputField}
                multiline
                value={entryData?.reflection}
                onChangeText={(text) => setEntryData((prev: any) => ({ ...prev, reflection: text }))}
              />

            ) : (
              <Text style={styles.sectionContent}>{entryData?.reflection}</Text>
            )}
            </View>

            {/* Buttons for Processed View */}
            {/* <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => setIsProcessed(false)}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton} onPress={onClose}>
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.buttonContainer}>
                {editMode ? (
                  // <TouchableOpacity style={styles.completeButton} onPress={() => setEditMode(false)}>
                  //   <Text style={styles.completeButtonText}>Save</Text>
                  // </TouchableOpacity>
                  <TouchableOpacity style={styles.completeButton} onPress={handleSave}>
                    <Text style={styles.completeButtonText}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.completeButton} onPress={handleSaveToDatabase}>
                  <Text style={styles.completeButtonText}>Complete</Text>
                </TouchableOpacity>
              </View>
          </>
        )}
      </View>
  </LinearGradient>
</View>
  );
}


const styles = StyleSheet.create({
  // modalOverlay: {
  //   flex: 1,
  // // backgroundColor: 'rgba(0,0,0,0.2)', 
  // justifyContent: 'center',  // Ensures modal is centered
  // alignItems: 'center',  // Centers horizontally
  // padding: 0,  // Ensure no extra padding
  // },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent backdrop
    // justifyContent: 'center', // Align modal content at the center
  },
  // container: {
  //   // width: '90%',
  //   flex: 1,
  //   // alignSelf: 'center',
  //   width: '100%',
  //   height: '100%',
  //   backgroundColor: 'white',
  //   borderRadius: 40,
  //   padding: 10,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.1,
  //   // shadowRadius: 10,
  //   elevation: 5,
  //   marginTop: 0,
  // },

  whiteRect: {
    position: 'absolute',
    top: 30,
    width: width,
    height: height - 64,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  container: {
    flex: 1,
    width: width,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: '600',
    textAlign: 'center',  // Keep it centered
    marginTop: 70,  // Add some top margin
    marginLeft: 20,  // Remove any bottom spacing


  },
  closeButton: {
    padding: 10,
    marginRight: 20,  // Add some right margin
    marginTop: 30,
  },
  dateWrapper: {
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1,  // Thin border
    borderColor: '#D0D0D0', // Light gray border
    borderRadius: 20,  // Fully rounded corners
    paddingHorizontal: 12,  // Left & right spacing inside
    paddingVertical: 6,  // Top & bottom spacing inside
    marginVertical: 10,
    marginLeft: 20,  // Add some left margin
    backgroundColor: 'white',  // Ensure background is white
    alignSelf: 'flex-start',  // Prevent stretching
  },
  dateText: {
    fontSize: 12,
    marginLeft: 6,  // Space between icon and text
    color: '#606060',
    fontWeight: '500',
  },
  
  textArea: {
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    margin: 20,
    marginLeft: 20,
    marginTop: 10,
    height: 650,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#F5F5F5',  // Light grey background
    paddingVertical: 12,
    paddingHorizontal: 30,  // Make it wider
    borderRadius: 24,  // More rounded
    marginRight: 10,  // Spacing between buttons
  },
  
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',  // Slightly bold
    color: '#212121',  // Dark text
  },
  
  completeButton: {
    backgroundColor: '#FC4300',  // Red background
    paddingVertical: 12,
    paddingHorizontal: 30,  // Make it wider
    borderRadius: 24,  // More rounded
  },
  
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    // fontWeight: '600',  // Slightly bold
  },
  contentBox: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DADADA',  // Light gray color similar to screenshot
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
    margin: 20,
    // marginLeft: 20,
    // marginTop: 10,
    marginBottom: -8,
  },
  contentBox1: {
    backgroundColor: 'white',
    padding: 15,
    elevation: 3,
    marginVertical: 10,
    margin: 20,
    marginLeft: 20,
    marginTop: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    // backgroundColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    // fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 14,
    color: '#606060',
  },
  skillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillsColumn: {
    width: '48%',
  },
  subTitle: {
    fontSize: 14,
    marginTop: 10,
    // fontWeight: 'bold',
  },
  skillItem: {
    fontSize: 14,
    color: '#606060',
  },
  categoryText: {
    fontSize: 12,
    // fontWeight: 'bold',
    color: '#212121',
  },

  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
    height: 40,
    zIndex: 2, // ensure it's above the whiteRect
  },
  headerTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyboardIcon: {
    marginTop: 75,  // Add some top margin
    marginLeft: 10,  // Remove any bottom spacing
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
  },
  reflectionContainer: {
    backgroundColor: 'white',
    // borderWidth: 1,
    // borderColor: '#DADADA',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },
  inputField: { borderWidth: 1, borderColor: '#D2D2D2', borderRadius: 8, padding: 10, fontSize: 14, height: 80},
  inputField1: { borderWidth: 1, borderColor: '#D2D2D2', borderRadius: 8, padding: 10, fontSize: 14, height: 60},
  inputField2: { borderWidth: 1, borderColor: '#D2D2D2', borderRadius: 8, padding: 10, fontSize: 14, height: 60},
});

