import { View, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db5 } from '@/config/db5';
import { clubsSch } from '@/config/clubsSchema';

import { not, sql } from 'drizzle-orm';
import ClubCard from '@/app/clubs/ClubCard';

type CLUB = {
    id: number;
    name: string;
    club_logo: string;
    about: string;
    createdon: Date;
}

export default function ExploreClub() {

    const [clubList, setClubList] = useState<CLUB[] | []>([]);

    useEffect(() => {
        getAllClubs();
    }, [])

    const getAllClubs = async () => {
        try {
            const result = await db5.select().from(clubsSch).where(not(sql`${clubsSch.name} = 'public'`)).limit(10);
            console.log(result);
            setClubList(result);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    }

    return (
        <View>
            <Text style={{
                fontSize: 30,
                fontWeight: 'bold', marginLeft: 20, marginTop: 30
            }}>Clubs</Text>
            <FlatList
                data={clubList}
                numColumns={2}
                renderItem={({ item, index }) => (
                    <ClubCard
                        id={item.id}
                        name={item.name}
                        club_img={item.club_logo}
                        about={item.about}
                        createdon={item.createdon}
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
}
