import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import TextInputBox from '../components/TextInputBox';
import { router } from 'expo-router';
import { dbvisitor } from '@/config/visitrordb';
import { visitor } from '@/config/visitor';
import { eq } from 'drizzle-orm';
export default function signupvisitor() {

    const [userName, setuserName] = useState<string | undefined>();
    const [Name, setName] = useState<string | undefined>();
    const [password, setpassword] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const btnClick = async () => {
        if (!Name?.length) {
            alert("Please enter your name");
            return;
        }

        if (!userName?.length) {
            alert("Please enter your userID");
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(userName)) {
            alert("UserID can only contain letters, numbers, and underscores.");
            return;
        }

        if (!password?.length) {
            alert("Please enter your password");
            return;
        }

        const passwordRegex = /^\S+$/;
        if (!passwordRegex.test(password)) {
            alert("Password cannot contain spaces.");
            return;
        }

        setLoading(true);

        try {
            const x = await dbvisitor.select().from(visitor).where(eq(visitor.username, userName));

            if (x.length) {
                alert("UserID already exists. Please try another UserID.");
                setLoading(false);
                return;
            }

            const result = await dbvisitor.insert(visitor).values({
                username: userName,
                name: Name,
                password: password
            });

            console.log(result);
            alert("User Created Successfully. Please Login to continue.");
            router.replace('/signinvisitor');
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <View>
            <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 30, fontWeight: 'bold' }}>Visitor Sign Up</Text>

            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/images/studentAvatar.png')} style={{ width: 100, height: 100, marginTop: 50 }} />
            </View>

            <View >
                <Text style={{ marginLeft: 30, marginTop: 40 }}>Name</Text>
                <TextInputBox label='Name' onChangeText={(v) => setName(v)} />

                <Text style={{ marginLeft: 30, marginTop: 10 }}>UserID</Text>
                <TextInputBox label='UserID' onChangeText={(v) => setuserName(v)} />


                <Text style={{ marginLeft: 30, marginTop: 10 }}>Password</Text>
                <TextInputBox label='Password' password={true} onChangeText={(v) => setpassword(v)} />

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={{ backgroundColor: 'green', marginTop: 20, width: '80%', height: 50, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={btnClick}>

                        {loading ? <ActivityIndicator color={'white'} /> :
                            <Text style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'white' }}>
                                Sign Up
                            </Text>
                        }
                    </TouchableOpacity>
                </View>

                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10, flexDirection: 'row' }}>
                    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 15, color: 'gray' }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/signinvisitor')} ><Text style={{ marginTop: 20, color: 'blue' }}>Login</Text></TouchableOpacity>
                </View>


            </View>
        </View>
    )
}