import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavBarProps {
  onSubmit: () => void;
  onHomePress: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ onSubmit, onHomePress }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.bottomBar, { width: width * 0.9 }]}>
      <TouchableOpacity style={styles.homeButton} onPress={onHomePress}>
        <Ionicons name="home-outline" size={24} color="#BBBBBB" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 50,  // Fully rounded corners
    position: "absolute",
    bottom: 80, 
    alignSelf: "center",
    elevation: 3, // Subtle shadow effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  homeButton: {
    padding: 10,
    borderRadius: 50, // Rounded shape
    backgroundColor: "#F0F0F0", 
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#A0B7D1", // Blueish color to match the provided screenshot
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 50, // Rounded button shape
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BottomNavBar;
