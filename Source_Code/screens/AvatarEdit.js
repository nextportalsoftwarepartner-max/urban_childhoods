import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

const AvatarEdit = ({ navigation, route }) => {
  // Check if we're in edit mode
  const isEditMode = route?.params?.isEditMode || false;
  const avatarData = route?.params?.avatarData || null;

  const [name, setName] = useState(avatarData?.name || '');
  const [gender, setGender] = useState(avatarData?.gender || '');
  const [age, setAge] = useState(avatarData?.age || '');
  const [race, setRace] = useState(avatarData?.race || '');
  const [skinColor, setSkinColor] = useState(avatarData?.skinColor || '');
  const [hairColor, setHairColor] = useState(avatarData?.hairColor || '');
  const [allergyNotes, setAllergyNotes] = useState(avatarData?.allergyNotes || '');

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];
  const raceOptions = [
    'Asian',
    'Black or African American',
    'Hispanic or Latino',
    'Native American',
    'Pacific Islander',
    'White',
    'Mixed',
    'Other',
  ];
  const colorOptions = [
    'Light',
    'Fair',
    'Medium',
    'Olive',
    'Tan',
    'Brown',
    'Dark Brown',
    'Dark',
  ];

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter a name.');
      return;
    }
    if (!gender) {
      Alert.alert('Validation Error', 'Please select a gender.');
      return;
    }
    if (!age || isNaN(age) || parseInt(age) < 0 || parseInt(age) > 18) {
      Alert.alert('Validation Error', 'Please enter a valid age (0-18).');
      return;
    }
    if (!race) {
      Alert.alert('Validation Error', 'Please select a race.');
      return;
    }
    if (!skinColor) {
      Alert.alert('Validation Error', 'Please select a skin color.');
      return;
    }
    if (!hairColor) {
      Alert.alert('Validation Error', 'Please select a hair color.');
      return;
    }

    // Here you would save the avatar data to your backend/database
    const successMessage = isEditMode 
      ? 'Avatar updated successfully! Your avatar will grow up day by day following real time.'
      : 'Avatar created successfully! Your avatar will grow up day by day following real time.';
    
    Alert.alert(
      'Success',
      successMessage,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('KidAvatarSpace'),
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel? Your changes will not be saved.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{isEditMode ? 'Edit Avatar' : 'Create Avatar'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter avatar name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Gender */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={setGender}
                style={styles.picker}
                dropdownIconColor="#9575CD"
              >
                <Picker.Item label="Select gender" value="" />
                {genderOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Age */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Age *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age (0-18)"
              placeholderTextColor="#999"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>

          {/* Race */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Race *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={race}
                onValueChange={setRace}
                style={styles.picker}
                dropdownIconColor="#9575CD"
              >
                <Picker.Item label="Select race" value="" />
                {raceOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Skin Colour */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Skin Colour *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={skinColor}
                onValueChange={setSkinColor}
                style={styles.picker}
                dropdownIconColor="#9575CD"
              >
                <Picker.Item label="Select skin colour" value="" />
                {colorOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Hair Colour */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Hair Colour *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={hairColor}
                onValueChange={setHairColor}
                style={styles.picker}
                dropdownIconColor="#9575CD"
              >
                <Picker.Item label="Select hair colour" value="" />
                {colorOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Allergy Notes */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Allergy Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter any allergy information or notes"
              placeholderTextColor="#999"
              value={allergyNotes}
              onChangeText={setAllergyNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{isEditMode ? 'Update Avatar' : 'Create Avatar'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1BEE7',
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#9575CD',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E1BEE7',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    color: '#1A1A1A',
    height: Platform.OS === 'ios' ? 200 : 50,
  },
  saveButton: {
    backgroundColor: '#9575CD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#9575CD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AvatarEdit;

