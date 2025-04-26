import { View, Text, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import TextInputBox from '../components/TextInputBox'
import { AuthContext } from '@/context/AuthContext';
import Button from '../components/Button';

import { and, eq } from 'drizzle-orm';
import { router } from 'expo-router';
import { dbvisitor } from '@/config/visitrordb';
import { visitor } from '@/config/visitor';

export default function passwordChangeScreenVisttor() {

    const [currentPassword, setcurrentPassword] = useState<string | undefined>();
    const [newPassword, setnewPassword] = useState<string | undefined>();
    const [newPasswordRepeat, setnewPasswordRepeat] = useState<string | undefined>();
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const onBtnPress = async () => {
        if (!currentPassword?.length || !newPassword?.length || !newPasswordRepeat?.length) {
            alert("Please fill all fields");
            return;
        }

        if (newPassword != newPasswordRepeat) {
            alert("You did not re-type same password");
            return;
        }

        setLoading(true);

        const loginCheck = await dbvisitor.select().from(visitor).where(and(eq(visitor.username, user.username), eq(visitor.password, currentPassword)));

        if (loginCheck.length == 0) {
            alert("Wrong Password");
            setLoading(false);
            return;
        }

        if (currentPassword == newPassword) {
            alert("Current Password and New Password cannot be same.");
            setLoading(false);
            return;
        }

        const res = await dbvisitor.update(visitor).set({ password: newPassword! }).where(eq(visitor.username, user.username));


        alert("Password Changed Successfully.");
        setLoading(false);
        router.replace('/visitor/(tabs)/home');
        return;



    }
    return (
        <View>
            <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'center', paddingTop: 70 }}>Change Password</Text>

            <View >
                <Text style={{ marginLeft: 30, marginTop: 70 }}>Current Password</Text>
                <TextInputBox label='Current Password' password={true} onChangeText={(v) => setcurrentPassword(v)} />
                <Text style={{ marginLeft: 30, marginTop: 10 }}>New Password</Text>
                <TextInputBox label='New Password' password={true} onChangeText={(v) => setnewPassword(v)} />
                <Text style={{ marginLeft: 30, marginTop: 10 }}>Re-type new Password</Text>
                <TextInputBox label='Re-type new password' password={true} onChangeText={(v) => setnewPasswordRepeat(v)} />


                <Button text='Change Password' onPress={() => onBtnPress()} loading={loading} />
            </View>
        </View>
    )
}