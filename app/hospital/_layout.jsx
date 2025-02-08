import { View, Text } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from 'react';

export default function TabLayout() {
    const auth = getAuth();
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setAuthenticated(!!user); // Converts user to boolean
        });
    }, []);

    useEffect(() => {
        if (authenticated === false) {
            router.push('/login');
        }
    }, [authenticated]);

    if (authenticated === null) {
        return <View><Text>Loading...</Text></View>; // Display a loading message
  a  }

    if (authenticated === false) {
        return null; // Don't render anything if user is not authenticated
    }

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index" // Must match the file in the /app directory
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="data_up" // Ensure this file exists in /app
                options={{
                    tabBarLabel: 'Data',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="database" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile" // New tab (Ensure you have a profile.js in /app)
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
