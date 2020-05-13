import React, {useState} from 'react';
import {View, StyleSheet, Button, Text} from 'react-native';
import CartItem from "./CartItem";
import Colors from "../../constants/Colors";
import Card from "../ui/Card";
export default function OrderItem({amount, date, items}){
    const [showDetails, setShowDetails] = useState(false);
    return <Card style={styles.orderItem}>
        <View style={styles.summary}>
            <Text style={styles.totalAmount}>${amount.toFixed(2)}</Text>
            <Text style={styles.date}>{date}</Text>
        </View>
        <Button title={showDetails ? 'Hide Details' : 'Show Details'} color={Colors.primaryColor} onPress={() => {
            setShowDetails(prevState => !prevState)
        }}/>
        {
            showDetails &&
            <View style={styles.detailItems}>{
                items.map(cartItem => <CartItem quantity={cartItem.quantity} key={cartItem.id}  title={cartItem.productTitle}
                                                               amount={cartItem.sum}/>)
            }</View>
        }
    </Card>
}
const styles = StyleSheet.create({
    orderItem: {
        width: '95%',
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    },
    detailItems: {
        width: '100%'
    }
});
