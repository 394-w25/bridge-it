import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default function IntroductionBlurb({ name, profilePic, blurb }) {
  return (
    <View style={styles.container}>
      {/* Header row: person icon + text */}
      <View style={styles.headerRow}>
        <Image source={{ uri: profilePic }} style={styles.personIcon} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.subTitle}>Who are you?</Text>
          <Text style={styles.mainTitle}>Your Bridge-It Blurb</Text>
        </View>
      </View>

      {/* Main blurb text */}
      <Text style={styles.blurb}>
        {blurb}
      </Text>

      {/* Call-to-action button */}
      <TouchableOpacity style={styles.reviewButton}>
        <Text style={styles.reviewButtonText}>Review your experiences now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    paddingHorizontal: 16,
    height: 428,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: 'rgba(27, 28, 29, 0.04)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personIcon: {
    width: 61,
    height: 61,
    borderRadius: 999, // circular
    marginRight: 12,
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  subTitle: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
  },
  mainTitle: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 30,
    color: '#333333',
    marginTop: 2,
  },
  blurb: {
    width: '100%',
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#333333',
    marginTop: 20,
    // You can tweak margin if needed
  },
  reviewButton: {
    height: 37,
    borderWidth: 1,
    borderColor: '#288C85',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginTop: 16,
    // gap: 10, // RN doesn't support 'gap' fully yet, so we can manually space
  },
  reviewButtonText: {
    fontFamily: 'Nunito',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    color: '#288C85',
  },
});
