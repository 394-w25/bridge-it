import React, { useState } from 'react';
import { View, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/nativewindui/Text'; // Your custom Text component
import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, useRouter } from 'expo-router';
import { postUserEntry } from '@/backend/dbFunctions';
import { Timestamp } from 'firebase/firestore';

type AchievementType = 'academic' | 'personal' | 'professional' | 'other';

export default function TabTwoScreen() {
  const router = useRouter();
  const userId = '0R5lwzBSq4dkMb2FXvJC';

  // State for user input
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<AchievementType | null>(null);
  const [items, setItems] = useState([
    { label: 'Academic', value: 'Academic' },
    { label: 'Personal', value: 'Personal' },
    { label: 'Professional', value: 'Professional' },
    { label: 'Other', value: '' },
  ]);

  const handleSave = async () => {
    if (!value || !title || !text) {
      alert('Please complete all fields.');
      return;
    }

    try {
      await postUserEntry(userId, {
        title,
        content: text, // Now using user input directly
        timestamp: Timestamp.now(),
      });

      router.push({
        pathname: './summary',
        params: {
          type: value,
          title,
          description: text, // Use user input directly
        },
      });

    } catch (error) {
      console.error('Error saving achievement:', error);
      alert('Failed to save achievement. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <Text style={[styles.title, { color: '#545F71', fontSize: 40, lineHeight: 50 }]}>
        What did you achieve today?
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder="Select Type"
            placeholderStyle={styles.placeholderText}
            containerStyle={styles.dropdownPicker}
            style={styles.dropdown}
            textStyle={styles.dropdownText}
            listItemContainerStyle={styles.dropdownItem}
            dropDownContainerStyle={styles.dropdownMenu}
          />
        </View>

        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#666"
        />
      </View>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.mainInput}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="What did you achieve?"
            placeholderTextColor="#666"
            textAlignVertical="top"
          />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <FontAwesome name="home" size={20} color="#fff" />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <FontAwesome name="check-circle" size={20} color="#fff" />
          <Text style={[styles.saveButtonText, { color: '#fff' }]}>Save Achievement</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#40b4d8',
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    height: 250,
    marginBottom: -56,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#545F71',
    fontWeight: 'bold',
  },
  inputRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  dropdownContainer: {
    width: '50%',
    position: 'relative',
    zIndex: 1000,
    overflow: 'visible',
  },
  dropdownPicker: {
    height: 50,
  },
  dropdown: {
    backgroundColor: 'white',
    borderRadius: 28,
    borderWidth: 0,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownItem: {
    borderWidth: 0,
  },
  dropdownMenu: {
    borderWidth: 0,
    zIndex: 3000,
    elevation: 3000,
  },
  placeholderText: {
    color: '#666',
  },
  titleInput: {
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 16,
    fontSize: 16,
    height: 50,
  },
  scrollView: {
    width: '100%',
    flex: 1,
    zIndex: -1000,
    flexGrow: 1,
    maxHeight: 300,
  },
  mainInput: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 16,
    minHeight: 280,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  homeButton: {
    backgroundColor: '#545F71',
    borderRadius: 999,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#545F71',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});
