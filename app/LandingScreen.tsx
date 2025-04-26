import { View, Text, Image } from 'react-native'
import React from 'react'
import Button from './components/Button'
import { router } from 'expo-router'



export default function landingScreen() {
    return (
        <View>
            <Image source={require('./../assets/images/login.png')}
                style={{
                    width: '100%',
                    height: 550
                }} />

            <View>
                <Text style={{ fontSize: 30, textAlign: 'center', fontWeight: 'bold', marginTop: 25, }}>Welcome to CampusVibes</Text>
                <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 15, marginLeft: 20, marginRight: 20 }}>All news and event updates in your Pocket. So, never miss an update from your College.</Text>

                <Button text="Get Started" onPress={() => router.push('/UserTypeSelection')} />

            </View>
        </View>


    )
}