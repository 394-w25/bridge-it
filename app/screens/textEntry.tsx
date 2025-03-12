import React, { useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
// import { getCurrentDate } from '@/backend/utils';
import { getGeminiResponse } from '../../backend/gemini';
import BottomNavBar from '../../components/BottomNavBar';
import { colors } from '../styles/color';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { Timestamp } from 'firebase/firestore';  // ✅ Import Firestore Timestamp
import { postUserEntry } from '../../backend/dbFunctions';  // ✅ Import Firestore function
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
  const [categoryText, setCategoryText] = useState(
    entryData?.category ? entryData.category.join(', ') : ''
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  

  const resetModal = () => {
    setEntryText('');
    setEntryData(null);
    setIsProcessed(false);
    setEditMode(false);
  };

  useEffect(() => {
    if (entryData?.category) {
      setCategoryText(entryData.category.join(', '));
    }
  }, [entryData?.category]);
  
  function removeLeadingBulletOrDot(line: string): string {
    // Removes any leading bullets (•), dots, or whitespace
    return line.replace(/^(\.|•|\s)+/, '');
  }

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
      const rawCats = improvedContent.categories || 'General'; 
      const catArray = Array.isArray(rawCats)
        ? rawCats
        : rawCats.split(',').map((cat: string) => cat.trim());

      setEntryData({
        title: improvedContent.title || 'Untitled',
        category: catArray,
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
      categories: entryData.category,  // Ensure category is an array
      timestamp: Timestamp.now(),         // Save current timestamp
      shortSummary: entryData.shortsummary || '',
    };

    try {
  
        // ✅ Save to Firestore using the most updated state
        await postUserEntry(uid, updatedEntry);

      console.log("Entry successfully saved to Firestore!");
      // alert('Entry saved!');
      setShowSuccessMessage(true);
      
      resetModal();
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };


  return (
    <View style={styles.modalOverlay}>
    <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
    {showSuccessMessage && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>Entry added</Text>
          </View>
        )}

      <View style={styles.whiteRect} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleWrapper}>
            <Text style={styles.headerTitle}>{isProcessed ? "Journal Insights" : "Journal Entry"}</Text>
            <MaterialCommunityIcons name="keyboard" size={36} color="#E94E1B" style={styles.keyboardIcon} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={18} color={colors.neutral600} />
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
            
          </>
        ) : (
          <>
            {/* Processed Journal Insights UI */}
            <ScrollView>
            <View style={styles.contentBox}>
              {/* <Text style={styles.sectionTitle}>Title</Text> */}
              {editMode ? (
                <TextInput
                  style={styles.inputField1}
                  multiline
                  value={entryData?.title}
                  onChangeText={(text) => setEntryData((prev: any) => ({ ...prev, title: text }))}
                />
              ) : (
                <Text style={styles.title}>{entryData?.title}</Text>
              )}
            
              {editMode ? (
                <TextInput
                  style={styles.entryTextInputCat}
                  value={categoryText}
                  onChangeText={(text) => {
                    // If the user just typed a comma and no space, append a space.
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
                    // Update the entryData with the new categories array.
                    setEntryData((prev: any) => ({ ...prev, category: updatedCategories }));
                    // Reformat the local text to have a neat ", " separation.
                    setCategoryText(updatedCategories.join(', '));
                  }}
                />
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 }}>
                  {Array.isArray(entryData?.category) && entryData.category.length > 0 ? (
                    entryData.category.map((catItem: string, index: number) => {
                      const matchedCat = CATEGORIES.find(
                        (c) => c.name.trim().toLowerCase() === catItem.trim().toLowerCase()
                      );
                      return (
                        <View
                          key={index}
                          style={[
                            styles.categoryBadge,
                            { backgroundColor: matchedCat?.color || '#D1D5DB' },
                          ]}
                        >
                          <Text style={styles.categoryBadgeText}>{catItem}</Text>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.entryText}>None</Text>
                  )}
                </View>
              )}



              {/* Summary */}
              <Text style={styles.sectionTitle}>Summary</Text>
              {editMode ? (
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
              {/* Editable Hard and Soft Skills */}
              {/* <Text style={styles.sectionTitle}>Identified Hard Skills</Text> */}
             <Text style={styles.sectionTitle}>Identified Skills</Text>
              <View style={styles.skillsContainer}>
                <View style={styles.skillsColumn}>
                  <Text style={styles.subTitle}>Hard</Text>
                  {editMode ? (
                    <TextInput
                      style={[styles.inputField, { height: 120 }]} // Adjust height as needed
                      multiline
                      // Show each hard skill with a bullet prefix
                      value={
                        Array.isArray(entryData?.hardSkills)
                          ? entryData.hardSkills
                              .map((line: string) => `• ${removeLeadingBulletOrDot(line)}`)
                              .join('\n')
                          : ''
                      }
                      
                      onChangeText={(text) => {
                        // Split by newline and remove any leading bullet/dot using the helper function
                        const lines = text.split('\n').map((line: string) =>
                          removeLeadingBulletOrDot(line)
                        );
                        setEntryData((prev: any) => ({ ...prev, hardSkills: lines }));
                      }}
                      onBlur={() => {
                        // Filter out any empty lines on blur
                        setEntryData((prev: any) => ({
                          ...prev,
                          hardSkills: (prev.hardSkills || []).filter(
                            (line: string) => line.trim().length > 0
                          ),
                        }));
                      }}
                    />
                  ) : (
                    // In view mode, show each skill with a bullet prefix
                    entryData?.hardSkills.map((skill: string, index: number) => (
                      <Text key={index} style={styles.skillItem}>
                        {`• ${removeLeadingBulletOrDot(skill)}`}
                      </Text>
                    ))
                  )}
                </View>

                {/* Soft Skills Column */}
                <View style={styles.skillsColumn}>
                  <Text style={styles.subTitle}>Soft</Text>
                  {editMode ? (
                    <TextInput
                      style={[styles.inputField, { height: 120 }]}
                      multiline
                      value={
                        Array.isArray(entryData?.softSkills)
                          ? entryData.softSkills
                              .map((line: string) => `• ${removeLeadingBulletOrDot(line)}`)
                              .join('\n')
                          : ''
                      }
                      onChangeText={(text) => {
                        const lines = text.split('\n').map((line: string) =>
                          removeLeadingBulletOrDot(line)
                        );
                        setEntryData((prev: any) => ({ ...prev, softSkills: lines }));
                      }}
                      onBlur={() => {
                        setEntryData((prev: any) => ({
                          ...prev,
                          softSkills: (prev.softSkills || []).filter(
                            (line: string) => line.trim().length > 0
                          ),
                        }));
                      }}
                    />
                  ) : (
                    entryData?.softSkills.map((skill: string, index: number) => (
                      <Text key={index} style={styles.skillItem}>
                        {`• ${removeLeadingBulletOrDot(skill)}`}
                      </Text>
                    ))                    
                  )}
                </View>
              </View>
            </View>
            

            {/* Reflection */}
            <View style={styles.contentBox1}>
            
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
            </ScrollView>
          </>
          
        )}
      </View>

      {showSuccessMessage && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>Entry added</Text>
          </View>
        )}
  </LinearGradient>
</View>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Semi-transparent backdrop
    // justifyContent: 'center', // Align modal content at the center
  },

  successBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: 'rgba(72, 199, 116, 0.2)', // or any greenish transparent color
    // padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    
    // borderTopWidth: 1,
    // borderTopColor: 'rgba(72, 199, 116, 0.3)',
  },
  successBannerText: {
    color: '#48C774', // a green color
    fontSize: 16,
    fontWeight: '600',
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
    fontFamily: 'Nunito',
  },
  closeButton: {
    // padding: 10,
    marginRight: 20,  // Add some right margin
    marginTop: 10,
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
    fontFamily: 'DM Sans',
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
    fontFamily: 'DM Sans',
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
    marginBottom: 15,
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
    marginBottom: 15,
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
    marginRight: 5,
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
  entryTextInputCat: {
    fontSize: 16,
    marginTop: 20,
    borderWidth: 1,
    height: 30,
    padding: 5,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#212121',
  },
  
  inputField: { borderWidth: 1, borderColor: '#D2D2D2', borderRadius: 8, padding: 10, fontSize: 14, height: 80},
  inputField1: { borderWidth: 1, borderColor: '#D2D2D2', borderRadius: 8, padding: 10, fontSize: 14, height: 60},
  inputField2: { borderWidth: 1, borderColor: '#D2D2D2', borderRadius: 8, padding: 10, fontSize: 14, height: 60},
});

