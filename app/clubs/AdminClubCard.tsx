import { db5 } from '@/config/db5';
import { AuthContext } from '@/context/AuthContext';
import { useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { clubsSch } from '@/config/clubsSchema';
import { eq } from 'drizzle-orm';

type ClubCardProps = {
    id: number;
    name: string;
    club_img: string;
    about: string;
    createdon: Date;
    getAllClubs: () => void;
};

export default function AdminClubCard({
    id, name, club_img, about, createdon, getAllClubs
}: ClubCardProps) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const handleDeleteClub = async () => {
        setLoading(true);

        try {
            await db5.delete(clubsSch).where(eq(clubsSch.id, id));
            Alert.alert('Success', 'Club has been deleted successfully.');
            getAllClubs();
        } catch (error) {
            console.error('Error deleting club:', error);
            Alert.alert('Error', 'Failed to delete the club.');
        } finally {
            setLoading(false);
        }
    };

    // Navigate to View Members page
    // const handleNavigateToViewMembers = () => {
    //     router.push({
    //         pathname: '/club/ViewMembers',
    //         params: { clubId: id.toString() },
    //     });
    // };

    // Navigate to Update Club page
    // const handleNavigateToUpdateClub = () => {
    //     router.push({
    //         pathname: '/club/UpdateClub',
    //         params: { clubId: id.toString(), name, about, club_img }
    //     });
    // };

    return (
        <View style={{
            display: 'flex',
            flex: 1,
            width: '90%',
            margin: '5%',
            backgroundColor: 'white',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            borderRadius: 10,
            padding: 10,
        }}>
            <Image source={{ uri: club_img }} style={{
                margin: 10,
                width: 100,
                height: 100,
                borderRadius: 100,
            }} />
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{name}</Text>
            <Text style={{ marginBottom: 10, fontSize: 14, textAlign: 'center' }}>{about}</Text>
            <Text style={{ fontSize: 12, color: 'gray', marginBottom: 10 }}>
                {createdon.toLocaleDateString()}
            </Text>

            <TouchableOpacity
                style={{
                    backgroundColor: 'blue',
                    width: 200,
                    marginTop: 10,
                    height: 50,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10
                }}

                onPress={() => router.push({
                    pathname: '/clubs/ViewStudents',
                    params: { club_name: name }
                })}>

                <Text style={{ color: 'white' }}>View Members</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: 'orange',
                    width: 200,
                    marginTop: 10,
                    height: 50,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10
                }}
                onPress={() =>
                    router.push({
                        pathname: '/editClub/updateClub',
                        params: {
                            clubId: name.toString(),
                            name,
                            about,
                            club_img
                        }
                    })
                }
            >
                <Text style={{ color: 'white' }}>Update Club</Text>
            </TouchableOpacity>


            <TouchableOpacity
                style={{
                    backgroundColor: 'red',
                    width: 200,
                    marginTop: 10,
                    height: 50,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20
                }}
                onPress={() =>
                    Alert.alert(
                        'Delete Club',
                        'Are you sure you want to delete this club?',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: handleDeleteClub },
                        ]
                    )
                }
            >
                {loading ? <ActivityIndicator color={'white'} /> : <Text style={{ color: 'white' }}>Delete Club</Text>}
            </TouchableOpacity>
        </View>
    );
}
