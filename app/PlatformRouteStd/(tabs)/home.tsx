import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { db4 } from '@/config/db4';
import { student } from '@/config/schemaStudent';
import { followerSch } from '@/config/followerSch';
import { useFocusEffect } from '@react-navigation/native';
import PostList2 from '@/app/addNewPost/PostList2';
import { postSch } from '@/config/postsSchema';
import { and, eq, isNotNull, or, sql } from 'drizzle-orm';

const categoryOption = [
    {
        name: 'Upcoming Events',
        banner: require('../../../assets/images/event.png'),
        path: '../event',
    },
    {
        name: 'Clubs',
        banner: require('../../../assets/images/clubs.png'),
        path: '../clubs',
    },
];

export default function Home() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState<{ id: number; content: string; image_url: string; username: string; createdon: Date; }[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const getPosts = async () => {
        if (user) {
            try {
                setRefreshing(true);
                setLoading(true);

                const r1 = await db4.selectDistinct({
                    postId: postSch.id,
                    content: postSch.content,
                    imageUrl: postSch.image_url,
                    createdBy: postSch.createdby,
                    createdOn: postSch.createdon,
                    username: postSch.name,
                    clubId: postSch.visiblein,
                })
                    .from(postSch)
                    .leftJoin(
                        followerSch,
                        and(
                            eq(followerSch.club_id, postSch.visiblein),
                            eq(followerSch.username, user.username)
                        )
                    )
                    .where(
                        or(
                            eq(postSch.visiblein, 'public'),
                            isNotNull(followerSch.username)
                        )
                    )
                    .orderBy(sql`${postSch.id} DESC`);

                const seenPostIds = new Set();
                const result = r1.filter(item => {
                    if (seenPostIds.has(item.postId)) {
                        return false;
                    }
                    seenPostIds.add(item.postId);
                    return true;
                });

                if (result && result.length > 0) {
                    setPosts(result.map((item) => ({
                        id: item.postId,
                        content: item.content,
                        image_url: item.imageUrl,
                        username: item.username,
                        createdon: item.createdOn,
                    })));
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setRefreshing(false);
                setLoading(false);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            getPosts();
        }, [])
    );

    const handleRefresh = () => {
        getPosts();
    };

    return (
        <FlatList
            data={posts}
            renderItem={null}
            ListHeaderComponent={
                <View style={{ margin: 20 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'green' }}>Hey There!</Text>
                            <Text style={{ fontSize: 16, color: 'black', marginTop: 10 }}>Welcome to G.L. Bajaj Community.</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => router.push('/PlatformRouteStd/(tabs)/profile')}>
                                <Image
                                    source={require('../../../assets/images/addProfileAvatar.jpg')}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 100,
                                        marginLeft: 20,
                                        marginRight: 20,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <FlatList
                            data={categoryOption}
                            numColumns={2}
                            renderItem={({ item }) => (
                                //@ts-ignore
                                <TouchableOpacity onPress={() => router.push(item.path)}>
                                    <View style={styles.containerCard}>
                                        <Image source={item.banner} style={styles.bannerImage} />
                                        <Text style={styles.text}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                        />
                    </View>

                    <PostList2 posts={posts} loading={loading} />
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    containerCard: {
        margin: 5,
    },
    bannerImage: {
        height: 80,
        objectFit: 'cover',
        width: Dimensions.get('screen').width * 0.42,
        borderRadius: 10,
    },
    text: {
        position: 'absolute',
        marginLeft: 5,
        marginTop: 2,
        color: 'white',
        fontWeight: '500',
    },
});
