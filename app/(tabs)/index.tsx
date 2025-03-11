import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/UserContext';
import { getUserEntries, saveUserBlurb, getUserBlurb } from '../../backend/dbFunctions';
import {RadarChart }from '../components/RadarSkillMap';
import IntroductionBlurb from '../components/IntroBlurb';
import BottomNavBar from '../components/BottomNavBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '../styles/color';
import { generateBlurbFromGemini } from '../../backend/gemini';
import StatsSection from '../components/StatsBar';

const { width } = Dimensions.get('window');

export default function NewLandingPage() {
  const { displayName, photoURL, uid } = useUser();
  const [entriesCount, setEntriesCount] = useState(0);
  const [trophyLevel, setTrophyLevel] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [blurb, setBlurb] = useState('');

  useEffect(() => {
    async function fetchEntries() {
      if (uid) {
        const entries = await getUserEntries(uid);
        console.log('entries are ', entries);
        setJournalEntries(entries);
        setEntriesCount(entries.length);
        setTrophyLevel(getTrophyLevel(entries.length));
        // Generate blurb from Gemini
        const blurb = await getUserBlurb(uid);
        if(!blurb){
          if (entries.length == 0){
            setBlurb('Add some entries to get your blurb!');
          }
          else{
            const gemini_res = await generateBlurbFromGemini(entries, displayName);
            await saveUserBlurb(uid, gemini_res);
            setBlurb(gemini_res);
          }
        }
        else{
          setBlurb(blurb);
        }
      }
    }

    fetchEntries();
  }, [uid]);

  const userProfilePic = photoURL ? (
    <Image source={{ uri: photoURL }} style={styles.profilePic} />
  ) : (
    <Image source={require('../../assets/images/profilePic.png')} style={styles.profilePic} />
  );

  const getTrophyLevel = (entriesCount) => {
    if (entriesCount < 10) return 'Bronze';
    if (entriesCount > 10 && entriesCount < 30) return 'Silver';
    return 'Gold';
  };



  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <LinearGradient colors={['#D8EEEB', '#FFFFFF']} style={styles.container}>
          <View style={styles.statusBar} />

          {userProfilePic}
          <Text style={styles.greeting}>Hi, {displayName}!</Text>

          <StatsSection
            styles={styles}
            entriesCount={entriesCount}
            trophyLevel={trophyLevel}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
          />

<!--           <TouchableOpacity style={styles.prepContainer} onPress={() => router.push('/interview')}>
            <Ionicons name="briefcase-outline" size={24} color={colors.secondary500} />
            <Text style={styles.prepText}>Prep Smarter Now</Text>
            <FontAwesome6 name="angle-right" size={24} color={colors.secondary500} />
          </TouchableOpacity> -->

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollContainer}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {journalEntries.slice(0, 5).map((entry, index) => (
              <TouchableOpacity key={index} style={styles.card} onPress={() => openEntryModal(entry)}>
                <View style={styles.dateBubble}>
                  <Text style={styles.dateBubbleText}>{formatDate(entry.timestamp)}</Text>
                </View>
                <Text style={styles.cardTitle}>{entry.title}</Text>
                <Text style={styles.cardDescription}>{entry.shortSummary}</Text>
                <View style={styles.tagContainer}>
                  {entry.categories.map((category, idx) => (
                    <View key={idx} style={[styles.tag, { backgroundColor: getCategoryColor(category) }]}>
                      <Text style={styles.tagText}>{category}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Modal visible={isModalVisible} animationType="slide" transparent={true}>
            <AllEntriesModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
          </Modal>

          <Modal animationType="slide" transparent={true} visible={entryModalVisible}>
            <View style={styles.entryModalOverlay}>
              <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.entryModalContainer}>
                <TouchableOpacity onPress={() => setEntryModalVisible(false)} style={styles.backButton}>
                  <View style={styles.backButtonInner}>
                    <Text style={styles.backText}>←</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.title}>{selectedEntry?.title}</Text>

                <View style={styles.categoriesContainer}>
                  {selectedEntry?.categories?.map(cat => (
                    <View key={cat} style={[styles.categoryChip, { backgroundColor: getCategoryColor(cat) }]}>
                      <Text style={styles.categoryText}>{cat}</Text>
                    </View>
                  ))}
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={styles.sectionTitle}>Summary</Text>
                  <Text style={styles.entryText}>{selectedEntry?.shortSummary}</Text>

                  <Text style={styles.sectionTitle}>Identified Hard Skills</Text>
                  {selectedEntry?.identifiedHardSkills?.map(skill => (
                    <Text key={skill} style={styles.listItem}>{skill}</Text>
                  ))}

                  <Text style={styles.sectionTitle}>Identified Soft Skills</Text>
                  {selectedEntry?.identifiedSoftSkills?.map(skill => (
                    <Text key={skill} style={styles.listItem}>{skill}</Text>
                  ))}

                  <Text style={styles.sectionTitle}>Reflection</Text>
                  <Text style={styles.entryText}>{selectedEntry?.reflection}</Text>
                </ScrollView>
              </LinearGradient>
            </View>
          </Modal>
          <RadarChart />
          <IntroductionBlurb name={displayName} profilePic={photoURL} />
        </LinearGradient>
      </ScrollView>
      <BottomNavBar />
    </View>

<!-- 
        <ScrollView horizontal>
          <RadarChart />
          <IntroductionBlurb name={displayName} profilePic={photoURL} blurb={blurb}/>
        </ScrollView> -->
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: 44,
  },
  profilePic: {
    width: 36,
    height: 36,
    marginLeft: 16,
    borderRadius: 18,
  },
  greeting: {
    fontFamily: 'Nunito',
    fontSize: 40,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  statsContainer: {
    width: width - 32,
    height: 103,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    shadowColor: '#1B1C1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
    paddingHorizontal: 20,
  },
  statsBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsNumber: {
    fontFamily: 'Nunito',
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
  },
  statsLabel: {
    fontFamily: 'Nunito',
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E8E',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 20,
  },
  prepContainer: {
    width: width - 32,
    height: 74,
    backgroundColor: '#C4EEEB',
    borderWidth: 1,
    borderColor: '#33B5AB',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    shadowColor: '#585C5F',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 2,
  },

//   entryIcon: {
//     width: 32,
//     height: 32,
//     resizeMode: 'contain',
//   },
//   trophyIcon: {
//     width: 38,
//     height: 38,
//     resizeMode: 'contain',
//   },
//   interviewIcon: {
//     width: 30,
//     height: 30,
//     resizeMode: 'contain',
//   },
//   brainIcon: {
//     width: 32,
//     height: 32,
//     resizeMode: 'contain',
//     marginRight: 8,
//   },

  prepText: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '500',
    color: '#1C645F',
  },
  cardsScrollContainer: {
    marginTop: 16,
  },
  card: {
    width: 255,
    height: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    padding: 16,
    shadowColor: '#1B1C1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  dateBubble: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C4EEEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateBubbleText: {
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
    color: '#212121',
  },
  cardTitle: {
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '700',
    color: '#288C85',
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: 'Nunito',
    fontSize: 10,
    lineHeight: 15,
    color: '#000',
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: 'Nunito',
    fontSize: 10,
    color: '#000',
  },
  entryModalOverlay: { flex: 1, justifyContent: 'center' },
  entryModalContainer: {
    width: width,
    flex: 1,
    marginTop: 30,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  backButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    marginBottom: 10,
  },
  backText: {
    fontSize: 20,
    color: '#007AFF',
    textAlign: 'center',
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, marginTop: 30 },
  categoriesContainer: { flexDirection: 'row', marginTop: 10, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 25 },
  entryText: { fontSize: 16, color: '#555', marginTop: 10 },
  listItem: { fontSize: 16, color: '#555', marginLeft: 10, marginTop: 5 },
});
