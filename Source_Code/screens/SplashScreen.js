import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Play video
    if (videoRef.current) {
      videoRef.current.playAsync();
    }

    // Navigate to login after video duration (3 seconds)
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (videoRef.current) {
        videoRef.current.unloadAsync();
      }
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Video Logo - Full Screen */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require('../assets/SplashScreenLogo.mp4')}
          style={styles.video}
          resizeMode="contain"
          shouldPlay={true}
          isLooping={false}
          isMuted={true}
          onError={(error) => {
            console.error('Video error:', error);
            // Navigate to login if video fails to load
            setTimeout(() => {
              navigation.replace('Login');
            }, 1000);
          }}
          onLoad={() => {
            console.log('Video loaded successfully');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BF342D', // Background Red: Hex #BF342D
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width * 1.0, // 100% of screen width (80% * 1.25 = 100%)
    height: height * 0.75, // 75% of screen height (60% * 1.25 = 75%)
  },
});

export default SplashScreen;
