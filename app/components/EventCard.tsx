import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width } = Dimensions.get('window');

const EventCard = () => {
  return (
    <View style={styles.container}>
      {/* Google Logo and Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Ionicons name="logo-google" size={36} />
        </View>
        <Text style={styles.title}>Google</Text>
      </View>

      {/* Event Title and Details */}
      <View style={styles.details}>
        <Text style={styles.eventTitle}>Connect with Google – Spring 2025 Edition</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Virtual</Text>
          <Text style={styles.infoText}>Tue, March 11</Text>
        </View>
        <View style={styles.tagsContainer}>
          <View style={styles.tag}><Text style={styles.tagText}>Hiring</Text></View>
          <View style={styles.tag}><Text style={styles.tagText}>Information Session</Text></View>
        </View>
        <View style={styles.infoDetailContainer}>
          <Text style={styles.infoDetails}>Northwestern University hosted a "Google Meet Up: Preparing and Practicing for Coding Interviews" event at the Ford Motor Company Engineering Design Center, The Hive, for students, post-docs, and graduate students.</Text>
        </View>
      </View>

      {/* Learn More Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 428,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#1B1C1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 16,
    paddingVertical: 16,
    left: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#C4EEEB',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#212121',
  },
  details: {
    marginTop: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 18,
    marginVertical: 8,
  },
  infoText: {
    fontSize: 10,
    color: '#000000',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  infoDetailContainer: {
    flexDirection: 'row',
    marginTop: 16,
},
    infoDetails: {
        width: '100%',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    },
  tag: {
    borderWidth: 1,
    borderColor: '#8E8E8E',
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 10,
    color: '#333333',
  },
  button: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#288C85',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#288C85',
  },
});

export default EventCard;