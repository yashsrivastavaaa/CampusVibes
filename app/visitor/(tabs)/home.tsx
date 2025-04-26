import { View, Text, FlatList, Image, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db4 } from '@/config/db4';
import { postSch } from '@/config/postsSchema';
import { sql } from 'drizzle-orm';
import PostListG from '../PostList';

export default function Home() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            setLoading(true);
            const result = await db4.select({
                postId: postSch.id,
                content: postSch.content,
                imageUrl: postSch.image_url,
                createdby: postSch.createdby,
                createdOn: postSch.createdon,
            })
                .from(postSch).where(
                    sql`${postSch.visiblein} = 'public'`
                )
                .orderBy(sql`${postSch.id} DESC`);

            if (result && result.length > 0) {
                setPosts(result.map(item => ({
                    id: item.postId,
                    content: item.content,
                    image_url: item.imageUrl,
                    createdon: item.createdOn,
                    createdby: item.createdby,
                })));
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        getPosts();
        setRefreshing(false);
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
                            <Text style={{ fontSize: 16, color: 'black', marginTop: 10 }}>Welcome to G.L. Bajaj Communityyy.</Text>
                        </View>
                        <View>
                            <Image source={require('../../../assets/images/addProfileAvatar.jpg')} style={{ width: 50, height: 50, borderRadius: 100, marginLeft: 20, marginRight: 20 }} />
                        </View>
                    </View>
                    <PostListG posts={posts} loading={loading} />
                </View>
            }
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
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
        fontWeight: '500'
    }
});
