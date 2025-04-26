import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db5 } from '@/config/db5';
import { clubsSch } from '@/config/clubsSchema';
import { not, sql } from 'drizzle-orm';
import AdminClubCard from '@/app/clubs/AdminClubCard';

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
            setClubList(result);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <View>
            <Text style={styles.title}>Clubs</Text>

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
                keyExtractor={(item) => item.id.toString()}
                refreshing={refreshing}
                onRefresh={getAllClubs}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 20,
    },
});
