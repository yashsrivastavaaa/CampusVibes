import { View, Text, Image, ToastAndroid, TouchableOpacity } from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import TextInputBox from '../components/TextInputBox'
import Button from '../components/Button';
import { db } from '@/config/db';
import { admin } from '@/config/schema';
import { and, eq } from 'drizzle-orm';
import { Redirect, router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { dbvisitor } from '@/config/visitrordb';
import { visitor } from '@/config/visitor';


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

        const loginCheck = await dbvisitor.select().from(visitor).where(and(eq(visitor.username, userName), eq(visitor.password, password)));

        console.log(loginCheck[0]);
        setUser(loginCheck[0]);

        if (loginCheck.length > 0) {
            ToastAndroid.show("Success!", ToastAndroid.BOTTOM);
            setLoading(false);

            router.replace('/visitor/(tabs)/home');
        } else {
            ToastAndroid.show("ERROR", ToastAndroid.BOTTOM);
            setLoading(false);
        }

    }

    return (
        <View>
            <Text style={{ textAlign: 'center', marginTop: 80, fontSize: 30, fontWeight: 'bold' }}>Visitor Login</Text>
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
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'row' }}>
                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 15, color: 'gray' }}>Do not have account? </Text>
                <TouchableOpacity onPress={() => router.replace('/signupvisitor')} ><Text style={{ marginTop: 20, color: 'blue' }}>SignUp</Text></TouchableOpacity>
            </View>
        </View>
    )
}
