import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export default function PostListG({ posts, loading }: { posts: any[], loading: boolean }) {
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.postContainer}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/addProfileAvatar.jpg')}
                    style={{ width: 50, height: 50, borderRadius: 100, marginTop: 10, marginLeft: 10 }}
                />
                <Text style={{ marginLeft: 10 }}> @{item.createdby}</Text>
            </View>
            <Text style={styles.postContent}>{item.content}</Text>
            <Image source={{ uri: item.image_url }} style={styles.postImage} />
            <View style={styles.infoContainer}>
                <Text style={styles.date}>{new Date(item.createdon).toLocaleString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={{ marginTop: 20 }}>
            <Text style={styles.heading}>Latest Posts</Text>
            {loading ? (
                <ActivityIndicator size="large" color="green" />
            ) : posts.length > 0 ? (
                <FlatList
                    data={posts}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={styles.noPosts}>No posts available.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    postContent: {
        marginTop: 10,
        marginBlock: 10,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    infoContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: {
        fontSize: 12,
        color: '#888',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    noPosts: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 10,
    },
});
