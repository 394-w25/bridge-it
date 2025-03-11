import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';
// import { getCurrentDate } from '@/backend/utils';
import { getGeminiResponse } from '../../backend/gemini';

const { width } = Dimensions.get('window');

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
  
  // Short month names
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  // Format: 19 Feb, 2024
  return `${day} ${month}, ${year}`;
};


export default function TextEntryModal({ visible, onClose }: TextEntryModalProps) {
  const router = useRouter();
  const { uid } = useUser();
  const [entryText, setEntryText] = useState('');
  const [entryData, setEntryData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProcessEntry = async () => {
    if (!entryText) {
      alert('Please enter some text.');
      return;
    }

    setLoading(true);
    try {
      const improvedContent = await getGeminiResponse(entryText);
      setEntryData({
        title: improvedContent.title || 'Untitled',
        category: improvedContent.type || 'General',
        shortsummary: improvedContent.shortsummary || '',
        // hardSkills: Array.isArray(improvedContent.hardSkills) ? improvedContent.hardSkills : [],
        // softSkills: Array.isArray(improvedContent.softSkills) ? improvedContent.softSkills : [],
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
      console.log("improvedContent: ", improvedContent);
    } catch (error) {
      console.error('Error processing entry:', error);
      alert('Failed to process entry. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.modalOverlay}>
  <View style={styles.container}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Journal Insights</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <FontAwesome name="close" size={24} color="#212121" />
      </TouchableOpacity>
    </View>

    {/* Date */}
    <View style={styles.dateWrapper}>
      <FontAwesome name="clock-o" size={14} color="#606060" />
      <Text style={styles.dateText}>{getCurrentDate()}</Text>
    </View>

    {/* Step 1: Input Section */}
    {!entryData && (
      <>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your achievement..."
          multiline
          value={entryText}
          onChangeText={setEntryText}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.completeButton} onPress={handleProcessEntry}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.completeButtonText}>Complete</Text>}
          </TouchableOpacity>
        </View>
      </>
    )}

    {/* Step 2: Processed Data Display */}
    {entryData && (
      <View style={styles.contentBox}>
        {/* Title & Category */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{entryData.title}</Text>
        </View>

        {/* Dynamically Colored Category Badge */}
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: CATEGORIES.find(cat => cat.name === entryData.category)?.color || '#D1D5DB' }
          ]}
        >
          <Text style={styles.categoryText}>{entryData.category}</Text>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.sectionContent}>{entryData.shortsummary}</Text>

        {/* Identified Skills */}
        <Text style={styles.sectionTitle}>Identified Skills</Text>
        <View style={styles.skillsContainer}>
          <View style={styles.skillsColumn}>
            <Text style={styles.subTitle}>Hard</Text>
            {entryData.hardSkills.length > 0
              ? entryData.hardSkills.map((skill, index) => (
                  <Text key={index} style={styles.skillItem}>{skill}</Text>
                ))
              : <Text style={styles.skillItem}>No hard skills found.</Text>
            }
          </View>

          <View style={styles.skillsColumn}>
            <Text style={styles.subTitle}>Soft</Text>
            {entryData.softSkills.length > 0
              ? entryData.softSkills.map((skill: string, index: number) => (
                  <Text key={index} style={styles.skillItem}>{skill}</Text>
                ))
              : <Text style={styles.skillItem}>No soft skills found.</Text>
            }
          </View>
        </View>

        {/* Reflection Section Inside a Box */}
        <View style={styles.reflectionContainer}>
          <Text style={styles.sectionTitle}>Reflection for Interview</Text>
          <Text style={styles.sectionContent}>{entryData.reflection}</Text>
        </View>
      </View>
    )}

    {/* Buttons */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.editButton} onPress={() => setEntryData(null)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={onClose}>
        <Text style={styles.completeButtonText}>Complete</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>

    // <View style={styles.modalOverlay}>
    //   <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
    //     {/* Header */}
    //     <View style={styles.header}>
    //       <Text style={styles.headerTitle}>Journal Insights</Text>
    //       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
    //         <FontAwesome name="close" size={24} color="#212121" />
    //       </TouchableOpacity>
    //     </View>

    //     {/* Date */}
    //     <View style={styles.dateWrapper}>
    //       <FontAwesome name="clock-o" size={14} color="#606060" />
    //       <Text style={styles.dateText}>{getCurrentDate()}</Text>
    //     </View>


    //     {/* Step 1: Input Section */}
    //     {!entryData && (
    //       <>
    //         <TextInput
    //           style={styles.textArea}
    //           placeholder="Describe your achievement..."
    //           multiline
    //           value={entryText}
    //           onChangeText={setEntryText}
    //         />
    //         <View style={styles.buttonContainer}>
    //           <TouchableOpacity style={styles.completeButton} onPress={handleProcessEntry}>
    //             {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.completeButtonText}>Complete</Text>}
    //           </TouchableOpacity>
    //         </View>
    //       </>
    //     )}

    //     {/* Step 2: Processed Data Display */}
    //     {entryData && (
    //       <View style={styles.contentBox}>
    //         {/* Title & Category */}
    //         <View style={styles.titleContainer}>
    //           <Text style={styles.title}>{entryData.title}</Text>
    //           {/* </View> */}
    //         </View>

    //         <View style={styles.categoryBadge}>
    //           {/* <View style={styles.categoryContainer}> */}
    //             <Text style={styles.categoryText}>{entryData.category}</Text>
    //         </View>

    //         {/* Summary */}
    //         <Text style={styles.sectionTitle}>Summary</Text>
    //         <Text style={styles.sectionContent}>{entryData.shortsummary}</Text>

    //         {/* Identified Skills */}
    //         <Text style={styles.sectionTitle}>Identified Skills</Text>
    //         <View style={styles.skillsContainer}>
    //           <View style={styles.skillsColumn}>
    //             <Text style={styles.subTitle}>Hard</Text>
    //             {entryData.hardSkills && entryData.hardSkills.length > 0
    //               ? entryData.hardSkills.map((skill: string, index: number) => (
    //                   <Text key={index} style={styles.skillItem}>{skill}</Text>
    //                 ))
    //               : <Text style={styles.skillItem}>No hard skills found.</Text>
    //             }
    //           </View>

    //           <View style={styles.skillsColumn}>
    //             <Text style={styles.subTitle}>Soft</Text>
    //             {Array.isArray(entryData.softSkills) && entryData.softSkills.length > 0
    //               ? entryData.softSkills.map((skill: string, index: number) => (
    //                   <Text key={index} style={styles.skillItem}>{skill}</Text>
    //                 ))
    //               : <Text style={styles.skillItem}>No soft skills found!!!</Text>
    //             }
    //           </View>
    //         </View>

    //         {/* Reflection */}
    //         <Text style={styles.sectionTitle}>Reflection for Interview</Text>
    //         <Text style={styles.sectionContent}>{entryData.reflection}</Text>

    //         {/* Buttons */}
    //         <View style={styles.buttonContainer}>
    //           <TouchableOpacity style={styles.editButton} onPress={() => setEntryData(null)}>
    //             <Text style={styles.editButtonText}>Edit</Text>
    //           </TouchableOpacity>
    //           <TouchableOpacity style={styles.completeButton} onPress={onClose}>
    //             <Text style={styles.completeButtonText}>Complete</Text>
    //           </TouchableOpacity>
    //         </View>
    //       </View>
    //     )}
    //   </LinearGradient>
    // </View>
  );
}


const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
  },
  container: {
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
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
    backgroundColor: 'white',  // Ensure background is white
    alignSelf: 'flex-start',  // Prevent stretching
  },
  dateText: {
    fontSize: 12,
    marginLeft: 6,  // Space between icon and text
    color: '#606060',
  },
  
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#D2D2D2',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#FC4300',
    padding: 12,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
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
});



// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { useRouter } from 'expo-router';
// import { postUserEntry } from '@/backend/dbFunctions';
// import { Timestamp } from 'firebase/firestore';
// import { useUser } from '../../context/UserContext';
// import { getCurrentDate } from '@/backend/utils';
// import { getGeminiResponse } from '../../backend/gemini';

// const { width, height } = Dimensions.get('window');

// interface TextEntryModalProps {
//   visible: boolean;
//   onClose: () => void;
// }

// export default function TextEntryModal({ visible, onClose }: TextEntryModalProps) {
//   const router = useRouter();
//   const { uid } = useUser();
//   const [entryText, setEntryText] = useState('');
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);

//   function parseGeminiCategories(csvString: string): string[] {
//       return csvString
//         .split(',')      // Split by commas
//         .map(cat => cat.trim().toLowerCase())  // Trim spaces & normalize case
//         .filter(cat => cat.length > 0);  // Remove any empty values
//     }

//   const handleSave = async () => {
//     if (!entryText) {
//       alert('Please complete the text entry.');
//       return;
//     }

//     // Show the success alert
//     setShowSuccessAlert(true);
//     // Hide the alert after 2 seconds (or however long you want)
//     setTimeout(() => {
//       setShowSuccessAlert(false);
//       // close the modal
//       onClose();
//     }, 1000);


    
    
//     try {
//       // const improvedContent = await postUserEntry(uid, {
//       //   content: entryText,
//       //   timestamp: Timestamp.now(),
//       // });

//       // instead of calling push to db here, call gemini and display data, TODO: edit db call to remove gemini call
//       const improvedContent = await getGeminiResponse(entryText); 
//       const parsedCategories = parseGeminiCategories(improvedContent.categories);
      
//       console.log(improvedContent);
//       router.push({
//         pathname: './summary',
//         params: {
//           shortsummary: improvedContent.shortsummary || '',
//           categories: parsedCategories,
//           type: improvedContent.type || '',
//           title: improvedContent.title || '',
//           summary: improvedContent.summary || '',
//           hardSkills: improvedContent.hardSkills || '',
//           softSkills: improvedContent.softSkills || '',
//           reflection: improvedContent.reflection || '',
//         },
//       });

//     } catch (error) {
//       console.error('Error saving achievement:', error);
//       alert('Failed to save achievement. Please try again.');
//     }
//   };

//   return (
//       <View style={styles.modalOverlay}>
//         <LinearGradient colors={['#FFF6C8', '#FFFFFF']} style={styles.container}>
//           {/* Success alert */}
          
//           {showSuccessAlert && (
//             <View style={styles.notificationContainer}>
//               <Text style={styles.notificationText}>Entry added</Text>
//             </View>
//           )}

//           {/* White rectangle (modal content background) */}
//           <View style={styles.whiteRect} />

//           {/* Header with title and close button */}
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Journal Entry</Text>
//             <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//               <FontAwesome name="close" size={24} color="#212121" />
//             </TouchableOpacity>
//           </View>

//           {/* Date chip */}
//           <View style={styles.dateContainer}>
//             <Text style={styles.dateText}>{getCurrentDate()}</Text>
//           </View>

//           {/* Text area */}
//           <View style={styles.textAreaContainer}>
//             <TextInput
//               style={styles.textAreaInput}
//               placeholder="Describe your achievement..."
//               multiline
//               value={entryText}
//               onChangeText={setEntryText}
//               textAlignVertical="top" // Ensure text starts at the top
//               autoFocus // Automatically focus the input when the modal opens
//             />
//             <Text style={styles.charCount}>{entryText.length}</Text>
//           </View>

//           {/* Bottom bar with "Clear" and "Complete" */}
//           <View style={styles.bottomBar}>
//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={() => setEntryText('')}
//             >
//               <Text style={styles.clearButtonText}>Clear</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.completeButton}
//               onPress={handleSave}
//             >
//               <Text style={styles.completeButtonText}>Complete</Text>
//             </TouchableOpacity>
//           </View>
//         </LinearGradient>
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.2)', 
//     justifyContent: 'center', 
//   },
//   container: {
//     width: width,
//     height: height,
//     position: 'relative',
//   },
//   notificationContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#ECFCE5',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     zIndex: 999,
//     borderBottomWidth: 1,
//     borderBottomColor: '#D1E7D6',
//   },
//   notificationText: {
//     color: '#2D6A4F',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   whiteRect: {
//     position: 'absolute',
//     top: 30,
//     width: width,
//     height: height - 64,
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   header: {
//     position: 'absolute',
//     top: 40,
//     left: 16,
//     right: 16,
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     fontFamily: 'Nunito',
//     fontWeight: '700',
//     fontSize: 40,
//     lineHeight: 60,
//     color: '#212121',
//   },
//   closeButton: {
//     width: 24,
//     height: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dateContainer: {
//     position: 'absolute',
//     top: 110,
//     left: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderWidth: 1,
//     borderColor: '#D2D2D2',
//     borderRadius: 999,
//   },
//   dateText: {
//     fontFamily: 'Nunito',
//     fontSize: 12,
//     color: '#212121',
//   },
//   textAreaContainer: {
//     position: 'absolute',
//     top: 160,
//     left: 17,
//     width: '91%',
//     height: '64%',
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#D2D2D2',
//     borderRadius: 8,
//     padding: 10,
//   },
//   textAreaInput: {
//     flex: 1,
//     width: '100%',
//     fontFamily: 'Nunito',
//     fontSize: 14,
//     lineHeight: 21,
//     color: '#606060',
//     textAlignVertical: 'top',
//   },
//   charCount: {
//     fontFamily: 'Nunito',
//     fontSize: 10,
//     lineHeight: 15,
//     color: '#8E8E8E',
//     textAlign: 'right',
//   },
//   bottomBar: {
//     position: 'absolute',
//     bottom: 20,
//     alignSelf: 'center',
//     flexDirection: 'row',
//     width: 242,
//     height: 48,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 999,
//     shadowColor: '#585C5F',
//     shadowOffset: { width: 0, height: 16 },
//     shadowOpacity: 0.16,
//     shadowRadius: 40,
//     elevation: 5,
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   clearButton: {
//     width: 74,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   clearButtonText: {
//     fontFamily: 'Nunito',
//     fontSize: 14,
//     color: '#212121',
//   },
//   completeButton: {
//     width: 168,
//     height: 48,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FC4300',
//     borderRadius: 999,
//   },
//   completeButtonText: {
//     fontFamily: 'Nunito',
//     fontSize: 14,
//     color: '#FFFFFF',
//   },
// });