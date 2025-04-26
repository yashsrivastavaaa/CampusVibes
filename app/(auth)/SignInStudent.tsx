import { View, Text, Image, ToastAndroid } from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import TextInputBox from '../components/TextInputBox'
import Button from '../components/Button';
import { db } from '@/config/db';
import { admin } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
import { Redirect, router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { student } from '@/config/schemaStudent';
import { db2 } from '@/config/db2';

export default function SignIn() {
    const [userName, setuserName] = useState<string | undefined>();
    const [password, setpassword] = useState<string | undefined>();
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const onBtnPress = async () => {
        if (!userName?.length && !password?.length) {
            ToastAndroid.show("Please Enter UserID and Password.", ToastAndroid.BOTTOM);
            return;
        }
        if (!userName?.length) {
            ToastAndroid.show("Please Enter UserID.", ToastAndroid.BOTTOM);
            return;
        }
        if (!password?.length) {
            ToastAndroid.show("Please Enter Password.", ToastAndroid.BOTTOM);
            return;
        }

        setLoading(true);

        const loginCheck = await db2.select().from(student).where(and(eq(student.username, userName), eq(student.password, password)));

        console.log(loginCheck[0]);
        setUser(loginCheck[0]);


        if (loginCheck.length > 0) {
            ToastAndroid.show("Success!", ToastAndroid.BOTTOM);
            setLoading(false);

            router.push('./../PlatformRouteStd/(tabs)/home');
        } else {
            ToastAndroid.show("ERROR", ToastAndroid.BOTTOM);
            setLoading(false);
        }

    }

    return (
        <View>
            <Text style={{ textAlign: 'center', marginTop: 80, fontSize: 30, fontWeight: 'bold' }}>Student Login</Text>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('./../../assets/images/studentAvatar.png')} style={{ width: 100, height: 100, marginTop: 50 }} />
            </View>

            <View >
                <Text style={{ marginLeft: 30, marginTop: 40 }}>UserID</Text>
                <TextInputBox label='UserID' onChangeText={(v) => setuserName(v)} />

                <Text style={{ marginLeft: 30, marginTop: 10 }}>Password</Text>
                <TextInputBox label='Password' password={true} onChangeText={(v) => setpassword(v)} />

                <Button text='Login' onPress={() => onBtnPress()} loading={loading} />
            </View>
        </View>
    )
}
