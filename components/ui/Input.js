import React, {useReducer, useEffect} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
const INPUT_CHANGE = 'INPUT_CHANGE'
const INPUT_BLUR = 'INPUT_BLUR'
const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            };
        case INPUT_BLUR:
            return {
                ...state,
                touched: true
            }
        default:
            return state;
    }
}
export default function Input({id, label, errorText, initiallyValid,initialValue,onInputChange, ...props}){

    const [inputState, dispatch] = useReducer(inputReducer, {
        value: initialValue ? initialValue : '',
        isValid: initiallyValid,
        touched: false
    });
    const textChangeHandler = text => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
            isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
            isValid = false;
        }
        if (props.min != null && +text < props.min) {
            isValid = false;
        }
        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
            isValid = false;
        }
        dispatch({type: INPUT_CHANGE, value: text, isValid})
    }
    const lostFocusHandler = () => {
        dispatch({type: INPUT_BLUR})
    }
    useEffect(() => {

            onInputChange(id, inputState.value, inputState.isValid);
        // }
    }, [inputState, onInputChange, id])
    return (
        <View style={styles.formControl}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.input}
                        onBlur={lostFocusHandler}
                       value={inputState.value}
                       onChangeText={textChangeHandler}
                       {...props}
                       returnKeyType="next"
            />
            {inputState.touched && !inputState.isValid && <View style={styles.errorContainer}><Text style={styles.error}>{errorText}</Text></View>}
        </View>
    )
}
const styles = StyleSheet.create({
    formControl:{
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 0
    },
    label: {
        fontFamily: 'open-sans-bold',
    },
    errorContainer: {
        marginVertical: 10
    },
    error: {
        color: 'red',
        fontSize: 13
    },
    input:{
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2
    }
});
