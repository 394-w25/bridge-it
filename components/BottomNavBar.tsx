import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Modal } from 'react-native';
import { Link, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EntriesSheet from './EntriesSheet';

interface BottomNavBarProps {
    addButtonColour?: string;
    showAddButton?: boolean;
    completeText?: string;
    clearText?: string;
    completeVariation?: boolean;
    submitFunction?: () => void;
    clearFunction?: () => void;
    homeVariation?: boolean;
}

export default function BottomNavBar({ 
    addButtonColour = '#288C85', 
    showAddButton = true,
    completeVariation = false,
    completeText = 'Save',
    clearText = 'Clear',
    submitFunction = () => {},
    clearFunction = () => {},
    homeVariation = false
}: BottomNavBarProps) {
  const router = useRouter();
  const [isEntriesSheetVisible, setIsEntriesSheetVisible] = useState(false);

  return (
    <>
    <View style={styles.container}>
      {completeVariation ? (
        <View style={styles.completeContainer}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearFunction}
          >
            <Text style={styles.clearText}>{clearText}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={Object.assign({}, 
              styles.addButton, 
              { backgroundColor: addButtonColour }
            )} 
            onPress={submitFunction}
          >
            <Text style={styles.completeText}>{completeText}</Text>
          </TouchableOpacity>
        </View>
      ) : homeVariation ? (
        <View style={styles.completeContainer}>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.homeButton}>
              <MaterialIcons name="home-filled" size={24} color="#BBBBBB" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity 
            style={Object.assign({}, 
              styles.addButton, 
              { backgroundColor: addButtonColour }
            )} 
            onPress={submitFunction}
          >
            <Text style={styles.completeText}>{completeText}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={Object.assign({}, 
          styles.navbar, 
          !showAddButton ? { paddingHorizontal: 36 } : {}
        )}>
        {showAddButton && (
          <Link href="/JournalEntryScreen" asChild>
            <TouchableOpacity 
              style={Object.assign({}, 
                styles.addButton, 
                { backgroundColor: addButtonColour }
              )}
            >
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        )}
        <Link href="/" asChild>
        <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="home-filled" size={24} color="#BBBBBB" />
        </TouchableOpacity>
        </Link>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => setIsEntriesSheetVisible(true)}
        >
          <MaterialIcons name="inbox" size={24} color="#BBBBBB" />
        </TouchableOpacity>

        
        <Link href="/interview" asChild>
        <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="support-agent" size={24} color="#BBBBBB" />
        </TouchableOpacity>
        </Link>
      </View>
      )}
    </View>

    <EntriesSheet 
      visible={isEntriesSheetVisible} 
      onClose={() => setIsEntriesSheetVisible(false)} 
    />
    </>
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
    fontFamily: 'Nunito',
    fontSize: 14,
    color: '#212121',
    textAlign: 'center',
  },
  clearButton: {
    flex: 1,
  },
  homeButton: {
    flex: 1,
    alignItems: 'center',
  },
});