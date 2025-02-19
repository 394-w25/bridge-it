import { StyleSheet, Image } from 'react-native';
import { Text, View } from '@/components/Themed';
import { TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabTwoScreen() {
  const [text, setText] = useState('');
  const [selectedType, setSelectedType] = useState('personal');
  const [title, setTitle] = useState('');

  const achievementTypes = [
    { label: '🏆 Achievement', value: 'achievement' },
    { label: '📚 Learning', value: 'learning' },
    { label: '💪 Personal Growth', value: 'growth' },
    { label: '🎯 Goal Reached', value: 'goal' },
    { label: '🌟 Milestone', value: 'milestone' },
  ];

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log({ type: selectedType, title, text });
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
      <Text style={styles.title}>Record Achievement</Text>
      <View style={styles.inputContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedType}
            onValueChange={(itemValue) => setSelectedType(itemValue)}
            style={styles.picker}
          >
            {achievementTypes.map((type) => (
              <Picker.Item 
                key={type.value}
                label={type.label} 
                value={type.value}
              />
            ))}
          </Picker>
        </View>

        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="What did you achieve?"
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          multiline
          value={text}
          onChangeText={setText}
          placeholder="Tell me more about your achievement..."
          placeholderTextColor="#666"
          textAlignVertical="top"
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <FontAwesome name="check-circle" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Achievement</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2f95dc',
  },
  inputContainer: {
    marginBottom: 15,
  },
  titleInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 15,
    minHeight: 200,
    fontSize: 16,
    lineHeight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  saveButton: {
    backgroundColor: '#2f95dc',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

