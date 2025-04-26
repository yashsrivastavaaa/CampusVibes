import { View, Text, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import React, { useState, useEffect, useContext, Suspense } from 'react';
import { db } from '@/config/db';
import { admin } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { departmentSch } from '@/config/departmentSchema';
import { student } from '@/config/schemaStudent';


export default function profile() {

    const { user } = useContext(AuthContext);
    { console.log("USER :  ", user) };


    return (
        <View>

            <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginTop: 70 }}>
                Visitor Profile
            </Text>

            <View style={{ display: 'flex', alignItems: 'center', marginTop: 80 }}>
                <Image style={{ width: 200, height: 200 }} source={require('./../../../assets/images/studentAvatar.png')} />
                <Text style={{ marginTop: 20, fontSize: 20 }}>Username : {user.username}</Text>
                <Text style={{ fontSize: 20 }}>Name : {user.name}</Text>
                <Text style={{ fontSize: 20 }}>Visitor</Text>

                <TouchableOpacity style={{ backgroundColor: 'green', marginTop: 60, width: '80%', height: 50, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => router.push('/changePassword/changePasswordScreenVisitor')}>
                    <Text style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'white' }}>
                        Change Password
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: 'red', marginTop: 40, width: '80%', height: 50, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => {

                    ToastAndroid.show("Logged Out", ToastAndroid.BOTTOM);
                    router.replace('/LandingScreen')
                }}>
                    <Text style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'white' }}>
                        Logout
                    </Text>
                </TouchableOpacity >
            </View>
        </View >

    );
}
