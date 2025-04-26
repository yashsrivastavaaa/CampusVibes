import { AuthContext } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface USER {
  username: string;
  name: string;
  password: string;
  email: string;
}

export default function RootLayout() {
  const [user, setUser] = useState<USER | undefined>(undefined);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Stack>
        <Stack.Screen
          name="UserTypeSelection"
          options={({ navigation }) => ({
            headerTransparent: true,
            headerTitle: '',
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('LandingScreen')}>
                {/* Back icon (or text) */}
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name='(auth)/signupvisitor'
          options={{ headerTransparent: true, headerTitle: '' }} />
        <Stack.Screen name='addNewEvent/AddEvent'
          options={{ headerTitle: 'Add new event' }} />
        <Stack.Screen name='(auth)/signinvisitor'
          options={{ headerTransparent: true, headerTitle: '' }} />

        <Stack.Screen name='event/ViewRegistered'
          options={{ headerTransparent: true, headerTitle: '' }} />

        <Stack.Screen name='LandingScreen'
          options={{ headerShown: false }} />
        <Stack.Screen name='PlatformRoute/(tabs)'
          options={{ headerShown: false, headerTitle: '' }} />

        <Stack.Screen name='visitor/(tabs)'
          options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name='PlatformRouteStd/(tabs)'
          options={{ headerShown: false, headerTitle: '' }} />

        <Stack.Screen name='changePassword/passwordChangeScreen'
          options={{ headerTransparent: true, headerTitle: '' }} />
        <Stack.Screen name='changePassword/changePasswordScreenVisitor'
          options={{ headerTransparent: true, headerTitle: '' }} />
        <Stack.Screen name='changePassword/changePasswordScreenStd'
          options={{ headerTransparent: true, headerTitle: '' }} />



        <Stack.Screen name='(auth)/SignInAdmin'
          options={{ headerTransparent: true, headerTitle: '' }} />

        <Stack.Screen name='visitor/ui'
          options={{ headerShown: false }} />

        <Stack.Screen name='(auth)/SignInStudent'
          options={{ headerTransparent: true, headerTitle: '' }} />


        <Stack.Screen name='addNewPost/addPost'
          options={{ headerTitle: 'Add New Post' }} />
        <Stack.Screen name='addNewPost/addClub'
          options={{ headerTitle: 'Add New Club' }} />

        <Stack.Screen name='clubs/ViewStudents'
          options={{ headerTitle: 'View Students' }} />

        <Stack.Screen name='editEvent/UpdateEvent'
          options={{ headerTitle: 'Update Event' }} />

        <Stack.Screen name='AddAdminScreen'
          options={{ headerTransparent: true, headerTitle: '' }} />


        <Stack.Screen name='(tabs)'
          options={{ headerShown: false, headerTitle: '' }} />

        <Stack.Screen name='AdminHome'
          options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name='PlatformRouteStd/(tabs)/profile'
          options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name='PlatformRouteStd/(tabs)/home'
          options={{ headerShown: false, headerTitle: '' }} />
        <Stack.Screen name='PlatformRouteStd/(tabs)/clubs'
          options={{ headerTitle: 'Clubs' }} />
        <Stack.Screen name='PlatformRouteStd/(tabs)/event'
          options={{ headerShown: false, headerTitle: '' }} />
      </Stack>
    </AuthContext.Provider>
  )
}
