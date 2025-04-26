import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db5 } from '@/config/db5';
import { clubsSch } from '@/config/clubsSchema';
import { not, sql } from 'drizzle-orm';
import AdminClubCard from '@/app/clubs/AdminClubCard';
import { router } from 'expo-router';

type CLUB = {
    id: number;
    name: string;
    club_logo: string;
    about: string;
    createdon: Date;
};

export default function ExploreClub() {
    const [clubList, setClubList] = useState<CLUB[] | []>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getAllClubs();
    }, []);


    const getAllClubs = async () => {
        setRefreshing(true);
        try {
            const result = await db5.select().from(clubsSch).where(not(sql`${clubsSch.name} = 'public'`));
            console.log(result);
            setClubList(result);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Clubs</Text>
                <TouchableOpacity style={{
                    backgroundColor: 'green',
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                }} onPress={() => router.push('/addNewPost/addClub')}>
                    <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={clubList}
                numColumns={1}
                renderItem={({ item }) => (
                    <AdminClubCard
                        id={item.id}
                        name={item.name}
                        club_img={item.club_logo}
                        about={item.about}
                        createdon={item.createdon}
                        getAllClubs={getAllClubs}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                refreshing={refreshing}
                onRefresh={getAllClubs}
                style={{ marginBottom: 70 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
});
