import { View, Text, Image, TextInput, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/config/CloudinaryConfig';
import { db4 } from '@/config/db4';
import { postSch } from '@/config/postsSchema';
import { useRouter } from 'expo-router';
import { clubsSch } from '@/config/clubsSchema';
import { eq, not } from 'drizzle-orm';

export default function AddPost() {
    const { user } = useContext(AuthContext);
    const route = useRouter();


    const [item, setItems] = useState<{ label: string, value: string }[]>([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | null>(null);
    const [image, setImage] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState<string | null>();

    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const result = await db4.select().from(clubsSch).where(not(eq(clubsSch.name, 'public')));
                const clubs = result.map(club => ({
                    label: club.name,
                    value: club.name,
                }));

                setItems([{ label: 'public', value: 'public' }, ...clubs]);
            } catch (error) {
                console.error('Error fetching clubs:', error);
            }
        };

        fetchClubs();
    }, []);

    const btnPost = async () => {
        if (!content) {
            alert("Please enter a post content");
            return;
        }

        const postVisibility = value || 'public';

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
                });
            });

            uploadImageRes = uploadImage && uploadImage?.url;
        }

        console.log("Upload Image Res : ", uploadImageRes);

        console.log(user?.username!);

        const saveInDB = async () => {
            try {
                const result = await db4.insert(postSch).values({
                    content: content!,
                    image_url: uploadImageRes!,
                    visiblein: postVisibility!,
                    createdon: new Date(),
                    createdby: user?.username!,
                    name: user?.name!,
                });
                setLoading(false);
                return result;
            } catch (e) {
                setLoading(false);
                console.log(e);
            }
        };

        const res = await saveInDB();
        console.log(res);

        ToastAndroid.show("Posted Successfully", ToastAndroid.BOTTOM);
        route.replace('/PlatformRoute/(tabs)/home');
    };

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
            <View style={{ display: 'flex', flexDirection: 'row' }}>
                <Image
                    source={require('../../assets/images/addProfileAvatar.jpg')}
                    style={{ width: 50, height: 50, borderRadius: 100, marginTop: 20, marginLeft: 20 }}
                />
                <View>
                    <Text style={{ marginTop: 20, marginLeft: 20, fontSize: 18, fontWeight: 'bold' }}>
                        {user ? user.name : "User"}
                    </Text>
                    <Text style={{ marginLeft: 20, fontSize: 13, color: 'grey' }}>
                        Now
                    </Text>
                </View>
            </View>
            <TextInput
                multiline={true}
                numberOfLines={5}
                maxLength={1000}
                style={{ height: 140, marginLeft: 20, marginRight: 20, marginTop: 20, backgroundColor: 'white', textAlignVertical: 'top', padding: 15, borderRadius: 20 }}
                placeholder='Enter your post here...'
                onChangeText={(value) => { setContent(value) }}
            />

            <TouchableOpacity onPress={pickImage} style={{ width: 50 }}>
                {image ?
                    <Image source={{ uri: image }} style={{ height: 100, width: 100, marginLeft: 20, borderRadius: 20, marginTop: 20, borderWidth: 1 }} />
                    :
                    <Image source={require('../../assets/images/image.png')} style={{ height: 100, width: 100, marginLeft: 20, borderRadius: 20, marginTop: 20, borderWidth: 1 }} />
                }
            </TouchableOpacity>

            <View style={{ margin: 20, marginBottom: 10 }}>
                <DropDownPicker
                    items={item}
                    open={open}
                    value={value}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{}}
                />
            </View>

            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                <TouchableOpacity onPress={btnPost}>
                    <View style={{ width: 250, height: 50, backgroundColor: 'green', marginLeft: 50, marginRight: 50, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                        {loading ? <ActivityIndicator color={'white'} /> : <Text style={{ color: 'white' }}>Post</Text>}
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
