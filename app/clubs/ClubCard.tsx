import { db6 } from '@/config/db6';
import { followerSch } from '@/config/followerSch';
import { AuthContext } from '@/context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { and, eq } from 'drizzle-orm';

type ClubCardProps = {
    id: number;
    name: string;
    club_img: string;
    about: string;
    createdon: Date;
};

export default function ClubCard({ id, name, club_img, about, createdon }: ClubCardProps) {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [followedClubs, setFollowedClubs] = useState<string[]>([]);
    useEffect(() => {
        if (user?.username) {
            getUserFollowedClubs();
        }
    }, [user]);

    const onFollowClickBtn = async () => {
        if (!user?.username) return;

        setLoading(true);

        try {
            const res = await db6.insert(followerSch).values({
                username: user.username,
                club_id: name,
            });
            console.log('Followed club:', res);

            getUserFollowedClubs();
        } catch (error) {
            console.error('Error following the club:', error);
        } finally {
            setLoading(false);
        }
    };

    const onUnfollowClickBtn = async () => {
        if (!user?.username) return;
        setLoading(true);

        try {
            const res = await db6.delete(followerSch)
                .where(and(eq(followerSch.username, user.username), eq(followerSch.club_id, name)));
            console.log('Unfollowed club:', res);

            getUserFollowedClubs();
        } catch (error) {
            console.error('Error unfollowing the club:', error);
        } finally {
            setLoading(false);
        }
    };

    const getUserFollowedClubs = async () => {
        if (!user?.username) return;

        try {
            const result = await db6.select({ club_id: followerSch.club_id })
                .from(followerSch)
                .where(eq(followerSch.username, user.username));
            console.log('Followed clubs:', result);

            setFollowedClubs(result.map((item: any) => item.club_id));
        } catch (error) {
            console.error('Error fetching followed clubs:', error);
        }
    };
    const isFollowing = followedClubs.includes(name);

    return (
        <View style={{
            display: 'flex',
            flex: 1,
            width: '40%',
            margin: 15,
            backgroundColor: 'white',
            alignItems: 'center',
            height: 300,
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
                    backgroundColor: isFollowing ? 'gray' : 'green',
                    width: 80,
                    marginTop: 10,
                    height: 50,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={isFollowing ? onUnfollowClickBtn : onFollowClickBtn}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color={'white'} /> :
                    <Text style={{ color: 'white' }}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </Text>}
            </TouchableOpacity>
        </View>
    );
}
