import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db8 } from '@/config/dbRegistration';
import { registration } from '@/config/registration';
import { student } from '@/config/schemaStudent';
import { visitor } from '@/config/visitor';
import { eq } from 'drizzle-orm';

interface RegisteredUser {
    username: string;
    name: string;
}

export default function ViewRegistered() {
    const { eventId } = useLocalSearchParams();
    const [users, setUsers] = useState<RegisteredUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRegisteredUsers = async () => {
        if (!eventId) {
            setError('Event ID is missing');
            setLoading(false);
            return;
        }
        console.log('Fetching registered users for event ID:', eventId);
        console.log(eventId);

        try {
            setLoading(true);
            setError(null);
            const students = await db8
                .select({
                    username: student.username,
                    name: student.name,
                })
                .from(registration)
                .innerJoin(student, eq(registration.userid, student.username))
                .where(eq(registration.event_id, Number(eventId)));

            const studentData: RegisteredUser[] = students.map((student) => ({
                username: student.username,
                name: student.name ?? 'Unknown',
            }));

            const visitors = await db8
                .select({
                    username: visitor.username,
                    name: visitor.name,
                })
                .from(registration)
                .innerJoin(visitor, eq(registration.userid, visitor.username))
                .where(eq(registration.event_id, Number(eventId)));

            const visitorData: RegisteredUser[] = visitors.map((visitor) => ({
                username: visitor.username,
                name: visitor.name ?? 'Unknown',
            }));

            const combinedUsers = [...studentData, ...visitorData];

            setUsers(combinedUsers);
        } catch (error) {
            console.error('Error fetching registered users:', error);
            setError('Failed to load registered users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegisteredUsers();
    }, [eventId]);

    const renderItem = ({ item }: { item: RegisteredUser }) => (
        <View style={styles.item}>
            <Image
                source={require('@/assets/images/addProfileAvatar.jpg')}
                style={styles.avatar}
            />
            <View style={{ marginLeft: 10 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.username}>@{item.username}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrations</Text>

            {loading ? (
                <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : users.length === 0 ? (
                <Text style={styles.noData}>No users have registered yet.</Text>
            ) : (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.username}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    username: {
        fontSize: 13,
        color: '#666',
    },
    noData: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: 'gray',
    },
    error: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: 'red',
    },
});
