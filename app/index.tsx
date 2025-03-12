import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../context/UserContext';
import { getUserEntries, saveUserBlurb, getUserBlurb } from '../backend/dbFunctions';
import {RadarChart} from '../components/RadarSkillMap';
import IntroductionBlurb from '../components/IntroBlurb';
import BottomNavBar from '../components/BottomNavBar';
import { colors } from './styles/color';
import { generateBlurbFromGemini } from '../backend/gemini';
import { EntryInput } from '../backend/dbFunctions';
import StatsSection from '../components/StatsBar';
import { getCategoryColor } from './screens/EntryDetail';
import AllEntriesModal from './screens/allEntry';
import EventCard from '../components/EventCard';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Linking } from 'react-native';
import { getEvents } from '../constants/events';
import { Ionicons } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

interface Event {
  id: string;
  logo: string;
  companyName: string;
  title: string;
  virtual: boolean;
  date: string;
  tags: string[];
  info: string;
  learnMoreFunction: () => void;
}
export default function NewLandingPage() {
  const { displayName, photoURL, uid, signOutUser } = useUser();
  const [entriesCount, setEntriesCount] = useState(0);
  const [trophyLevel, setTrophyLevel] = useState<string>('Bronze');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [journalEntries, setJournalEntries] = useState<(EntryInput & { id: string })[]>([]);
  
  const [events, setEvents] = useState(getEvents(Linking.openURL));
  const router = useRouter();
  const [blurb, setBlurb] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!uid) {
        router.replace('/signin');
      }
    }
  }, [mounted, uid, router]);

  useEffect(() => {async function fetchEntries() {
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
            const gemini_res = await generateBlurbFromGemini(entries, displayName || 'User');
            await saveUserBlurb(uid, gemini_res);
            setBlurb(gemini_res);
          }
        }
        else{
          const gemini_res = await generateBlurbFromGemini(entries, displayName || 'User');
          await saveUserBlurb(uid, gemini_res);
          setBlurb(gemini_res);
        }
      }
      else{
        setBlurb(blurb);
      }
    }
    fetchEntries();
  }, [uid]);

  // const userProfilePic = photoURL ? (
  //   <Image source={{ uri: photoURL }} style={styles.profilePic} />
  // ) : (
  //   <Image source={require('../../assets/images/profilePic.png')} style={styles.profilePic} />
  // );

  const userProfilePic = <Image source={require('../assets/images/temp_logo.png')} style={styles.profilePic} />

  const getTrophyLevel = (entriesCount: number) => {
    if (entriesCount < 10) return 'Bronze';
    if (entriesCount > 10 && entriesCount < 30) return 'Silver';
    return 'Gold';
  };

  const handleDismissEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleSignOut = async () => {
    await signOutUser();
    // The AuthGuard will handle redirection to the signin page
  };

  return (
    <View style={styles.container}>
      {/* Sign Out Button */}
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Ionicons name="log-out-outline" size={24} color={colors.secondary500} />
        {/* <Text style={styles.signOutText}>Sign Out</Text> */}
      </TouchableOpacity>
      
      <ScrollView>
        <LinearGradient colors={['#D8EEEB', '#FFFFFF']}>
          <View  style={{width: '90%', alignSelf: 'center'}}>
            <View style={styles.statusBar} />

            {userProfilePic}
            <Text style={styles.greeting}>Hi, {displayName}!</Text>
            <StatsSection
              entriesCount={entriesCount}
              trophyLevel={trophyLevel}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
            />
            
            <ScrollView 
              style={styles.cardsScrollContainer}
              contentContainerStyle={{
                alignItems: 'center',
                gap: 16,
              }}
            >
              <RadarChart />
              <IntroductionBlurb 
                name={displayName} 
                profilePic={photoURL} 
                blurb={blurb}/>

              {events.map((event) => (
                <EventCard 
                  key={event.id}
                  logo={event.logo}
                  companyName={event.companyName} 
                  title={event.title} 
                  virtual={event.virtual} 
                  date={event.date} 
                  tags={event.tags} 
                  info={event.info} 
                  learnMoreFunction={event.learnMoreFunction}
                  onDismiss={() => handleDismissEvent(event.id)}/>
              ))}
            </ScrollView>

          </View>
        </LinearGradient>
      </ScrollView>
      <BottomNavBar />
    </View>
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
    width: 48,
    height: 48,
    // marginLeft: 16,
    borderRadius: 18,
  },
  greeting: {
    fontFamily: 'Nunito',
    fontSize: 40,
    fontWeight: '700',
    color: '#212121',
    // marginLeft: 18,
    marginTop: 16,
    marginBottom: 8,
  },
  cardsScrollContainer: {
    flexDirection: 'column',
    marginTop: 16,
    marginBottom: 72,
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
  signOutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 100,
  },
  signOutText: {
    marginLeft: 6,
    color: colors.secondary500,
    fontWeight: '600',
  },
});
