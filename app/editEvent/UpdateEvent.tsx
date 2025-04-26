import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { db7 } from '@/config/db7events';
import { events } from '@/config/events';
import { sql } from 'drizzle-orm';
import * as ImagePicker from 'expo-image-picker';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/config/CloudinaryConfig';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';

export default function UpdateEvent() {
    const router = useRouter();
    const route = useRoute();

    const { id, imageurl, name, location, link, date, time, type } = route.params as {
        id: string;
        imageurl: string;
        name: string;
        location: string;
        link: string;
        date: string;
        time: string;
        type: string;
    };

    const [image, setImage] = useState<string | undefined>(imageurl);
    const [loading, setLoading] = useState(false);
    const [nameState, setName] = useState<string>(name);
    const [locationState, setLocation] = useState<string>(location);
    const [linkState, setLink] = useState<string>(link);
    const [dateState, setDate] = useState<string>(date || 'Select Date');
    const [timeState, setTime] = useState<string>(time || 'Select Time');
    const [isPublic, setIsPublic] = useState<string>(type || 'private');
    const [openTimePicker, setOpenTimePicker] = useState(false);
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const [imageLoading, setImageLoading] = useState(false); // State for image loading

    // Date & Time Picker Handlers
    const onTimeChange = (event: any, selectedDate: any) => {
        setOpenTimePicker(false);
        setTime(moment(selectedDate).format('hh:mm A'));
    };

    const onDateChange = (event: any, selectedDate: any) => {
        setOpenDatePicker(false);
        setDate(moment(selectedDate).format('MMMM Do YYYY'));
    };

    const btnUpdateEvent = async () => {
        if (!nameState) {
            alert("Please enter an event name");
            return;
        }
        if (!locationState) {
            alert("Please enter an event location");
            return;
        }
        if (timeState === 'Select Time') {
            alert("Please select an event time");
            return;
        }
        if (dateState === 'Select Date') {
            alert("Please select an event date");
            return;
        }

        let uploadImageRes = '';

        setLoading(true);

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

            uploadImageRes = uploadImage?.url;
        }

        const saveInDB = async () => {
            try {
                await db7.update(events)
                    .set({
                        name: nameState,
                        location: locationState,
                        link: linkState,
                        date: dateState,
                        time: timeState,
                        type: isPublic,
                        imageurl: uploadImageRes,
                    })
                    .where(sql`${events.id} = ${Number(id)}`);

                ToastAndroid.show("Event Updated Successfully", ToastAndroid.BOTTOM);
                setLoading(false);
                router.push('/PlatformRoute/(tabs)/event');
            } catch (e) {
                setLoading(false);
                console.error(e);
            }
        };

        saveInDB();
    };

    const togglePublicPrivate = () => {
        setIsPublic(isPublic === "public" ? "private" : "public");
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImageLoading(true);
            setImage(result.assets[0].uri);
            setImageLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={pickImage} style={{ width: 50 }}>
                {imageLoading || !image ? (
                    <View
                        style={{
                            height: 100,
                            width: 100,
                            backgroundColor: '#D3D3D3',
                            borderRadius: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >

                        {imageLoading && <ActivityIndicator color="white" />}
                    </View>
                ) : (
                    <Image
                        source={{ uri: image }}
                        style={{
                            height: 100,
                            width: 100,
                            borderRadius: 20,
                        }}
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                )}
            </TouchableOpacity>

            <TextInput
                value={nameState}
                onChangeText={setName}
                placeholder="Event Name"
                style={{ height: 50, borderRadius: 20, marginTop: 20, padding: 15, backgroundColor: 'white' }}
            />

            <TextInput
                value={locationState}
                onChangeText={setLocation}
                placeholder="Event Location"
                style={{ height: 50, borderRadius: 20, marginTop: 20, padding: 15, backgroundColor: 'white' }}
            />

            <TextInput
                value={linkState}
                onChangeText={setLink}
                placeholder="Link for Event Details"
                style={{ height: 50, borderRadius: 20, marginTop: 20, padding: 15, backgroundColor: 'white' }}
            />


            <TouchableOpacity onPress={() => setOpenTimePicker(!openTimePicker)} style={{ marginTop: 20 }}>
                <Text style={{ padding: 15, backgroundColor: 'white', borderRadius: 20, textAlign: 'center' }}>
                    {timeState}
                </Text>
            </TouchableOpacity>
            {openTimePicker && <RNDateTimePicker mode="time" value={new Date()} onChange={onTimeChange} />}

            <TouchableOpacity onPress={() => setOpenDatePicker(!openDatePicker)} style={{ marginTop: 20 }}>
                <Text style={{ padding: 15, backgroundColor: 'white', borderRadius: 20, textAlign: 'center' }}>
                    {dateState}
                </Text>
            </TouchableOpacity>
            {openDatePicker && <RNDateTimePicker mode="date" value={new Date()} onChange={onDateChange} />}

            <TouchableOpacity onPress={togglePublicPrivate} style={{ marginTop: 20 }}>
                <Text style={{
                    padding: 15,
                    backgroundColor: isPublic === 'public' ? '#24f000' : 'white',
                    borderRadius: 20,
                    textAlign: 'center',
                    color: isPublic === 'public' ? 'white' : 'green'
                }}>
                    {isPublic === 'public' ? 'Public' : 'Private'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={btnUpdateEvent} style={{ marginTop: 40 }}>
                <View style={{
                    backgroundColor: 'green',
                    paddingVertical: 15,
                    borderRadius: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white' }}>Update Event</Text>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
}
