import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Button from '../components/Button'
import { router } from 'expo-router'

export default function EmptyClub() {

    const btn = () => {
        console.log('Button Pressed')
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <Image source={require('./../../assets/images/no-club.png')} style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }} />
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>No Clubs Followed</Text>
            <Text style={{ fontSize: 16, color: 'gray', marginTop: 10 }}>Follow clubs to see their posts here</Text>

            <TouchableOpacity style={{ backgroundColor: 'green', marginTop: 30, width: '60%', height: 50, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => router.push('/clubs/ExploreClub')}>
                <Text style={{ display: 'flex', alignItems: 'center', fontSize: 17, color: 'white', }}>
                    Explore Clubs
                </Text>
            </TouchableOpacity>
        </View>
    )
}