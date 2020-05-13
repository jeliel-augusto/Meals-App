import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/ui/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";
import * as OrderActions from "../../store/actions/orders";
import Colors from "../../constants/Colors";

export default function OrdersScreen(){
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        await dispatch(OrderActions.fetchOrders());
        setIsLoading(false);
    }, [dispatch, setIsLoading]);
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primaryColor}/>
        </View>
    }
    if(orders.length === 0){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No orders created was found, try ordering some products.</Text>
        </View>
    }
    return <FlatList data={orders} keyExtractor={item => item.id}
                     renderItem={itemData => <OrderItem amount={itemData.item.totalAmount}
                                                        items={itemData.item.items}
                                                        date={itemData.item.readableDate}/>}/>
}
OrdersScreen.navigationOptions = (navData) => ({
    headerTitle: 'Your Orders',
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
        <Item title='Cart' iconName='md-menu' onPress={()=>{navData.navigation.toggleDrawer()}}/>
    </HeaderButtons>,
});
const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
