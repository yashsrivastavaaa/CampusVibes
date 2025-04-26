import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { db7 } from '@/config/db7events';
import { events } from '@/config/events';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { db8 } from '@/config/dbRegistration';
import { registration } from '@/config/registration';
import { AuthContext } from '@/context/AuthContext';
import { and, eq, sql } from 'drizzle-orm';

type EVENT = {
    id: number;
    name: string | null;
    location: string | null;
    link: string | null;
    date: string | null;
    time: string | null;
    type: string | null;
    imageurl: string | null;
    createdon: Date | null;
};

export default function EventsScreen() {
    const [eventList, setEventList] = useState<EVENT[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
    const [userRegistrations, setUserRegistrations] = useState<number[]>([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        getAllEvents();
        fetchUserRegistrations();
    }, []);

    const getAllEvents = async () => {
        try {
            setRefreshing(true);
            const result = await db7.select().from(events).where(eq(events.type, 'public')).orderBy(sql`${events.id} DESC`);
            setEventList(result);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const fetchUserRegistrations = async () => {
        try {
            const result = await db8
                .select()
                .from(registration)
                .where(eq(registration.userid, user?.username));

            const registeredEventIds = result.map((r: any) => r.event_id);
            setUserRegistrations(registeredEventIds);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    const register = async (id: number) => {
        try {
            setLoadingEventId(id);
            await db8.insert(registration).values({
                event_id: id,
                userid: user?.username,
            });

            ToastAndroid.show('Registered Successfully', ToastAndroid.SHORT);
            setUserRegistrations((prev) => [...prev, id]);
        } catch (e) {
            console.error('Registration failed:', e);
            ToastAndroid.show('Failed to register', ToastAndroid.SHORT);
        } finally {
            setLoadingEventId(null);
        }
    };

    const unregister = async (id: number) => {
        try {
            setLoadingEventId(id);
            await db8
                .delete(registration)
                .where(and(eq(registration.event_id, id), eq(registration.userid, user?.username)));

            ToastAndroid.show('Unregistered Successfully', ToastAndroid.SHORT);
            setUserRegistrations((prev) => prev.filter((eventId) => eventId !== id));
        } catch (e) {
            console.error('Unregistration failed:', e);
            ToastAndroid.show('Failed to unregister', ToastAndroid.SHORT);
        } finally {
            setLoadingEventId(null);
        }
    };

    const renderEventItem = ({ item }: { item: EVENT }) => {
        const isRegistered = userRegistrations.includes(item.id);
        const isLoading = loadingEventId === item.id;

        return (
            <View style={styles.card}>
                {item.imageurl && (
                    <Image source={{ uri: item.imageurl }} style={styles.image} />
                )}
                <Text style={styles.name}>{item.name}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                    <AntDesign style={{ marginLeft: 8 }} name="calendar" size={15} color="black" />
                    <Text style={styles.dateTime}>
                        {item.date}{'      '}
                        <AntDesign name="clockcircleo" size={15} color="black" /> {item.time}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <EvilIcons style={{ marginLeft: 8, marginBottom: 2 }} name="location" size={24} color="black" />
                    <Text style={styles.location}>{item.location}</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.registerButton,
                        { backgroundColor: isRegistered ? 'red' : 'green' },
                    ]}
                    onPress={() =>
                        isRegistered ? unregister(item.id) : register(item.id)
                    }
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.registerButtonText}>
                            {isRegistered ? 'Unregister' : 'Register'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Events</Text>
            </View>

            <FlatList
                data={eventList}
                renderItem={renderEventItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={() => {
                    getAllEvents();
                    fetchUserRegistrations();
                }}
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
    addButton: {
        backgroundColor: 'green',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
        paddingBottom: 10,
    },
    image: {
        marginTop: 10,
        width: '100%',
        resizeMode: 'cover',
        aspectRatio: 1.5,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        marginHorizontal: 8,
    },
    dateTime: {
        color: '#555',
        marginHorizontal: 8,
    },
    location: {
        fontSize: 12,
        color: '#888',
        marginHorizontal: 8,
        marginBottom: 8,
        marginTop: 8,
    },
    registerButton: {
        marginHorizontal: 8,
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 10,
        alignItems: 'center',
        height: 40,
    },
    registerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
