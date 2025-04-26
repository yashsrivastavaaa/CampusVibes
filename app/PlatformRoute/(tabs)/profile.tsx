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
    const [department, setDepartment] = useState(null);

    useEffect(() => {
        const fetchDepartment = async () => {
            if (user) {
                const result = await db.select().from(departmentSch)
                    .fullJoin(student, eq(student.dept_id, departmentSch.dept_id))
                    .where(eq(user.dept_id, departmentSch.dept_id));

                if (result && result.length > 0) {
                    //@ts-ignore
                    setDepartment(result[0].department?.name);
                    console.log("Department: ", result[0].department?.name);
                }
            }
        };

        fetchDepartment();
    }, [user]);



    return (
        <View>

            <Text style={{ fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginTop: 70 }}>
                Student Profile
            </Text>

            <View style={{ display: 'flex', alignItems: 'center', marginTop: 80 }}>
                <Image style={{ width: 200, height: 200 }} source={require('./../../../assets/images/studentAvatar.png')} />
                <Text style={{ marginTop: 20, fontSize: 20 }}>Username : {user.username}</Text>
                <Text style={{ fontSize: 20 }}>Name : {user.name}</Text>
                <Text style={{ fontSize: 20 }}>Email ID : {user?.email}</Text>
                <Text style={{ fontSize: 20 }}>Designation : Club Admin</Text>

                <TouchableOpacity style={{ backgroundColor: 'green', marginTop: 60, width: '80%', height: 50, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onPress={() => router.push('/changePassword/passwordChangeScreen')}>
                    <Text style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'white' }}>
                        Change Password
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: 'red', marginTop: 40, width: '80%', height: 50, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', }} onPress={() => {

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
