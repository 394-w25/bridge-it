import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AllEntriesModal from '../screens/allEntry';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '../styles/color';
interface StatsSectionProps {
  styles: any; // Or use a more specific type like Record<string, any>
  entriesCount: number;
  trophyLevel: string;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

const StatsSection = ({ styles, entriesCount, trophyLevel, isModalVisible, setIsModalVisible }: StatsSectionProps) => {
  const router = useRouter();

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
            <Ionicons name="trophy-outline" size={24} color="#CD7F32" />
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