import React from 'react';
import { View, StyleSheet } from 'react-native';
const Card = ({children, style}) => {
    return <View style={{...styles.card, ...style}}>
        {children}
    </View>
}
const styles = StyleSheet.create({
    card: {
        alignSelf: 'center',
        padding: 16,
        paddingBottom: 0,
        marginVertical: 5,
        borderWidth: 1,
        elevation: 2,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
    }
})
export default Card;
