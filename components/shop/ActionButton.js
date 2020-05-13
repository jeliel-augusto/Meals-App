import React from 'react';
import { StyleSheet, Text, TouchableOpacity} from "react-native";
import Colors from "../../constants/Colors";

export default function ActionButton({style, title, ...props}){
    return (
        <TouchableOpacity {...props} style={{...styles.actionButton,...style}}>
            <Text style={styles.title}>{title.toUpperCase()}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    actionButton: {

        padding: 8
    },
    title: {
        color: Colors.accentColor
    }
})
