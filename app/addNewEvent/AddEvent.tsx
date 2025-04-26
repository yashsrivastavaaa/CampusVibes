import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '@/context/AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/config/CloudinaryConfig';
import { db7 } from '@/config/db7events';
import { postSch } from '@/config/postsSchema';
import { useRoute } from '@react-navigation/native';
import { router, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { events } from '@/config/events';



export default function AddEvent() {

    const [image, setImage] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [location, setlocation] = useState<string | null>();
    const [link, setlink] = useState<string | null>();
    const [name, setname] = useState<string | null>();
    const [time, settime] = useState('Select Time');
    const [date, setdate] = useState('Select Date');
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [isPublic, setIsPublic] = useState<string>("private");

    const onTimeChange = (event: any, selectedDate: any) => {
        setOpenTimePicker(false);
        settime(moment(selectedDate).format('hh:mm A'));
    }

    const onDateChange = (event: any, selectedDate: any) => {
        setOpenDatePicker(false);
        setdate(moment(selectedDate).format('MMMM  Do YYYY'));
    }

    const btnPost = async () => {

        if (!name) {
            alert("Please enter a event name");
            return;
        }
        if (!location) {
            alert("Please enter a event location");
            return;
        }

        if (time === 'Select Time') {
            alert("Please select a event time");
            return;
        }

        if (date === 'Select Date') {
            alert("Please select a event date");
            return;
        }

        if (!image) {
            alert("Please select a event poster");
            return;
        }


        let uploadImageRes = '';

        setLoading(true);
        console.log(image);

        if (image) {
            const uploadImage: any = await new Promise(async (resolve, reject) => {
                await upload(cld, {
                    file: image,
                    options: options,
                    callback: (err, res) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    }
                })
            });

            uploadImageRes = uploadImage && uploadImage?.url;
        }

        console.log("Upload Image Res : ", uploadImageRes);


        console.log("");
        console.log();
        console.log("Image URL : ", uploadImageRes);

        const t = { isPublic: isPublic ? 'public' : 'private' };

        const saveInDB = async () => {
            try {
                const result = await db7.insert(events).values({
                    name: name!,
                    location: location!,
                    link: link!,
                    date: date!,
                    time: time!,
                    type: isPublic!,
                    imageurl: uploadImageRes!,
                    createdon: new Date(),
                })
                setLoading(false);
                return result;
            }
            catch (e) {
                setLoading(false);
                console.log(e);
            }

        }

        const res = saveInDB();

        console.log(res);

        ToastAndroid.show("Posted Successfully", ToastAndroid.BOTTOM);

        router.replace('/PlatformRoute/(tabs)/event');

    }

    const ispublicbtn = () => {
        if (isPublic === "public") {
            setIsPublic("private");
        } else {
            setIsPublic("public");
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }

    };

    return (
        <View>
            <TouchableOpacity onPress={pickImage} style={{ width: 50 }}>
                {image ? <Image source={{ uri: image }} style={{ height: 100, width: 100, marginLeft: 20, borderRadius: 20, marginTop: 20, borderWidth: 1 }} /> : <Image source={require('../../assets/images/image.png')} style={{ height: 100, width: 100, marginLeft: 20, borderRadius: 20, marginTop: 20, borderWidth: 1 }} />}
            </TouchableOpacity>

            <Text style={{ marginLeft: 22, marginTop: 20, marginBottom: 5 }}>Event Name</Text>

            <TextInput multiline={true} maxLength={1000} style={{ height: 50, marginLeft: 20, marginRight: 20, backgroundColor: 'white', textAlignVertical: 'top', padding: 15, borderRadius: 20 }} placeholder='Event Name' onChangeText={(value) => {
                setname(value)
            }} />

            <Text style={{ marginLeft: 22, marginTop: 20, marginBottom: 5 }}>Event Location</Text>

            <TextInput multiline={true} maxLength={1000} style={{ height: 50, marginLeft: 20, marginRight: 20, backgroundColor: 'white', textAlignVertical: 'top', padding: 15, borderRadius: 20 }} placeholder='Event Location' onChangeText={(value) => {
                setlocation(value)
            }} />

            <Text style={{ marginLeft: 22, marginTop: 20, marginBottom: 5 }}>Link for Event Details</Text>

            <TextInput multiline={true} maxLength={1000} style={{ height: 50, marginLeft: 20, marginRight: 20, backgroundColor: 'white', textAlignVertical: 'top', padding: 15, borderRadius: 20 }} placeholder='Link for Event Details' onChangeText={(value) => {
                setlink(value)
            }} />


            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => setOpenTimePicker(!openTimePicker)} style={{ width: 150, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'white', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'green' }} >
                    <Text style={{ color: 'green' }}>
                        {time}
                    </Text>
                </TouchableOpacity>

                {openTimePicker && (
                    <RNDateTimePicker mode='time' value={new Date()} onChange={onTimeChange} />)}
            </View>



            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => setOpenDatePicker(!openDatePicker)} style={{ width: 150, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'white', padding: 15, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'green' }} >
                    <Text style={{ color: 'green' }}>
                        {date}
                    </Text>
                </TouchableOpacity>

                {openDatePicker && (
                    <RNDateTimePicker mode='date' value={new Date()} onChange={onDateChange} />)}
            </View>


            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {isPublic === "public" ? (
                    <TouchableOpacity
                        onPress={() => ispublicbtn()}
                        style={{
                            width: 150,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20,
                            backgroundColor: '#24f000',
                            padding: 15,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'green'
                        }}
                    >
                        <Text style={{ color: 'white' }}>Public</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => ispublicbtn()}
                        style={{
                            width: 150,
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20,
                            backgroundColor: 'white',
                            padding: 15,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: 'green'
                        }}
                    >
                        <Text style={{ color: 'green' }}>Public</Text>
                    </TouchableOpacity>
                )}
            </View>



            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>

                <TouchableOpacity onPress={btnPost} >
                    <View style={{ width: 250, height: 50, backgroundColor: 'green', marginLeft: 50, marginRight: 50, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? <ActivityIndicator color={'white'} /> :
                            <Text style={{ color: 'white' }}>
                                Post
                            </Text>}
                    </View>

                </TouchableOpacity>

            </View>
        </View >
    )
}