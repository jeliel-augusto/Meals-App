import Product from "../../models/Product";
import {Order} from "../../models/Order";

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
export const addOrder = (cartItems, totalAmount) => {
    return async (dispatch, getState) => {
        const date = new Date().toISOString()
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-complete-guide-cb760.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST' ,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cartItems, totalAmount, date })
        });
        if(!response.ok){
            throw new Error("Something went wrong");
        }
        const data = await response.json();

        dispatch({
            type: ADD_ORDER,
            payload: {cartItems, totalAmount, id: data.name, date}
        });
    }
}
export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const response = await fetch(`https://rn-complete-guide-cb760.firebaseio.com/orders/${userId}.json`);
        if(!response.ok){
            throw new Error("Something went wrong");
        }
        const data = await response.json();
        const loadedOrders = []
        for(const order_id in data){
            loadedOrders.push(new Order(
                order_id,
                data[order_id].cartItems,
                data[order_id].totalAmount,
                new Date(data[order_id].date)
            ));
        }
        dispatch({type: SET_ORDERS, payload: loadedOrders})
    }
}
