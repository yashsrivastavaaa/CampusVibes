import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { db5 } from '@/config/db5';
import { sql } from 'drizzle-orm';

type STUDENT = {
    name: string;
    username: string;
};

export default function ViewStudents() {
    const { club_name } = useLocalSearchParams();
    const [students, setStudents] = useState<STUDENT[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const clubName = Array.isArray(club_name) ? club_name[0] : club_name;

    useEffect(() => {
        if (clubName) {
            fetchStudents();
        }
    }, [clubName]);

    const fetchStudents = async () => {
        try {
            const result = await db5.execute(
                sql`SELECT s.name, s.username 
            FROM students s 
            JOIN followers f ON s.username = f.username 
            WHERE f.club_id = ${clubName}`
            );

            setStudents(result.rows as STUDENT[]);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Students in "{clubName}"</Text>
            <FlatList
                data={students}
                keyExtractor={(item) => item.username}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.username}>@{item.username}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No students found in this club.</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 30,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    username: {
        fontSize: 14,
        color: '#666',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'gray',
    },
});
