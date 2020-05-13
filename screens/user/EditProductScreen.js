import React, { useEffect, useState, useCallback, useReducer } from 'react';
import {View, ScrollView, KeyboardAvoidingView, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/ui/HeaderButton";
import Input from "../../components/ui/Input";
import {useDispatch, useSelector} from "react-redux";
import * as ProductActions from '../../store/actions/products';
import Colors from "../../constants/Colors";

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

export default function EditProductScreen({navigation}){
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const id = navigation.getParam('id');
    const editedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === id));


    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: ''
        },
        inputsValidity: {
            title: !!editedProduct,
            imageUrl: !!editedProduct,
            description:!!editedProduct,
            price:!!editedProduct
        },
        isValid: !!editedProduct,
    })
    

    const dispatch = useDispatch();

    const submitHandler = useCallback(async () => {
        const { title, imageUrl, description, price } = formState.inputValues;
        console.log(formState);
        if(!formState.isValid){
            Alert.alert('Wrong input', 'Please check the errors in the form');
            return;
        }
        setIsLoading(true);
        setError(null);
        try{
            if(editedProduct){
                await dispatch(ProductActions.updateProduct(id, { title, imageUrl, description }))
            }else{
                await dispatch(ProductActions.createProduct({title, imageUrl, description, price: +price }));
            }
            navigation.goBack();
        }catch(e){
            setError(e.message);
        }
        setIsLoading(false);

    }, [dispatch, id, formState]);
    useEffect(() => {
        navigation.setParams({ submit: submitHandler })
    }, [submitHandler]);
    useEffect(() => {
        if(error){
            Alert.alert('An error ocurred', error, [{text: 'Ok'}])
        }
    }, [error])
    const textChangeHandler = useCallback( (inputId, value, isValid) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value, isValid, inputId});
    }, [dispatchFormState]);

    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size={"large"} color={Colors.primaryColor} />
        </View>
    }




    return (
        <KeyboardAvoidingView   behavior="padding" keyboardVerticalOffset={100}>
            <ScrollView>
                <View styles={styles.container}>
                    <Input label="Title" errorText="Please enter a valid title"
                           id="title"
                           initialValue={editedProduct ? editedProduct.title : ''}
                           required
                           initiallyValid={!!editedProduct}
                           onInputChange={textChangeHandler}/>
                    <Input label="Image URL" errorText="Please enter a valid url"
                           id="imageUrl"
                           initialValue={editedProduct ? editedProduct.imageUrl : ''}
                           initiallyValid={!!editedProduct}
                           required
                           onInputChange={textChangeHandler}
                    />

                    {!editedProduct && (<Input label="Price"
                                                    errorText="Please enter a valid price"
                                                    required
                                                    min={0}
                                                    id="price"
                                                    initiallyValid={!!editedProduct}
                                                    onInputChange={textChangeHandler}
                                                    keyboardType="decimal-pad"/>)}

                    <Input label="Description" errorText="Please enter a valid description"
                           multiline initialValue={editedProduct ? editedProduct.description : ''}
                           initiallyValid={!!editedProduct} numberOfLines={3}
                           required
                           id="description"
                           minLength={5}
                           onInputChange={textChangeHandler}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>


    )
}
EditProductScreen.navigationOptions = navData => {
    const submit = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('id') ? 'Edit Product': 'Add Product',
        headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
            <Item title='Save' iconName='md-checkmark' onPress={submit}/>
        </HeaderButtons>,
    }
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    error: {
        color: 'red'
    },
    formControl:{
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 0
    },
    label: {
        fontFamily: 'open-sans-bold',

    },
    input:{
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
