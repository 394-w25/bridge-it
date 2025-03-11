import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AllEntriesModal from '../screens/allEntry';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '../styles/color';
import { Dimensions } from 'react-native';
interface StatsSectionProps {
  // styles: any; // Or use a more specific type like Record<string, any>
  entriesCount: number;
  trophyLevel: string;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const StatsSection = ({ entriesCount, trophyLevel, isModalVisible, setIsModalVisible }: StatsSectionProps) => {
  const router = useRouter();
  let trophyColour = '#CD7F32';
  if (trophyLevel === 'Bronze') {
    trophyColour = '#CD7F32';
  } else if (trophyLevel === 'Silver') {
    trophyColour = '#C0C0C0';
  } else if (trophyLevel === 'Gold') {
    trophyColour = '#FFD700';
  }

  return (
    <>
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statsBox} onPress={() => setIsModalVisible(true)}>
            <Ionicons name="document-text-outline" size={24} color={colors.secondary500} />
          <Text style={styles.statsNumber}>{entriesCount}</Text>
          <Text style={styles.statsLabel}>Entries</Text>
        </TouchableOpacity>
        <View style={styles.divider} />

        <View style={styles.statsBox}>
            <Ionicons name="trophy-outline" size={24} color={trophyColour} />
          <Text style={styles.statsNumber}>{trophyLevel}</Text>
        </View>

        <View style={styles.divider} />
        <View style={styles.statsBox}>
          <Ionicons name="mic-outline" size={24} color={colors.secondary500} />
          <Text style={styles.statsNumber}>2</Text>
          <Text style={styles.statsLabel}>Interviews</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.prepContainer} onPress={() => router.push('/interview')}>
        <Ionicons name="briefcase-outline" size={24} color={colors.secondary500} />
        <Text style={styles.prepText}>Prep Smarter Now</Text>
        <FontAwesome6 name="angle-right" size={24} color={colors.secondary500} />
      </TouchableOpacity>


      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <AllEntriesModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      </Modal>
    </>
  );
};

export default StatsSection;

const styles = StyleSheet.create({
  statsContainer: {
    // width: width - 32,
    width: '100%',
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
    // width: width - 32,
    width: '100%',
    // height: 74,
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
    paddingVertical: 24,
    
  },
  prepText: {
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 20,
    fontWeight: '500',
    color: '#1C645F',
  },
});

