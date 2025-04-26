import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PostList({
    posts,
    loading,
    onDeletePost,
    currentUser,
}: {
    posts: any[];
    loading: boolean;
    onDeletePost: (postId: number) => void;
    currentUser: { username: string };
}) {
    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.postContainer}>

            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Image
                    source={require('../../assets/images/addProfileAvatar.jpg')}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        marginTop: 10,
                        marginLeft: 10,
                    }}
                />

                <View style={{ marginLeft: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '80%' }}>
                    <Text style={styles.username}>{item.username}</Text>


                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end'

                    }}

                        onPress={() => {
                            Alert.alert(
                                'Delete Post',
                                'Are you sure you want to delete this post?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => onDeletePost(item.id),
                                    },
                                ],
                                { cancelable: true }
                            );
                        }}
                    >
                        <MaterialIcons name="delete" size={24} color="#ff4d4d" />
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.postContent}>{item.content}</Text>

            {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.postImage} />
            ) : null}

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
                    keyExtractor={(item) => item.id.toString()}
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
        position: 'relative',
    },

    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    postContent: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    infoContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    username: {
        fontWeight: 'bold',
        color: '#555',
        fontSize: 15,
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginLeft: 10,
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
