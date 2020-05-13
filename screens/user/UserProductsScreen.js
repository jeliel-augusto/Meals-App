import React from 'react';
import {FlatList, Alert, View, Text} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/ui/HeaderButton";
import ActionButton from "../../components/shop/ActionButton";
import * as ProductActions from "../../store/actions/products";
export default function UserProductsScreen({ navigation }){
    const userProducts = useSelector(state => state.products.userProducts);
    const dispatch = useDispatch();
    const selectProductHandler = (id) => {
        navigation.navigate('EditProduct', {id});
    }
    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress:  ()=> {
                    dispatch(ProductActions.deleteProduct(id));
                }},
        ])
    };
    if(userProducts.length === 0){
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No products was found, try creating some?</Text>
        </View>
    }

    return <FlatList data={userProducts} keyExtractor={item => item.id}
    renderItem={
        itemData => {
            return (
                <ProductItem item={itemData.item} onSelect={ ()=>{ selectProductHandler(itemData.item.id); } }>
                    <ActionButton onPress={
                        () => {
                           selectProductHandler(itemData.item.id);
                        }
                    } title="Edit"/>
                    <ActionButton onPress={() => deleteHandler(itemData.item.id)} title="Delete"/>
                </ProductItem>
            )
        }
    }/>
}
UserProductsScreen.navigationOptions = navData => ({
    headerTitle: 'Your Products',
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
        <Item title='Cart' iconName='md-menu' onPress={()=>{navData.navigation.toggleDrawer()}}/>
    </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
        <Item title='Create' iconName='md-add' onPress={()=>{navData.navigation.navigate('EditProduct')}}/>
    </HeaderButtons>,
});
