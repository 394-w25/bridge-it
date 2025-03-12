import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../app/styles/color';

interface EventCardProps {
  logo: string | React.ReactNode;
  companyName: string;
  title: string;
  virtual: boolean;
  date: string;
  tags: Array<string>;
  info: string;
  learnMoreFunction: () => void;
  onDismiss?: () => void;
}

const EventCard = ({ logo, companyName, title, virtual, date, tags, info, learnMoreFunction, onDismiss }: EventCardProps) => {
  return (
    <View style={styles.container}>
      {onDismiss && (
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <MaterialIcons name="close" size={18} color={colors.neutral600} />
        </TouchableOpacity>
      )}

      {/* Google Logo and Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
            {typeof logo === 'string' ? (
              <Image source={{ uri: logo }} />
            ) : (
              logo
            )}
        </View>
        <Text style={styles.companyName}>{companyName}</Text>
      </View>

      {/* Event Title and Details */}
      <View style={styles.details}>
        <Text style={styles.eventTitleText}>{title}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{virtual ? 'Virtual' : 'In-Person'}</Text>
          <MaterialIcons name="circle" size={2} color={colors.neutral800} />
          <Text style={styles.infoText}>{date}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.tagText}></Text>
          )}
        </View>
        <View style={styles.infoDetailContainer}>
          {info && info.length > 0 ? (
            <Text style={styles.infoDetails}>{info}</Text>
          ) : (
            <Text style={styles.infoDetails}>No information available, see the event page for more details.</Text>
          )}
        </View>
      </View>

      {/* Learn More Button */}
      <TouchableOpacity style={styles.button} onPress={learnMoreFunction}>
        <Text style={styles.buttonText}>Learn more</Text>
        <MaterialIcons name="arrow-right-alt" size={24} color={colors.secondary500} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#1B1C1D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    paddingVertical: 30,
    paddingHorizontal: 24,
  },
  dismissButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: colors.secondaryAlpha10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Nunito',
    fontWeight: '500',
    color: '#212121',
  },
  details: {
    marginTop: 16,
  },
  eventTitleText: {
    fontSize: 20,
    fontFamily: 'Nunito',
    fontWeight: '700',
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 10,
    fontFamily: 'DM Sans',
    color: colors.neutral800,
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
    fontFamily: 'DM Sans',
    fontStyle: 'normal',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 21,
    color: colors.neutral800,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.neutral600,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 10,
    color: colors.neutral1000,
    fontFamily: 'DM Sans',
  },
  button: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.secondary500,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 14,
    color: colors.secondary500,
    fontFamily: 'DM Sans',
  },
});

export default EventCard;