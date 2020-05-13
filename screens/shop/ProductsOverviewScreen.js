import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, Text, ActivityIndicator, Button} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import { HeaderButtons, Item} from "react-navigation-header-buttons";
import * as CartActions from '../../store/actions/cart'
import CustomHeaderButton from "../../components/ui/HeaderButton";
import ActionButton from "../../components/shop/ActionButton";
import {fetchProducts} from "../../store/actions/products";
import Colors from "../../constants/Colors";
import {set} from "react-native-reanimated";
export default function ProductsOverviewScreen({navigation}){
    const products = useSelector(state => state.products.availableProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState('')
    const dispatch = useDispatch();
    const loadData = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try{
            await dispatch(fetchProducts());
        }catch(error){
            setError(error.message);
        }
        setIsRefreshing(false);
        },[dispatch, setIsLoading, setError])
    useEffect(() => {
        const willFocusSub = navigation.addListener('willFocus', loadData);
        return () => {
            willFocusSub.remove();
        }
    }, [loadData]);
    useEffect(() => {
        setIsLoading(true);
        loadData().then(()=>setIsLoading(false));
    }, [loadData])
    const selectItemHandler = (item)=>{
        navigation.navigate('Product Detail', { productId: item.id, productTitle: item.title });
    }
    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
    }
    if(!isLoading && products.length === 0 && !error){
        return <View style={styles.centered}>
            <Text>No products was found, try adding some!</Text>
        </View>
    }
    if(error){
        return <View style={styles.centered}>
            <Text>Something went wrong</Text>
            <Button title="Try again" onPress={loadData} />
        </View>
    }
    return <FlatList data={products} keyExtractor={item => item.id}
                     onRefresh={loadData}
                     refreshing={isRefreshing}
                     renderItem={
                         itemData =>
                            <ProductItem item={itemData.item} onSelect={()=>selectItemHandler(itemData.item)}>
                                <ActionButton onPress={
                                    ()=>selectItemHandler(itemData.item)
                                } title="Details"/>
                                <ActionButton onPress={
                                    ()=> dispatch(CartActions.addToCart(itemData.item))
                                } title="To Cart"/>
                            </ProductItem>
                     } />
}
ProductsOverviewScreen.navigationOptions = (navData) => ({
    headerTitle: 'All Products',
    headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
        <Item title='Cart' iconName='md-cart' onPress={()=>{navData.navigation.navigate('Cart')}}/>
    </HeaderButtons>,
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
        <Item title='Cart' iconName='md-menu' onPress={()=>{navData.navigation.toggleDrawer()}}/>
    </HeaderButtons>,
});
const styles = StyleSheet.create({
    centered: {flex: 1, justifyContent: 'center', alignItems: 'center' }
});
