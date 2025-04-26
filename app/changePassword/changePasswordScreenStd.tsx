import { View, Text, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import TextInputBox from '../components/TextInputBox'
import { AuthContext } from '@/context/AuthContext';
import Button from '../components/Button';

import { and, eq } from 'drizzle-orm';
import { db2 } from '@/config/db2';
import { student } from '@/config/schemaStudent';
import { router } from 'expo-router';

export default function passwordChangeScreenStd() {

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

        const loginCheck = await db2.select().from(student).where(and(eq(student.username, user.username), eq(student.password, currentPassword)));

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

        const res = await db2.update(student).set({ password: newPassword! }).where(eq(student.username, user.username));


        alert("Password Changed Successfully.");
        setLoading(false);
        router.replace('/PlatformRouteStd/(tabs)/home');
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