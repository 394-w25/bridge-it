import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CircleButtonProps {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ icon, label, color, onPress }) => {
  return (
    <TouchableOpacity style={[styles.circle, { backgroundColor: color }]} onPress={onPress}>
      <FontAwesome name={icon} size={50} color="#212121" />
      <View style={styles.innerCircle} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(0,0,0,0.1)",
    position: "absolute",
  },
  label: {
    fontFamily: "Nunito",
    fontSize: 16,
    fontWeight: "800",
    color: "#212121",
    textAlign: "center",
  },
});

export default CircleButton;
