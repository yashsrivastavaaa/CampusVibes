import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

export default function UserTypeSelection() {
    return (
        <View>
            <Text style={{ textAlign: 'center', marginTop: 70, fontSize: 40, fontWeight: 'bold' }}>Choose Your Role Below</Text>

            <TouchableOpacity style={{
                flexDirection: 'row', alignItems: 'center', width: '85%', justifyContent: 'center', marginTop: 80, backgroundColor: 'white', margin: 30, borderRadius: 50, shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 10,
            }} onPress={() => router.push('/(auth)/SignInAdmin')}>

                <Image
                    style={{ width: 100, height: 100, marginRight: 15 }}
                    source={require('./../assets/images/adminAvatar.png')}
                />
                <Text style={{ fontSize: 15 }}>Club Admin</Text>
            </TouchableOpacity>


            <TouchableOpacity style={{
                flexDirection: 'row', alignItems: 'center', width: '85%', justifyContent: 'center', marginTop: 20, backgroundColor: 'white', margin: 30, borderRadius: 50, shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 10,
            }} onPress={() => router.push('/(auth)/SignInStudent')}>
                <Image
                    style={{ width: 100, height: 100, marginRight: 15 }}
                    source={require('./../assets/images/studentAvatar.png')}
                />
                <Text style={{ fontSize: 15 }}>Student</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
                flexDirection: 'row', width: '85%', height: 100, alignItems: 'center', justifyContent: 'center', marginTop: 20, backgroundColor: 'white', margin: 30, borderRadius: 50, shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 10,
            }}
                onPress={() => router.push('/(auth)/signinvisitor')}

            >
                <Image
                    style={{ alignItems: 'center', width: 80, height: 80, marginRight: 15 }}
                    source={require('./../assets/images/visitor.png')}
                />
                <Text style={{ fontSize: 15 }}>Visitor</Text>
            </TouchableOpacity>

        </View >
    )
}