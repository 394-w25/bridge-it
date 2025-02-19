import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { TextInput, ScrollView } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function TabTwoScreen() {
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [title, setTitle] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title..."
          placeholderTextColor="#666"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            <Picker.Item label="Personal" value="personal" />
            <Picker.Item label="Work" value="work" />
            <Picker.Item label="Ideas" value="ideas" />
            <Picker.Item label="Tasks" value="tasks" />
          </Picker>
        </View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          multiline
          value={text}
          onChangeText={setText}
          placeholder="Enter your long text here..."
          placeholderTextColor="#666"
          textAlignVertical="top"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  titleInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    fontSize: 16,
  },
  pickerItem: {
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    minHeight: 200,
    fontSize: 16,
    lineHeight: 24,
  },
});
