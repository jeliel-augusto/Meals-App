import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerItems} from "react-navigation-drawer";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import Colors from "../constants/Colors";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import {Ionicons} from '@expo/vector-icons'
import OrdersScreen from "../screens/shop/OrdersScreen";
import React from 'react';
import {SafeAreaView, Button, View} from "react-native";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import StartupScreen from "../screens/StartupScreen";
import {useDispatch} from "react-redux";
import {logout} from "../store/actions/auth";

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: Colors.primaryColor
    },
    headerTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: 'white'
}
const ProductsNavigator = createStackNavigator({
    'Products Overview': ProductsOverviewScreen,
    'Product Detail': ProductDetailScreen,
    Cart: CartScreen,
}, {
    defaultNavigationOptions,
    navigationOptions: {
        drawerIcon: drawerConfig => (<Ionicons name="md-list" size={23} color={drawerConfig.tintColor}/>)
    }
});
const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    defaultNavigationOptions,
    navigationOptions: {
        drawerIcon: drawerConfig => (<Ionicons name="md-create" size={23} color={drawerConfig.tintColor}/>)
    }
})
const AdminNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    defaultNavigationOptions,
    navigationOptions: {
        drawerIcon: drawerConfig => (<Ionicons name="md-create" size={23} color={drawerConfig.tintColor}/>)
    }
})
const AuthNavigator = createStackNavigator({
    Auth: AuthScreen,
}, {
    defaultNavigationOptions: defaultNavigationOptions
})

const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primaryColor
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return <View style={{flex: 1, paddingTop: 20}}>
            <SafeAreaView forceInsert={{top: 'always', horizontal: 'never'}}>
                <DrawerItems {...props} />
                <Button title="logout" color={Colors.primaryColor} onPress={() => {
                        dispatch(logout());

                    }
                } />
            </SafeAreaView>
        </View>
    }
})
const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
});
export default createAppContainer(MainNavigator);
