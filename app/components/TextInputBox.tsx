import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'

type TextInputBoxVal = {
    label: string;
    onChangeText: (text: string) => void;
    password?: boolean;
}

export default function TextInputBox({ label, onChangeText, password = false }: TextInputBoxVal) {
    return (
        <View>
            <TextInput placeholder={label} style={{ fontSize: 20, borderColor: 'black', borderWidth: 0.5, marginTop: 10, borderRadius: 10, margin: 30 }} secureTextEntry={password} onChangeText={onChangeText}></TextInput>
        </View >
    )
}