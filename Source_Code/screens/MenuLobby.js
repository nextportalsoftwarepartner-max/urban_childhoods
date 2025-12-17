import React from 'react';
import { Text, StyleSheet, ScrollView, TouchableOpacity, View, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from './tabs/HomeTab';
import DevelopmentalStageTab from './tabs/DevelopmentalStageTab';
import LearningAdviceTab from './tabs/LearningAdviceTab';
import NutritionAdviceTab from './tabs/NutritionAdviceTab';
import WhatsNextTab from './tabs/WhatsNextTab';
import MeTab from './tabs/MeTab';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = SCREEN_WIDTH / 4; // Show 4 tabs at a time

// Custom Scrollable Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const scrollViewRef = React.useRef(null);
  const [showRightIndicator, setShowRightIndicator] = React.useState(true);
  const [scrollX, setScrollX] = React.useState(0);
  
  const totalWidth = TAB_WIDTH * state.routes.length;
  const visibleWidth = SCREEN_WIDTH;

  // Check if we can scroll right
  const checkScrollPosition = (contentOffset) => {
    const maxScroll = totalWidth - visibleWidth;
    setShowRightIndicator(contentOffset.x < maxScroll - 10); // 10px threshold
  };

  // Scroll to active tab when it changes
  React.useEffect(() => {
    if (scrollViewRef.current && state.index >= 4) {
      // Scroll to show tabs 5 and 6 when selected
      const offset = (state.index - 3) * TAB_WIDTH;
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
      checkScrollPosition({ x: offset });
    } else if (scrollViewRef.current && state.index < 2) {
      // Scroll back to start when selecting first tabs
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
      checkScrollPosition({ x: 0 });
    }
  }, [state.index]);

  // Initialize: show indicator if there are more than 4 tabs
  React.useEffect(() => {
    if (state.routes.length > 4) {
      setShowRightIndicator(true);
    }
  }, []);

  return (
    <View style={customTabBarStyles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={customTabBarStyles.scrollContent}
        style={customTabBarStyles.scrollView}
        onScroll={(event) => {
          const contentOffset = event.nativeEvent.contentOffset;
          setScrollX(contentOffset.x);
          checkScrollPosition(contentOffset);
        }}
        scrollEventThrottle={16}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const IconComponent = options.tabBarIcon;
          const iconColor = isFocused ? '#9575CD' : '#999';
          const labelColor = isFocused ? '#9575CD' : '#999';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={customTabBarStyles.tabItem}
              activeOpacity={0.7}
            >
              <View style={customTabBarStyles.iconContainer}>
                {IconComponent && <IconComponent focused={isFocused} color={iconColor} />}
              </View>
              <Text style={[customTabBarStyles.label, { color: labelColor }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {/* Right fade indicator */}
      {showRightIndicator && (
        <View style={customTabBarStyles.rightIndicator} pointerEvents="none">
          <View style={customTabBarStyles.indicatorBackground}>
            <Text style={customTabBarStyles.moreText}>More</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const MenuLobby = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeTab}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon emoji="🏠" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="DevelopmentalStage" 
        component={DevelopmentalStageTab}
        options={{
          tabBarLabel: 'Developmental',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon emoji="📈" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Learning" 
        component={LearningAdviceTab}
        options={{
          tabBarLabel: 'Let\'s Do It',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon emoji="🎯" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Nutrition" 
        component={NutritionAdviceTab}
        options={{
          tabBarLabel: 'Nutrition',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon emoji="🥗" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="WhatsNext" 
        component={WhatsNextTab}
        options={{
          tabBarLabel: 'What\'s Next',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon emoji="🔮" focused={focused} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Me" 
        component={MeTab}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon emoji="👤" focused={focused} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Custom Tab Bar Icon Component
const TabBarIcon = ({ emoji, focused }) => {
  return (
    <Text style={[iconStyles.tabIcon, focused && iconStyles.tabIconFocused]}>
      {emoji}
    </Text>
  );
};

const iconStyles = StyleSheet.create({
  tabIcon: {
    fontSize: 32,
    opacity: 0.7,
  },
  tabIconFocused: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
});

const customTabBarStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1BEE7',
    height: 100,
    paddingBottom: 30,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#B39DDB',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  tabItem: {
    width: TAB_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  rightIndicator: {
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 30,
    width: 40,
    pointerEvents: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorBackground: {
    width: 40,
    height: '100%',
    backgroundColor: 'rgba(149, 117, 205, 0.5)', // Purple with 50% opacity (#9575CD)
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    transform: [{ rotate: '90deg' }], // Rotate to vertical
    letterSpacing: 2,
  },
});

export default MenuLobby;

