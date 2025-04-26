import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { act } from 'react'
import { boolean } from 'drizzle-orm/gel-core';

type ButtonInfo = {
    text: string;
    loading?: boolean;
    onPress: () => void;
}

export default function Button({ text, onPress, loading = false }: ButtonInfo) {
    return (
        <TouchableOpacity onPress={onPress}>
            {loading ? <ActivityIndicator style={{ marginTop: 30, backgroundColor: 'green', marginLeft: 50, marginRight: 50, padding: 20, borderRadius: 20 }} color={'white'} /> :
                <Text style={{ textAlign: 'center', marginTop: 30, backgroundColor: 'green', marginLeft: 50, marginRight: 50, padding: 20, borderRadius: 20, color: 'white' }}>
                    {text}
                </Text>}
        </TouchableOpacity>
    )
}