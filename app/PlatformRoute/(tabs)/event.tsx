import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { db7 } from '@/config/db7events';
import { events } from '@/config/events';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { sql } from 'drizzle-orm';

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

    useEffect(() => {
        getAllEvents();
    }, []);

    const getAllEvents = async () => {
        try {
            setRefreshing(true);
            const result = await db7.select().from(events).orderBy(sql`${events.id} DESC`);
            setEventList(result);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const deleteEvent = async (id: number) => {
        try {
            setRefreshing(true);
            await db7.delete(events).where(sql`${events.id} = ${id}`);
            alert('Event deleted successfully.');
            await getAllEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete the event.');
        } finally {
            setRefreshing(false);
        }
    };

    const renderEventItem = ({ item }: { item: EVENT }) => {
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
                    style={[styles.registerButton, { backgroundColor: '#007bff' }]}
                    onPress={() =>
                        router.push({
                            pathname: '/event/ViewRegistered',
                            params: { eventId: item.id.toString() },
                        })
                    }
                >
                    <Text style={styles.registerButtonText}>View Registrations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.registerButton, { backgroundColor: 'orange', marginTop: 8 }]}
                    onPress={() =>
                        router.push({
                            pathname: '/editEvent/UpdateEvent',
                            params: {
                                id: item.id.toString(),
                                name: item.name ?? '',
                                location: item.location ?? '',
                                link: item.link ?? '',
                                date: item.date ?? '',
                                time: item.time ?? '',
                                type: item.type ?? '',
                                imageurl: item.imageurl ?? '',
                            },
                        })
                    }
                >
                    <Text style={styles.registerButtonText}>Update Event</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={[styles.registerButton, { backgroundColor: 'red', marginTop: 8 }]}
                    onPress={() =>
                        Alert.alert(
                            'Delete Event',
                            'Are you sure you want to delete this event?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => deleteEvent(item.id) },
                            ]
                        )
                    }
                >
                    <Text style={styles.registerButtonText}>Delete Event</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Events</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addNewEvent/AddEvent')}>
                    <Text style={{ color: 'white', fontSize: 20 }}>+</Text>
                </TouchableOpacity>

            </View>

            <FlatList
                data={eventList}
                renderItem={renderEventItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={getAllEvents}
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
