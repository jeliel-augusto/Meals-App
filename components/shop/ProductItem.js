import React from 'react';
import {View, StyleSheet, Text, Image, TouchableNativeFeedback} from 'react-native';
import Colors from "../../constants/Colors";
import ActionButton from "./ActionButton";
import Card from "../ui/Card";
export default function ProductItem({ item, onSelect, children}){
    return (

            <TouchableNativeFeedback onPress={onSelect} >
                <Card style={styles.container}>
                    <View style={styles.content}>
                        <Image source={{uri: item.imageUrl}} style={styles.image} />
                        <View style={styles.info}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.secondaryText}>${item.price}</Text>

                        </View>
                    </View>
                    <View style={styles.actions}>
                        {children}
                    </View>
                </Card>
            </TouchableNativeFeedback>


       );
}
const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',

        justifyContent: 'flex-end'
    },
    content: {
        flexDirection: 'row',

    },
    container: {
        width: '95%',

    },
    info: {
        marginHorizontal: 16,
        flex: 1,
        width: '100%'
    },
    image: {
        width: 80,
        height: 80,
        marginBottom: 5
    },
    title: {
        fontSize: 16,
        color: Colors.primaryText,
        fontFamily: 'open-sans-bold'
    },
    secondaryText: {
        fontFamily: 'open-sans',
        fontSize: 14,
        color: Colors.secondaryText,
    },
});
