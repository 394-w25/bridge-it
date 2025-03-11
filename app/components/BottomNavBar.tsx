import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface BottomNavBarProps {
    addButtonColour?: string;
    showAddButton?: boolean;
    completeText?: string;
    clearText?: string;
    completeVariation?: boolean;
}

export default function BottomNavBar({ 
    addButtonColour = '#288C85', 
    showAddButton = true,
    completeVariation = false,
    completeText = 'Submit',
    clearText = 'Clear',
}: BottomNavBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {completeVariation ? (
        <View style={styles.completeContainer}>
          <Text style={styles.clearText}>{clearText}</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: addButtonColour }]} 
            onPress={() => {}}
            >
                <Text style={styles.completeText}>{completeText}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[
          styles.navbar, 
          !showAddButton && { paddingHorizontal: 36 }
        ]}>
        {showAddButton && (
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: addButtonColour }]} 
            onPress={() => router.push('/JournalEntryScreen')}
            >
                <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        )}
        <Link href="/" asChild>
        <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="home-filled" size={24} color="#BBBBBB" />
        </TouchableOpacity>
        </Link>
        
        <Link href="/summary" asChild>
        <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="inbox" size={24} color="#BBBBBB" />
        </TouchableOpacity>
        </Link>
        
        <Link href="/JournalEntryScreen" asChild>
        <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="support-agent" size={24} color="#BBBBBB" />
        </TouchableOpacity>
        </Link>
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  navbar: {
    flexDirection: 'row',
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#FF5733',
    width: 128,
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  completeContainer: {
    flexDirection: 'row',
    width: '60%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completeText: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  clearText: {  
    flex: 1,
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#212121',
    textAlign: 'center',

  },
});