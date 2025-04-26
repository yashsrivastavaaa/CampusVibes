import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import { EvilIcons, Ionicons } from '@expo/vector-icons';


export default function _layout() {
    return (
        <Tabs screenOptions={{ headerShown: false, headerTitle: '' }}>

            <Tabs.Screen name='home' options={{ tabBarIcon: ({ color, size }) => <AntDesign name="home" size={24} color="black" />, title: 'Home' }} />
            <Tabs.Screen name='events' options={{ tabBarIcon: ({ color, size }) => <AntDesign name="calendar" size={24} color="black" />, title: 'Events' }} />
            <Tabs.Screen name='profile' options={{ tabBarIcon: ({ color, size }) => <AntDesign name="user" size={24} color="black" />, title: 'Profile' }} />

        </Tabs>
    )
}