import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/config/CloudinaryConfig';
import { db5 } from '@/config/db5';
import { clubsSch } from '@/config/clubsSchema';
import { eq } from 'drizzle-orm';
import { db4 } from '@/config/db4';
import { postSch } from '@/config/postsSchema';
import { db6 } from '@/config/db6';
import { followerSch } from '@/config/followerSch';

export default function UpdateClub() {
    const { user } = useContext(AuthContext);
    const { clubId, name, about: aboutParam, club_img } = useLocalSearchParams<{
        clubId: string;
        name: string;
        about: string;
        club_img: string;
    }>();

    const [clubName, setClubName] = useState(name || '');
    const [about, setAbout] = useState(aboutParam || '');
    const [clubLogo, setClubLogo] = useState<string | undefined>(club_img);
    const [newLogoSelected, setNewLogoSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    const pickLogo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 0.5,
        });

        if (!result.canceled) {
            setClubLogo(result.assets[0].uri);
            setNewLogoSelected(true);
        }
    };

    const handleUpdateClub = async () => {
        if (!clubName || !about) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);
        let logoUrl = clubLogo;

        if (newLogoSelected && clubLogo) {
            try {
                const uploadLogo: any = await new Promise(async (resolve, reject) => {
                    await upload(cld, {
                        file: clubLogo,
                        options: options,
                        callback: (err, res) => {
                            if (err) reject(err);
                            else resolve(res);
                        }
                    });
                });

                logoUrl = uploadLogo?.url || clubLogo;
            } catch (e) {
                console.error("Logo upload failed:", e);
                alert("Failed to upload new logo.");
                setLoading(false);
                return;
            }
        }

        try {
            console.log();
            console.log(); console.log(); console.log(); console.log(); console.log();
            console.log(clubName);
            console.log(clubId)
            await db5.update(clubsSch)
                .set({
                    name: clubName,
                    about: about,
                    club_logo: logoUrl,
                })
                .where(eq(clubsSch.name, clubId));

            await db4.update(postSch).set({
                visiblein: clubName
            }).where(eq(postSch.visiblein, clubId))

            await db6.update(followerSch).set({
                club_id: clubName
            }).where(eq(followerSch.club_id, clubId))

            ToastAndroid.show("Club updated successfully!", ToastAndroid.BOTTOM);
            router.replace('/PlatformRoute/(tabs)/clubs');
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update the club.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text style={{ marginLeft: 20, marginTop: 20, fontSize: 20, fontWeight: 'bold' }}>Club Logo</Text>
            <TouchableOpacity onPress={pickLogo}>
                <Image
                    source={clubLogo ? { uri: clubLogo } : require('../../assets/images/image.png')}
                    style={{
                        height: 100,
                        width: 100,
                        marginLeft: 20,
                        borderRadius: 20,
                        marginTop: 20,
                        borderWidth: 1,
                    }}
                />
            </TouchableOpacity>

            <TextInput
                style={{
                    height: 50,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    paddingLeft: 15,
                }}
                placeholder='Enter club name...'
                onChangeText={(value) => setClubName(value)}
                value={clubName}
            />

            <TextInput
                multiline
                numberOfLines={5}
                maxLength={1000}
                style={{
                    height: 140,
                    marginLeft: 20,
                    marginRight: 20,
                    marginTop: 20,
                    backgroundColor: 'white',
                    textAlignVertical: 'top',
                    padding: 15,
                    borderRadius: 20,
                }}
                placeholder='Enter about the club...'
                onChangeText={(value) => setAbout(value)}
                value={about}
            />

            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                <TouchableOpacity onPress={handleUpdateClub}>
                    <View
                        style={{
                            width: 250,
                            height: 50,
                            backgroundColor: 'orange',
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {loading ? <ActivityIndicator color={'white'} /> :
                            <Text style={{ color: 'white' }}>Update Club</Text>}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
