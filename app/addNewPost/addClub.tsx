import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/config/CloudinaryConfig';
import { db5 } from '@/config/db5';
import { clubsSch } from '@/config/clubsSchema';
import { router, useRouter } from 'expo-router';

export default function AddClub() {
    const { user } = useContext(AuthContext);
    const route = useRouter();
    const [clubLogo, setClubLogo] = useState<string | undefined>();
    const [clubName, setClubName] = useState<string>('');
    const [about, setAbout] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const btnCreateClub = async () => {
        if (!clubName || !about) {
            alert("Please fill in all the fields");
            return;
        }

        let uploadLogoRes = '';

        setLoading(true);
        console.log(clubLogo);

        if (clubLogo) {
            const uploadLogo: any = await new Promise(async (resolve, reject) => {
                await upload(cld, {
                    file: clubLogo,
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

            uploadLogoRes = uploadLogo && uploadLogo?.url;
        }

        console.log("Upload Logo Res: ", uploadLogoRes);

        const saveInDB = async () => {
            try {
                const result = await db5.insert(clubsSch).values({
                    name: clubName,
                    club_logo: uploadLogoRes || '',
                    about: about,
                    createdon: new Date(),
                });
                setLoading(false);
                return result;
            } catch (e) {
                setLoading(false);
                console.log(e);
            }
        };

        const res = saveInDB();
        console.log(res);

        ToastAndroid.show("Club Created Successfully", ToastAndroid.BOTTOM);
        route.replace('/PlatformRoute/(tabs)/clubs');
    };

    const pickLogo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });

        if (!result.canceled) {
            setClubLogo(result.assets[0].uri);
        }
    };

    return (
        <View>
            <Text style={{ marginLeft: 20, marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>Club Logo</Text>
            <TouchableOpacity onPress={pickLogo} style={{ width: 50 }}>
                {clubLogo ? <Image source={{ uri: clubLogo }} style={{ height: 100, width: 100, marginLeft: 20, borderRadius: 20, marginTop: 20, borderWidth: 1 }} /> :
                    <Image source={require('../../assets/images/image.png')} style={{ height: 100, width: 100, marginLeft: 20, borderRadius: 20, marginTop: 20, borderWidth: 1 }} />}
            </TouchableOpacity>

            <TextInput
                style={{ height: 50, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'white', borderRadius: 20, paddingLeft: 15 }}
                placeholder='Enter club name...'
                onChangeText={(value) => setClubName(value)}
                value={clubName}
            />

            <TextInput
                multiline={true}
                numberOfLines={5}
                maxLength={1000}
                style={{ height: 140, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'white', textAlignVertical: 'top', padding: 15, borderRadius: 20 }}
                placeholder='Enter about the club...'
                onChangeText={(value) => setAbout(value)}
                value={about}
            />



            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                <TouchableOpacity onPress={btnCreateClub}>
                    <View style={{ width: 250, height: 50, backgroundColor: 'green', marginLeft: 50, marginRight: 50, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? <ActivityIndicator color={'white'} /> :
                            <Text style={{ color: 'white' }}>
                                Create Club
                            </Text>}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
