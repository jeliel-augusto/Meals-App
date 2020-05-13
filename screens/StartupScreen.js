import React, {useEffect} from "react";
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from "react-native";
import Colors from "../constants/Colors";
import * as authActions from '../store/actions/auth';
import {useDispatch} from "react-redux";
export default function StartupScreen({navigation}){
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if(!userData) {
                navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);
            const {token, userId, expirationDate} = transformedData;
            const parsedExpirationDate = new Date(expirationDate);
            if(parsedExpirationDate <= new Date() || !token || !userId){
                navigation.navigate('Auth');
                return;
            }
            const expirationTime = expirationDate.getTime() - new Date().getTime();
            navigation.navigate('Shop');
            dispatch(authActions.authenticate(userId, token, expirationTime));
        }
        tryLogin();
    }, [])
    return <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.primaryColor}/>
    </View>
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
