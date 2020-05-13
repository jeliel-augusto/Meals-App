import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from "../../constants/Colors";

export default function CartItem({onRemove, title, quantity, amount, deletable}){
    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.text}>{title}</Text>
                <Text style={styles.quantity}>{quantity} unit(s)</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.text}>${amount.toFixed(2)}</Text>
                {deletable && <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
                    <Ionicons name="md-trash" size={23} color="red"/>
                </TouchableOpacity>}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        fontFamily: 'open-sans',
        color: Colors.primaryText,
        fontSize: 16,

        marginLeft: 10
    },
    text: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },

    deleteButton: {
        marginLeft: 20
    }
});
