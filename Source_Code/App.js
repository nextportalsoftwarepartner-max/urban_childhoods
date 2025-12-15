import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from './contexts/UserContext';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import KidAvatarSpace from './screens/KidAvatarSpace';
import AvatarEdit from './screens/AvatarEdit';
import MenuLobby from './screens/MenuLobby';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="KidAvatarSpace" component={KidAvatarSpace} />
          <Stack.Screen name="AvatarEdit" component={AvatarEdit} />
          <Stack.Screen name="MenuLobby" component={MenuLobby} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

