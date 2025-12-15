import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9; // 90% of screen height

// Storage key for child age
const CHILD_AGE_KEY = '@child_age';
const CHILD_NAME_KEY = '@child_name';

// Developmental data by age (in months)
const developmentalData = {
  6: {
    ageLabel: '6-Month-Old Baby',
    overall: {
      title: 'Overall Development',
      description: 'At 6 months, your baby is becoming more interactive and developing important motor and social skills.',
      milestones: [
        'Shows curiosity about the world around them',
        'Responds to familiar faces and voices',
        'Begins to sit with support',
        'Shows interest in food',
      ],
    },
    socialEmotional: {
      title: 'Social & Emotional',
      subtitle: 'How your baby connects with people around them at 6 months',
      milestones: [
        'Usually happy and responsive to others\' emotions',
        'Begins to distinguish between familiar faces and strangers',
        'Enjoys playing with parents and caregivers',
        'Likes looking at their reflection in a mirror',
      ],
      tips: [
        'Talk to your baby about what is happening around them using a gentle and positive tone',
        'Include a child-safe mirror among their toys so they can observe their movements',
        'Play interactive games such as peek-a-boo',
      ],
    },
    brainDevelopment: {
      title: 'Brain Development',
      subtitle: 'How your baby\'s brain is growing',
      milestones: [
        'Shows curiosity by reaching for nearby and out-of-reach objects',
        'Transfers objects from one hand to the other and brings them to the mouth',
      ],
      tips: [
        'Provide toys that are easy to grasp with one hand',
        'Talk about the objects your baby is holding or mouthing',
      ],
    },
    movementPhysical: {
      title: 'Movement & Physical Development',
      subtitle: 'How your baby moves through their environment',
      milestones: [
        'Begins sitting without support',
        'Rolls over in both directions',
        'Pushes down on their legs when feet are on a firm surface',
        'Rocks back and forth',
      ],
      tips: [
        'Place favorite toys nearby to encourage rolling and reaching',
      ],
    },
    foodNutrition: {
      title: 'Food & Nutrition',
      subtitle: 'What mealtimes look like at 6 months',
      milestones: [
        'Shows interest in food and opens their mouth when spoon-fed',
        'Moves food from the front to the back of the mouth',
        'Begins eating cereals and single-ingredient purees (e.g., carrots, sweet potato, pears)',
      ],
      tips: [
        'At 6 months, breast milk alone is no longer sufficient. Introduce 2–3 spoonfuls of soft food, up to four times a day',
      ],
    },
    thingsToLookOutFor: {
      title: 'Things for Parents to Look Out For',
      subtitle: 'Consult a paediatrician if your 6-month-old baby:',
      warnings: [
        'Does not show affection toward parents or caregivers',
        'Does not respond to nearby sounds',
        'Rarely laughs',
        'Has difficulty bringing objects to their mouth',
        'Does not make vowel sounds',
        'Appears unusually floppy or stiff',
        'Cannot roll over in either direction',
        'Does not attempt to reach for nearby objects',
      ],
    },
  },
  // Add more age data as needed (3, 9, 12, 18 months, etc.)
};

// Category configuration
const categories = [
  {
    id: 'overall',
    title: 'Overall',
    icon: '📊',
    color: '#9575CD',
  },
  {
    id: 'socialEmotional',
    title: 'Social & Emotional',
    icon: '❤️',
    color: '#E91E63',
  },
  {
    id: 'brainDevelopment',
    title: 'Brain Development',
    icon: '🧠',
    color: '#2196F3',
  },
  {
    id: 'movementPhysical',
    title: 'Movement & Physical Development',
    icon: '🏃',
    color: '#4CAF50',
  },
  {
    id: 'foodNutrition',
    title: 'Food & Nutrition',
    icon: '🍎',
    color: '#FF9800',
  },
  {
    id: 'thingsToLookOutFor',
    title: 'Things for Parents to Look Out For',
    icon: '⚠️',
    color: '#F44336',
  },
];

const DevelopmentalStageTab = () => {
  const [childAge, setChildAge] = useState(null);
  const [childName, setChildName] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadChildData();
  }, []);

  const loadChildData = async () => {
    try {
      const age = await AsyncStorage.getItem(CHILD_AGE_KEY);
      const name = await AsyncStorage.getItem(CHILD_NAME_KEY);
      if (age) {
        const ageValue = parseInt(age, 10);
        // Age is stored in months
        setChildAge(ageValue);
      } else {
        // Default to 6 months for demo if no age is set
        setChildAge(6);
      }
      if (name) {
        setChildName(name);
      }
    } catch (error) {
      console.error('Error loading child data:', error);
      // Default to 6 months for demo
      setChildAge(6);
    }
  };

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
    setModalVisible(true);
  };

  const getAgeData = () => {
    // For demo, use 6 months if age is not available or not in data
    const age = childAge || 6;
    // Find the closest age in months (round down to nearest available milestone)
    // For now, we only have 6 months data, so default to that
    // In production, you'd have data for multiple ages and find the closest match
    if (developmentalData[age]) {
      return developmentalData[age];
    }
    // Find closest age milestone (round down)
    const availableAges = Object.keys(developmentalData).map(Number).sort((a, b) => a - b);
    const closestAge = availableAges.find(a => a <= age) || availableAges[0];
    return developmentalData[closestAge] || developmentalData[6];
  };

  const getCategoryData = (categoryId) => {
    const ageData = getAgeData();
    return ageData[categoryId];
  };

  const renderCategoryCard = (category) => {
    const isLongTitle = category.title.length > 20;
    return (
      <TouchableOpacity
        key={category.id}
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(category.id)}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '15' }]}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
        </View>
        <Text style={[styles.categoryTitle, isLongTitle && styles.categoryTitleSmall]}>
          {category.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderModalContent = () => {
    if (!selectedCategory) {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Loading...</Text>
        </View>
      );
    }

    const categoryData = getCategoryData(selectedCategory);
    const ageData = getAgeData();
    const category = categories.find((cat) => cat.id === selectedCategory);

    if (!categoryData) {
      return (
        <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Content Coming Soon</Text>
            <Text style={styles.modalDescription}>
              Detailed information for this category will be available soon.
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={[styles.modalIconContainer, { backgroundColor: category.color + '15' }]}>
              <Text style={styles.modalIcon}>{category.icon}</Text>
            </View>
            <Text style={styles.modalTitle}>{categoryData.title}</Text>
          </View>

          {/* Age Label */}
          <View style={styles.ageLabelContainer}>
            <Text style={styles.ageLabel}>{ageData.ageLabel}</Text>
          </View>

          {/* Subtitle if exists */}
          {categoryData.subtitle && (
            <Text style={styles.modalSubtitle}>{categoryData.subtitle}</Text>
          )}

          {/* Description for Overall */}
          {categoryData.description && (
            <Text style={styles.modalDescription}>{categoryData.description}</Text>
          )}

          {/* Milestones */}
          {categoryData.milestones && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Milestones:</Text>
              {categoryData.milestones.map((milestone, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{milestone}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tips */}
          {categoryData.tips && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tips for Parents:</Text>
              {categoryData.tips.map((tip, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Warnings for Things to Look Out For */}
          {categoryData.warnings && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{categoryData.subtitle}</Text>
              {categoryData.warnings.map((warning, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bulletWarning}>•</Text>
                  <Text style={styles.bulletTextWarning}>{warning}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const ageData = getAgeData();
  const displayAge = childAge || 6;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Developmental Stage</Text>
        <Text style={styles.headerSubtitle}>
          {childName ? `${childName}'s Development` : 'Your Child\'s Development'} - {ageData.ageLabel}
        </Text>
      </View>

      {/* Category Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoryGrid}>
          {categories.map((category) => renderCategoryCard(category))}
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContainer}>
                {/* Modal Header with Close Button */}
                <View style={styles.modalHeaderBar}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Modal Content */}
                {renderModalContent()}
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1BEE7',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 48) / 2, // 2 columns with padding
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
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
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 20,
  },
  categoryTitleSmall: {
    fontSize: 13,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: MODAL_HEIGHT,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E1BEE7',
    flexShrink: 0,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#9575CD',
    fontWeight: 'bold',
  },
  modalScrollView: {
    flex: 1,
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalIcon: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1,
  },
  ageLabelContainer: {
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  ageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9575CD',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  modalDescription: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 18,
    color: '#9575CD',
    marginRight: 12,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    flex: 1,
  },
  bulletWarning: {
    fontSize: 18,
    color: '#F44336',
    marginRight: 12,
    fontWeight: 'bold',
  },
  bulletTextWarning: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 22,
    flex: 1,
  },
});

export default DevelopmentalStageTab;
