import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import AllEntriesModal from '../screens/allEntry';

const StatsSection = ({ styles, entriesCount, trophyLevel, isModalVisible, setIsModalVisible }) => {
  const router = useRouter();

  return (
    <>
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statsBox} onPress={() => setIsModalVisible(true)}>
          <Image source={require('../../assets/images/entry_icon.png')} style={styles.entryIcon} />
          <Text style={styles.statsNumber}>{entriesCount}</Text>
          <Text style={styles.statsLabel}>Entries</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <View style={styles.statsBox}>
          <Image source={require('../../assets/images/Trophy.png')} style={styles.trophyIcon} />
          <Text style={styles.statsNumber}>{trophyLevel}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statsBox}>
          <Image source={require('../../assets/images/mic.png')} style={styles.interviewIcon} />
          <Text style={styles.statsNumber}>2</Text>
          <Text style={styles.statsLabel}>Interviews</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.prepContainer} onPress={() => router.push('/interview')}>
        <Image source={require('../../assets/images/brain.png')} style={styles.brainIcon} />
        <Text style={styles.prepText}>Prep Smarter Now</Text>
        <Image source={require('../../assets/images/Vector.png')} style={styles.arrowIcon} />
      </TouchableOpacity>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabBarItemBig}>
          <Image source={require('../../assets/images/add.png')} style={styles.plusIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Image source={require('../../assets/images/home_filled.png')} style={styles.tabIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Image source={require('../../assets/images/inbox_icon.png')} style={styles.tabIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabBarItem}>
          <Image source={require('../../assets/images/support_icon.png')} style={styles.tabIcon} />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <AllEntriesModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      </Modal>
    </>
  );
};

export default StatsSection;