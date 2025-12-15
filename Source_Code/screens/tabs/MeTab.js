import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

const MeTab = () => {
  const { isGuest, isMember } = useUser();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Me</Text>
        <Text style={styles.subtitle}>User Profile & Settings</Text>
        {isGuest && (
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>👤 Guest Mode</Text>
          </View>
        )}
        {isMember && (
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>⭐ Member</Text>
          </View>
        )}
        <Text style={styles.note}>(Demo placeholder - content will be implemented here)</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  guestBadge: {
    backgroundColor: '#E1BEE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B39DDB',
    marginBottom: 16,
  },
  guestBadgeText: {
    color: '#4A148C',
    fontSize: 14,
    fontWeight: '600',
  },
  memberBadge: {
    backgroundColor: '#9575CD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  note: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MeTab;

