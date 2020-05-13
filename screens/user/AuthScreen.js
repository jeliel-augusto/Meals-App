import React, {useState,useCallback, useReducer, useEffect} from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert} from 'react-native';
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Colors from "../../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from "react-redux";
import * as authActions from '../../store/actions/auth'
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'
const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.inputId]: action.value
        }
        const updatedValidity = {
            ...state.inputsValidity,
            [action.inputId]: action.isValid
        }
        let formIsValid = true;
        for(const key in updatedValidity){
            formIsValid = formIsValid && updatedValidity[key]
        }
        return { isValid: formIsValid, inputValues: updatedValues, inputsValidity: updatedValidity }
    }
    return state;
};


export default function AuthScreen({navigation}){
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputsValidity: {
            email: false,
            password: false
        },
        isValid: false
    })
    const inputChangeHandler = useCallback( (inputId, value, isValid) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value, isValid, inputId});
    }, [dispatchFormState]);
    const authHandler = async () => {
        let action;
        if(isSignUp){
            action = (authActions.signup(formState.inputValues.email, formState.inputValues.password));
        }else{
            action = (authActions.signin(formState.inputValues.email, formState.inputValues.password))
        }
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(action);
            navigation.navigate('Shop')
        }catch (e) {
            setError(e.message);
            setIsLoading(false);
        }
    }
    const [isSignUp, setIsSignup] = useState(false);

    useEffect(() => {
        if(error){
            Alert.alert('An error ocurred', error, [{text: 'Ok'}])
        }
    }, [error])
    return <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <Input id="email" label="E-Mail" onInputChange={inputChangeHandler} email autoCapitalize="none"
                           errorText="Please enter a valid email address" keyboardType="email-address"
                           initialValue=""
                    />
                    <Input id="password" label="Password" onInputChange={inputChangeHandler} autoCapitalize="none"
                           errorText="Please enter a valid password" required secureTextEntry minLength={5}
                           initialValue=""
                    />
                    <View style={styles.actions}>
                        <View style={styles.button}>
                            {isLoading ? (<ActivityIndicator size="small" color="red" />): <Button title={isSignUp? 'Sign Up':'Login'}
                                                                          color={Colors.primaryColor} onPress={authHandler}  />}
                        </View>
                        <View style={styles.button}>
                            <Button title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                                    color={Colors.accentColor} onPress={()=>{
                                        setIsSignup(prevState => !prevState);
                            }}/>
                        </View>
                    </View>

                </ScrollView>
            </Card>
        </LinearGradient>

}
AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}
const styles = StyleSheet.create({
    authContainer: {
        width: '90%',
    },
    actions: {
        padding: 20
    },
    button: {
        marginVertical: 10
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
