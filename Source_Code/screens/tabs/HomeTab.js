import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = SCREEN_HEIGHT * 0.25; // 25% of screen height
const CONTENT_HEIGHT = SCREEN_HEIGHT * 0.75; // 75% of screen height

const HomeTab = () => {
  const { isGuest, isMember, userGender } = useUser();
  const [qrModalVisible, setQrModalVisible] = useState(false);

  // Determine greeting based on user type and gender
  const getGreeting = () => {
    if (isGuest) {
      return 'Hi,\nDear Mummy and Daddy';
    } else if (isMember) {
      if (userGender === 'male') {
        return 'Hi,\nAwesome Daddy';
      } else if (userGender === 'female') {
        return 'Hi,\nAwesome Mummy';
      } else {
        return 'Hi,\nAwesome Parent';
      }
    }
    return 'Hi,\nDear Mummy and Daddy';
  };

    // Sample announcement data (will be replaced with real data later)
    const announcements = [
      { id: 1, type: 'announcement', title: 'New App Feature - Baby Development Tracker', description: 'Track your baby\'s milestones with our new development tracker feature!', postedDate: '2024-12-15', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&h=200&fit=crop' },
      { id: 2, type: 'promotion', title: 'Special Promotion - RM50 Cash Voucher', description: 'Get RM50 cash voucher with minimum purchase of RM250. Limited time offer!', postedDate: '2024-12-14', imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop' },
      { id: 3, type: 'training', title: 'Swimming Course for Toddlers', description: 'Join our swimming course designed for toddlers aged 2-4 years. Build confidence in water!', postedDate: '2024-12-13', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&h=200&fit=crop' },
      { id: 4, type: 'event', title: 'Parent-Child Bonding Event', description: 'Join our monthly parent-child bonding activities and make new friends!', postedDate: '2024-12-12', imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop' },
      { id: 5, type: 'announcement', title: 'New Nutrition Guide Available', description: 'Download our latest nutrition guide for healthy baby development!', postedDate: '2024-12-11', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop' },
    ];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle More Info button click
  const handleMoreInfo = (item) => {
    // For demo purposes, show an alert. In production, this would navigate to a detail screen
    Alert.alert(
      item.title,
      `${item.description}\n\nPosted on: ${formatDate(item.postedDate)}\n\nMore detailed information will be displayed here.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Layer 1: Header (30% of screen height) */}
      <View style={[styles.headerLayer, { height: HEADER_HEIGHT }]}>
        {/* Top: Logo + Title */}
        <View style={styles.topSection}>
          <Text style={styles.logo}>👶</Text>
          <Text style={styles.title}>URBAN CHILDHOODS</Text>
        </View>

        {/* Bottom: Greeting and QR Code */}
        <View style={styles.bottomSection}>
          {/* Bottom Left: Greeting */}
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
          </View>

          {/* Bottom Right: QR Code */}
          <View style={styles.qrCodeContainer}>
            <TouchableOpacity 
              style={styles.qrCodePlaceholder}
              onPress={() => setQrModalVisible(true)}
              activeOpacity={0.7}
            >
              {/* Mini QR Code Pattern */}
              <View style={styles.miniQrCode}>
                <View style={styles.miniQrRow}>
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={styles.miniQrSquare} />
                </View>
                <View style={styles.miniQrRow}>
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={styles.miniQrSquare} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={styles.miniQrSquare} />
                </View>
                <View style={styles.miniQrRow}>
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={styles.miniQrSquare} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                </View>
                <View style={styles.miniQrRow}>
                  <View style={styles.miniQrSquare} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                  <View style={styles.miniQrSquare} />
                  <View style={[styles.miniQrSquare, styles.miniQrSquareFilled]} />
                </View>
              </View>
              <Text style={styles.qrCodeLabel}>QR Code</Text>
              <Text style={styles.qrCodeHint}>Tap to enlarge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Layer 2: Information Layer (70% of screen height) */}
      <View style={[styles.contentLayer, { height: CONTENT_HEIGHT }]}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {announcements.map((item) => (
            <View key={item.id} style={styles.announcementBox}>
              <View style={styles.announcementContent}>
                {/* Column 1 (Left - 60%): Category + Posted Date + Summary Info + Button */}
                <View style={styles.leftColumn}>
                  <View style={styles.announcementHeader}>
                    <View style={[styles.typeBadge, styles[`${item.type}Badge`]]}>
                      <Text style={styles.typeBadgeText}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.postedDate}>{formatDate(item.postedDate)}</Text>
                  </View>
                  <Text style={styles.announcementTitle}>{item.title}</Text>
                  <Text style={styles.announcementDescription}>{item.description}</Text>
                  <TouchableOpacity 
                    style={styles.moreInfoButton}
                    onPress={() => handleMoreInfo(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.moreInfoButtonText}>More Info</Text>
                  </TouchableOpacity>
                </View>

                {/* Column 2 (Right - 50%): Image */}
                <View style={styles.rightColumn}>
                  <Image 
                    source={{ uri: item.imageUrl }}
                    style={styles.imagePlaceholder}
                    resizeMode="cover"
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setQrModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>QR Code</Text>
                <Text style={styles.modalSubtitle}>Show this code at our physical store</Text>
                
                {/* QR Code Display */}
                <View style={styles.qrCodeDisplay}>
                  <View style={styles.qrCodePattern}>
                    {/* QR Code Pattern - Placeholder squares */}
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                    </View>
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                    </View>
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                    </View>
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                    </View>
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                    </View>
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                    </View>
                    <View style={styles.qrCodeRow}>
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                      <View style={[styles.qrSquare]} />
                      <View style={[styles.qrSquare, styles.qrSquareFilled]} />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setQrModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  // Layer 1: Header Styles
  headerLayer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1BEE7',
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  logo: {
    fontSize: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  greetingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 28,
  },
  qrCodeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  qrCodePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E1BEE7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  miniQrCode: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 3,
    marginBottom: 4,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  miniQrRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  miniQrSquare: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    margin: 0.5,
  },
  miniQrSquareFilled: {
    backgroundColor: '#1A1A1A',
  },
  qrCodeLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9575CD',
    textAlign: 'center',
    marginTop: 2,
  },
  qrCodeHint: {
    fontSize: 7,
    color: '#999',
    textAlign: 'center',
    marginTop: 1,
  },
  // Layer 2: Content Layer Styles
  contentLayer: {
    backgroundColor: '#F5F3FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150
  },
  announcementBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingLeft: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 0,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E1BEE7',
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  announcementContent: {
    flexDirection: 'row',
    gap: 0,
    minHeight: 140, // Minimum height, auto-adjusts based on content
  },
  leftColumn: {
    flex: 0.5,
    justifyContent: 'space-between',
    paddingRight: 10
  },
  rightColumn: {
    flex: 0.5,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingRight: 8,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  announcementBadge: {
    backgroundColor: '#E3F2FD',
  },
  promotionBadge: {
    backgroundColor: '#FFF3E0',
  },
  trainingBadge: {
    backgroundColor: '#F3E5F5',
  },
  eventBadge: {
    backgroundColor: '#E8F5E9',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  postedDate: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  announcementDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  moreInfoButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9575CD',
    marginTop: 'auto',
  },
  moreInfoButtonText: {
    color: '#9575CD',
    fontSize: 13,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: '#F5F3FF',
    borderRadius: 12,
  },
  // QR Code Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '85%',
    maxWidth: 350,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodeDisplay: {
    width: 250,
    height: 250,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E1BEE7',
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodePattern: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  qrCodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  qrSquare: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    margin: 1,
  },
  qrSquareFilled: {
    backgroundColor: '#1A1A1A',
  },
  closeButton: {
    backgroundColor: '#9575CD',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeTab;

