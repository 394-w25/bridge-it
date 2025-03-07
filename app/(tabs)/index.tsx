import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/UserContext';
import { getUserEntries } from '../../backend/dbFunctions';
import AllEntriesModal from '../screens/allEntry';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function NewLandingPage() {
  const { displayName, photoURL, uid } = useUser();
  const [entriesCount, setEntriesCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchEntriesCount() {
      if (uid) {
        const entries = await getUserEntries(uid);
        setEntriesCount(entries.length);
      }
    }

    fetchEntriesCount();
  }, [uid]);

  const userProfilePic = photoURL ? (
    <Image source={{ uri: photoURL }} style={styles.profilePic} />
  ) : (
    <Image source={require('../../assets/images/profilePic.png')} style={styles.profilePic} />
  );

  return (
    <LinearGradient
      colors={['#D8EEEB', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.statusBar} />

      {userProfilePic}
      <Text style={styles.greeting}>Hi, {displayName}!</Text>

      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statsBox} onPress={() => setIsModalVisible(true)}>
          <Image
            source={require('../../assets/images/entry_icon.png')}
            style={styles.entryIcon}
          />
          <Text style={styles.statsNumber}>{entriesCount}</Text>
          <Text style={styles.statsLabel}>Entries</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.statsBox}>
          <Image
            source={require('../../assets/images/interview_icon.png')}
            style={styles.interviewIcon}
          />
          <Text style={styles.statsNumber}>2</Text>
          <Text style={styles.statsLabel}>Interviews</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.prepContainer} onPress={() => router.push('/interview')}>
        <Image
          source={require('../../assets/images/brain.png')}
          style={styles.brainIcon}
        />
        <Text style={styles.prepText}>Prep Smarter Now</Text>
        <Image
          source={require('../../assets/images/Vector.png')}
          style={styles.arrowIcon}
        />
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.cardsScrollContainer}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View style={styles.card}>
          <View style={styles.dateBubble}>
            <Text style={styles.dateBubbleText}>Feb{'\n'}18</Text>
          </View>
          <Text style={styles.cardTitle}>
            Group project on Renewable Energy
          </Text>
          <Text style={styles.cardDescription}>
            Collaborated with peers to research solar energy solutions and
            presented findings.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, { backgroundColor: '#FFE66D' }]}>
              <Text style={styles.tagText}>Academic</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#FF9C78' }]}>
              <Text style={styles.tagText}>Project</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.dateBubble}>
            <Text style={styles.dateBubbleText}>Feb{'\n'}18</Text>
          </View>
          <Text style={styles.cardTitle}>
            Group project on Renewable Energy
          </Text>
          <Text style={styles.cardDescription}>
            Collaborated with peers to research solar energy solutions and
            presented findings.
          </Text>
          <View style={styles.tagContainer}>
            <View style={[styles.tag, { backgroundColor: '#FFE66D' }]}>
              <Text style={styles.tagText}>Academic</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#FF9C78' }]}>
              <Text style={styles.tagText}>Project</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarItemBig}>
          <Image
            source={require('../../assets/images/add.png')}
            style={styles.plusIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Image
            source={require('../../assets/images/home_filled.png')}
            style={styles.tabIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Image
            source={require('../../assets/images/inbox_icon.png')}
            style={styles.tabIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Image
            source={require('../../assets/images/support_icon.png')}
            style={styles.tabIcon}
          />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <AllEntriesModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      </Modal>
    </LinearGradient>
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
  entryIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  interviewIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  brainIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    marginRight: 8,
  },
  prepText: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '500',
    color: '#1C645F',
  },
  arrowIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
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
  tabBar: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 293,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#EEEEEE',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 8,
  },
  tabBarItemBig: {
    width: 48,
    height: 48,
    backgroundColor: '#288C85',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  plusIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  tabBarItem: {
    width: 44,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#BBBBBB',
  },
});
