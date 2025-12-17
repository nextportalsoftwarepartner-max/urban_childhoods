import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Storage key for child age
const CHILD_AGE_KEY = '@child_age';

// Helper function to open video in YouTube app/browser
const openVideoInYouTube = async (youtubeId) => {
  const cleanVideoId = youtubeId.split('/').pop().split('?')[0];
  const youtubeUrl = `https://www.youtube.com/watch?v=${cleanVideoId}`;
  
  try {
    // Try to open in YouTube app first
    const youtubeAppUrl = `vnd.youtube:${cleanVideoId}`;
    const canOpen = await Linking.canOpenURL(youtubeAppUrl);
    if (canOpen) {
      await Linking.openURL(youtubeAppUrl);
    } else {
      // Fallback to browser
      await WebBrowser.openBrowserAsync(youtubeUrl);
    }
  } catch (error) {
    console.error('Error opening YouTube:', error);
    // Final fallback to browser
    try {
      await WebBrowser.openBrowserAsync(youtubeUrl);
    } catch (browserError) {
      Alert.alert('Error', 'Unable to open video. Please try again.');
    }
  }
};

// Helper function to get YouTube embed HTML
const getYouTubeEmbedHTML = (youtubeId) => {
  // Clean the video ID (remove any URL parts if present)
  const cleanVideoId = youtubeId.split('/').pop().split('?')[0];
  
  // Use direct embed URL with all necessary parameters
  // The key is to use the standard YouTube embed URL that works when link is clicked
  const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=1&enablejsapi=1&mute=0&loop=0&iv_load_policy=3&cc_load_policy=0&fs=1&disablekb=0&origin=${encodeURIComponent('https://www.youtube.com')}`;
  
  // Create HTML that directly loads the embed (simulating what happens after clicking the link)
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #000;
            position: fixed;
            touch-action: none;
          }
          .container {
            position: relative;
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background-color: #000;
          }
          iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            background-color: #000;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <iframe
            id="youtube-player"
            src="${embedUrl}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            frameborder="0"
            webkitallowfullscreen
            mozallowfullscreen
            scrolling="no"
          ></iframe>
        </div>
      </body>
    </html>
  `;
};

// Sample weekly plan data (based on baby's age)
const getWeeklyPlan = (ageInMonths) => {
  // For demo, using 6-month-old activities
  // In production, this would vary based on age
  return [
    {
      day: 1,
      title: 'Sweet Touch with ME',
      category: 'Social & Emotional Development',
      totalTime: 30,
      activities: [
        { time: 10, description: 'Mummy & Daddy, Talk to me what\'s happening today.', videoId: 'zSsNjPHRb1U' },
        { time: 10, description: 'Play interactive games such as peek-a-boo.', videoId: 'VnNONCGtpKU' },
        { time: 10, description: 'Hug games cross-over with Mummy and Daddy.', videoId: 'VnNONCGtpKU' },
      ],
    },
    {
      day: 2,
      title: 'Make a MOVE',
      category: 'Movement & Physical Development',
      totalTime: 30,
      activities: [
        { time: 10, description: 'Tummy Time (Continue daily tummy time to strengthen neck, back, and core muscles needed for sitting and crawling)', videoId: '4otE7HxWKJg' },
        { time: 5, description: 'Supported Sitting (Practice sitting with support to build balance and core strength)', videoId: '4otE7HxWKJg' },
        { time: 10, description: 'Grasping & Transferring Objects (Offer safe, easy-to-hold toys to encourage reaching and hand-to-hand transfer)', videoId: '4otE7HxWKJg' },
        { time: 5, description: 'Weight Bearing (Allow the baby to push down on their legs while being securely supported)', videoId: '4otE7HxWKJg' },
      ],
    },
    {
      day: 3,
      title: 'Talk & Listen',
      category: 'Communication & Language Skills',
      totalTime: 30,
      activities: [
        { time: 10, description: 'Engage in "Conversations": Respond to babbling using real words to encourage turn-taking', videoId: 'VnNONCGtpKU' },
        { time: 10, description: 'Talk and Narrate: Describe daily activities and surroundings', videoId: 'VnNONCGtpKU' },
        { time: 10, description: 'Read Together: Use colorful board or cloth books and name objects', videoId: 'GhCHlpOdo48' },
      ],
    },
    {
      day: 4,
      title: 'Explore & Discover',
      category: 'Cognitive & Social Skills',
      totalTime: 30,
      activities: [
        { time: 10, description: 'Peek-a-Boo: Helps develop object permanence and social bonding', videoId: 'VnNONCGtpKU' },
        { time: 10, description: 'Mirror Play: Encourages self-awareness and facial recognition', videoId: '1uYOFJ3mPFM' },
        { time: 10, description: 'Explore Textures: Provide safe objects with different textures', videoId: '1uYOFJ3mPFM' },
      ],
    },
    {
      day: 5,
      title: 'Active Playtime',
      category: 'Movement & Physical Development',
      totalTime: 30,
      activities: [
        { time: 15, description: 'Rolling Practice: Encourage rolling in both directions', videoId: '4otE7HxWKJg' },
        { time: 10, description: 'Reaching Games: Place favorite toys nearby to encourage reaching', videoId: '4otE7HxWKJg' },
        { time: 5, description: 'Leg Exercises: Support baby in standing position to strengthen legs', videoId: '4otE7HxWKJg' },
      ],
    },
    {
      day: 6,
      title: 'Sensory Exploration',
      category: 'Cognitive & Social Skills',
      totalTime: 30,
      activities: [
        { time: 10, description: 'Sound Play: Use rattles and musical toys', videoId: '1uYOFJ3mPFM' },
        { time: 10, description: 'Visual Tracking: Move colorful objects slowly for baby to follow', videoId: '1uYOFJ3mPFM' },
        { time: 10, description: 'Touch & Feel: Introduce different textures and materials', videoId: '1uYOFJ3mPFM' },
      ],
    },
    {
      day: 7,
      title: 'Bonding & Relaxation',
      category: 'Social & Emotional Development',
      totalTime: 30,
      activities: [
        { time: 15, description: 'Sing Songs and Rhymes: Use action-based songs to promote rhythm and interaction', videoId: 'VnNONCGtpKU' },
        { time: 10, description: 'Gentle Massage: Calming touch to promote relaxation', videoId: 'VnNONCGtpKU' },
        { time: 5, description: 'Quiet Time: Read a story together in a calm environment', videoId: 'VnNONCGtpKU' },
      ],
    },
  ];
};

// Sample activities for FREE a Pick section
const freePickActivities = {
  'Physical & Motor Skills': [
    {
      id: 'p1',
      title: 'Tummy Time',
      description: 'Continue daily tummy time to strengthen neck, back, and core muscles needed for sitting and crawling',
    },
    {
      id: 'p2',
      title: 'Supported Sitting',
      description: 'Practice sitting with support to build balance and core strength',
    },
    {
      id: 'p3',
      title: 'Grasping & Transferring Objects',
      description: 'Offer safe, easy-to-hold toys to encourage reaching and hand-to-hand transfer',
    },
    {
      id: 'p4',
      title: 'Weight Bearing',
      description: 'Allow the baby to push down on their legs while being securely supported',
    },
  ],
  'Communication & Language Skills': [
    {
      id: 'c1',
      title: 'Engage in "Conversations"',
      description: 'Respond to babbling using real words to encourage turn-taking',
    },
    {
      id: 'c2',
      title: 'Talk and Narrate',
      description: 'Describe daily activities and surroundings',
    },
    {
      id: 'c3',
      title: 'Read Together',
      description: 'Use colorful board or cloth books and name objects',
    },
    {
      id: 'c4',
      title: 'Sing Songs and Rhymes',
      description: 'Use action-based songs to promote rhythm and interaction',
    },
  ],
  'Cognitive & Social Skills': [
    {
      id: 's1',
      title: 'Peek-a-Boo',
      description: 'Helps develop object permanence and social bonding',
    },
    {
      id: 's2',
      title: 'Mirror Play',
      description: 'Encourages self-awareness and facial recognition',
    },
    {
      id: 's3',
      title: 'Explore Textures',
      description: 'Provide safe objects with different textures',
    },
    {
      id: 's4',
      title: 'Introduce Solids and a Cup',
      description: 'Support early feeding skills when readiness signs appear',
    },
  ],
};

const LearningAdviceTab = () => {
  const [childAge, setChildAge] = useState(6); // Default to 6 months
  const [showPlanList, setShowPlanList] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedActivityIndex, setSelectedActivityIndex] = useState(null);
  const weeklyPlan = getWeeklyPlan(childAge);

  useEffect(() => {
    loadChildAge();
  }, []);

  const loadChildAge = async () => {
    try {
      const age = await AsyncStorage.getItem(CHILD_AGE_KEY);
      if (age) {
        setChildAge(parseInt(age, 10));
      }
    } catch (error) {
      console.error('Error loading child age:', error);
    }
  };

  const renderWeeklyPlan = () => {
    return (
      <View style={styles.planListContainer}>
        {/* Header with Exit Button */}
        <View style={styles.planListHeader}>
          <Text style={styles.planListTitle}>Weekly Activity Plan</Text>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => setShowPlanList(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.exitButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Plan Items */}
        <ScrollView
          style={styles.planScrollView}
          contentContainerStyle={styles.planScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {weeklyPlan.map((dayPlan) => (
            <View key={dayPlan.day} style={styles.dayPlanCard}>
              <View style={styles.dayPlanHeader}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Day {dayPlan.day}</Text>
                </View>
                <View style={styles.dayPlanInfo}>
                  <Text style={styles.dayPlanTitle}>{dayPlan.title}</Text>
                  <Text style={styles.dayPlanCategory}>{dayPlan.category}</Text>
                </View>
              </View>
              <View style={styles.totalTimeContainer}>
                <Text style={styles.totalTimeText}>Total of {dayPlan.totalTime} min</Text>
              </View>
              <View style={styles.activitiesContainer}>
                {dayPlan.activities.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <View style={styles.activityTimeBadge}>
                      <Text style={styles.activityTimeText}>{activity.time} min</Text>
                    </View>
                    <View style={styles.activityContent}>
                      <View style={styles.videoIconContainer}>
                        {activity.videoId && (
                          <TouchableOpacity
                            style={styles.videoIconButton}
                            onPress={() => {
                              setSelectedVideoId(activity.videoId);
                              setSelectedDay(dayPlan.day);
                              setSelectedActivityIndex(index + 1);
                              setVideoModalVisible(true);
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.videoIcon}>▶</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.activityDescription}>{activity.description}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFreePickActivities = () => {
    return (
      <View style={styles.freePickContainer}>
        <Text style={styles.freePickTitle}>FREE a Pick</Text>
        <Text style={styles.freePickSubtitle}>
          Choose activities you want your baby to do
        </Text>

        {Object.entries(freePickActivities).map(([category, activities]) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.activityBoxesContainer}>
              {activities.map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={styles.activityBox}
                  activeOpacity={0.7}
                >
                  <Text style={styles.activityBoxTitle}>{activity.title}</Text>
                  <Text style={styles.activityBoxDescription}>{activity.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Layer 1: PLAN For Baby Button */}
        <View style={styles.layer1}>
          <TouchableOpacity
            style={styles.planButton}
            onPress={() => setShowPlanList(true)}
            activeOpacity={0.8}
          >
            <View style={styles.planButtonContent}>
              <Text style={styles.planButtonEmoji}>📋</Text>
              <View style={styles.planButtonTextContainer}>
                <Text style={styles.planButtonLabel}>PLAN For Baby</Text>
                <Text style={styles.planButtonDescription}>
                  Feeling lost, Super Mummy/Daddy? Don't worry, we've got your back! Let's make parenting fun and easy! 😊
                </Text>
              </View>
              <Text style={styles.planButtonArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider Line for Layer 2 */}
        {showPlanList && <View style={styles.divider} />}

        {/* Layer 2: Plan List (shown when button is clicked) */}
        {showPlanList && renderWeeklyPlan()}

        {/* Divider Line for Layer 3 */}
        {!showPlanList && <View style={styles.divider} />}

        {/* Layer 3: FREE a Pick */}
        {!showPlanList && renderFreePickActivities()}
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={videoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVideoModalVisible(false)}>
          <View style={styles.videoModalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.videoModalContent}>
                <View style={styles.videoModalHeader}>
                  <Text style={styles.videoModalTitle}>
                    {selectedDay && selectedActivityIndex 
                      ? `Day ${selectedDay} - Activity ${selectedActivityIndex}`
                      : 'Video Guide'}
                  </Text>
                  <TouchableOpacity
                    style={styles.videoModalCloseButton}
                    onPress={() => setVideoModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.videoModalCloseText}>✕</Text>
                  </TouchableOpacity>
                </View>
                {selectedVideoId && (() => {
                  const cleanVideoId = selectedVideoId.split('/').pop().split('?')[0];
                  // Use the watch URL directly (like clicking the link does)
                  const watchUrl = `https://www.youtube.com/watch?v=${cleanVideoId}&autoplay=1&mute=0`;
                  
                  return (
                    <View style={styles.videoContainer}>
                      <WebView
                        source={{ uri: watchUrl }}
                        style={styles.videoWebView}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                        originWhitelist={['*']}
                        mixedContentMode="always"
                        allowsInlineMediaPlayback={true}
                        bounces={false}
                        scrollEnabled={false}
                        onShouldStartLoadWithRequest={(request) => {
                          // Allow YouTube domain and embed redirects
                          return request.url.includes('youtube.com') || request.url.includes('youtube-nocookie.com');
                        }}
                      />
                    </View>
                  );
                })()}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  // Layer 1 Styles
  layer1: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#E1BEE7',
    marginVertical: 16,
    marginHorizontal: 4,
  },
  planButton: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#66BB6A',
    shadowColor: '#66BB6A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  planButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planButtonEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  planButtonTextContainer: {
    flex: 1,
  },
  planButtonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  planButtonDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  planButtonArrow: {
    fontSize: 32,
    color: '#66BB6A',
    fontWeight: 'bold',
  },
  // Layer 2 Styles - Plan List
  planListContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
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
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  planListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E1BEE7',
  },
  planListTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    fontSize: 20,
    color: '#9575CD',
    fontWeight: 'bold',
  },
  planScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  planScrollContent: {
    paddingBottom: 10,
  },
  dayPlanCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  dayPlanHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: '#9575CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
  },
  dayBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayPlanInfo: {
    flex: 1,
  },
  dayPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  dayPlanCategory: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  totalTimeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  totalTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9575CD',
  },
  activitiesContainer: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  activityTimeBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E1BEE7',
    flexShrink: 0,
  },
  activityTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9575CD',
    textAlign: 'center',
  },
  activityContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  videoIconContainer: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexShrink: 0,
    paddingTop: 2,
  },
  videoIconButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#66BB6A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 2,
  },
  descriptionContainer: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  activityDescription: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
  },
  // Layer 3 Styles - FREE a Pick
  freePickContainer: {
    marginTop: 8,
  },
  freePickTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  freePickSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#9575CD',
    marginBottom: 16,
  },
  activityBoxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityBox: {
    width: (SCREEN_WIDTH - 48) / 2 - 8, // 2 columns with gap
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1BEE7',
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
  },
  activityBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  activityBoxDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  // Video Modal Styles
  videoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  videoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: '#F5F3FF',
    borderBottomWidth: 1,
    borderBottomColor: '#E1BEE7',
  },
  videoModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  videoModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoModalCloseText: {
    fontSize: 22,
    color: '#D32F2F',
    fontWeight: '900',
    lineHeight: 22,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  videoWebView: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
});

export default LearningAdviceTab;
