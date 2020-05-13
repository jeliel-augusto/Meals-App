import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, Button, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import * as CartActions from "../../store/actions/cart";
import * as OrdersActions from '../../store/actions/orders'
export default function CartScreen(){
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const [isLoading, setIsLoading] = useState(false);
    const cartItems = useSelector(state => {
        const products = state.cart.products;
        const transformedCart = []
        for(let key in products){
            transformedCart.push({
                id: key,
                ...products[key]
            });
        }
        return transformedCart.sort((a, b) => a.productId > b.productId ? 1 : -1);
    })
    const dispatch = useDispatch();
    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(OrdersActions.addOrder(cartItems, cartTotalAmount))
        setIsLoading(false);
    }

    return (
        <View style={styles.container}>
            <View style={styles.cart}>
                <FlatList data={cartItems} keyExtractor={item => item.id}
                    renderItem={(itemData) => (<CartItem
                        title={itemData.item.productTitle}
                        quantity={itemData.item.quantity}
                        amount={itemData.item.sum}
                        deletable
                        onRemove={() => { dispatch(CartActions.removeFromCart(itemData.item.id)) }}
                    />)}
                />
            </View>
            <View style={styles.summary}>
                <Text style={styles.summaryText}>Total: $<Text style={styles.amount}>{Math.round(cartTotalAmount.toFixed(2)*100)/100}</Text></Text>
                {
                    isLoading ?
                    <ActivityIndicator size="small" color={Colors.primaryColor} />  :
                    <Button title="Order Now"
                            color={Colors.accentColor}
                            disabled={cartItems.length === 0}
                            onPress={sendOrderHandler}
                    />
                }
            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    cart: {

    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        elevation: 2,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.accentColor
    }
})
