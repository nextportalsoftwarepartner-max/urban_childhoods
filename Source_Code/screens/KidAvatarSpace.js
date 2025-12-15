import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEFAULT_AVATAR_KEY = '@default_avatar_id';

const KidAvatarSpace = ({ navigation }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [setAsDefault, setSetAsDefault] = useState(false);
  
  // Sample avatar data - in real app, this would come from an API or database
  const [availableAvatars, setAvailableAvatars] = useState([
    { id: 1, name: 'Avatar 1', emoji: '👶', color: '#FFB6C1' },
    { id: 2, name: 'Avatar 2', emoji: '🧒', color: '#FFD700' },
    { id: 3, name: 'Avatar 3', emoji: '👧', color: '#FFA07A' },
    { id: 4, name: 'Avatar 4', emoji: '👦', color: '#87CEEB' },
    { id: 5, name: 'Avatar 5', emoji: '🧑', color: '#98D8C8' },
    { id: 6, name: 'Avatar 6', emoji: '👨‍👩‍👧', color: '#F0E68C' },
  ]);

  // Load default avatar on component mount
  useEffect(() => {
    loadDefaultAvatar();
  }, []);

  const loadDefaultAvatar = async () => {
    try {
      const defaultAvatarId = await AsyncStorage.getItem(DEFAULT_AVATAR_KEY);
      if (defaultAvatarId) {
        const avatarId = parseInt(defaultAvatarId, 10);
        // Check if the default avatar still exists in available avatars
        const avatarExists = availableAvatars.some(avatar => avatar.id === avatarId);
        if (avatarExists) {
          setSelectedAvatar(avatarId);
        }
      }
    } catch (error) {
      console.error('Error loading default avatar:', error);
    }
  };

  const selectAvatar = (avatarId) => {
    setSelectedAvatar(avatarId);
  };

  const handleLetsGo = async () => {
    if (!selectedAvatar) {
      Alert.alert('Selection Required', 'Please select an avatar to continue.');
      return;
    }
    
    // Save as default if checkbox is checked
    if (setAsDefault) {
      try {
        await AsyncStorage.setItem(DEFAULT_AVATAR_KEY, selectedAvatar.toString());
      } catch (error) {
        console.error('Error saving default avatar:', error);
        Alert.alert('Warning', 'Could not save default avatar preference.');
      }
    }
    
    // Navigate to menu lobby with selected avatar
    navigation.navigate('MenuLobby', { selectedAvatarId: selectedAvatar });
  };

  const handleCreateAvatar = () => {
    // Navigate to avatar edit page
    navigation.navigate('AvatarEdit');
  };

  const handleLongPress = (avatar) => {
    Alert.alert(
      avatar.name,
      'What would you like to do with this avatar?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteAvatar(avatar.id),
        },
        {
          text: 'Edit',
          onPress: () => handleEditAvatar(avatar),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAvatar = async (avatarId) => {
    Alert.alert(
      'Delete Avatar',
      'Are you sure you want to delete this avatar? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Check if this avatar was set as default
              const defaultAvatarId = await AsyncStorage.getItem(DEFAULT_AVATAR_KEY);
              if (defaultAvatarId && parseInt(defaultAvatarId, 10) === avatarId) {
                // Clear default avatar if it's the one being deleted
                await AsyncStorage.removeItem(DEFAULT_AVATAR_KEY);
              }
              
              // Remove avatar from list
              setAvailableAvatars((prev) => prev.filter((avatar) => avatar.id !== avatarId));
              
              // Clear selection if deleted avatar was selected
              if (selectedAvatar === avatarId) {
                setSelectedAvatar(null);
                setSetAsDefault(false);
              }
              
              // In real app, this would also delete from database/API
              Alert.alert('Success', 'Avatar deleted successfully.');
            } catch (error) {
              console.error('Error deleting avatar:', error);
              Alert.alert('Error', 'Failed to delete avatar. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditAvatar = (avatar) => {
    // Navigate to edit page with avatar data
    navigation.navigate('AvatarEdit', { avatarData: avatar, isEditMode: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kid Avatar Space</Text>
        <Text style={styles.subtitle}>
          3D Avatar cartoons representing your kids. They grow up day by day following real time.
        </Text>
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>
            💡 Long press an avatar to edit or delete
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarGrid}>
          {availableAvatars.map((avatar) => {
            const isSelected = selectedAvatar === avatar.id;
            return (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarCard,
                  isSelected && styles.avatarCardSelected,
                ]}
                onPress={() => selectAvatar(avatar.id)}
                onLongPress={() => handleLongPress(avatar)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: avatar.color },
                    isSelected && styles.avatarCircleSelected,
                  ]}
                >
                  <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                </View>
                <Text style={styles.avatarName}>{avatar.name}</Text>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {/* Set as Default Checkbox - only show when avatar is selected */}
        {selectedAvatar && (
          <TouchableOpacity
            style={styles.defaultCheckboxContainer}
            onPress={() => setSetAsDefault(!setAsDefault)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, setAsDefault && styles.checkboxChecked]}>
              {setAsDefault && <Text style={styles.checkmarkText}>✓</Text>}
            </View>
            <Text style={styles.defaultCheckboxLabel}>
              Set as default avatar (will auto-select next time)
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.letsGoButton,
            !selectedAvatar && styles.buttonDisabled,
          ]}
          onPress={handleLetsGo}
          disabled={!selectedAvatar}
        >
          <Text style={styles.buttonText}>Let's GO</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.createAvatarButton]}
          onPress={handleCreateAvatar}
        >
          <Text style={styles.createAvatarButtonText}>Create Avatar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
    marginBottom: 12,
  },
  hintContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E1BEE7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B39DDB',
  },
  hintText: {
    fontSize: 12,
    color: '#4A148C',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  avatarCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E1BEE7',
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  avatarCardSelected: {
    borderColor: '#9575CD',
    borderWidth: 3,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarCircleSelected: {
    borderColor: '#9575CD',
    borderWidth: 4,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#9575CD',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1BEE7',
    gap: 12,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#9575CD',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  letsGoButton: {
    backgroundColor: '#9575CD',
  },
  buttonDisabled: {
    backgroundColor: '#B39DDB',
    opacity: 0.5,
  },
  createAvatarButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#9575CD',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAvatarButtonText: {
    color: '#9575CD',
    fontSize: 16,
    fontWeight: 'bold',
  },
  defaultCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9575CD',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#9575CD',
    borderColor: '#9575CD',
  },
  defaultCheckboxLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 20,
  },
});

export default KidAvatarSpace;

