import {ADD_ORDER, SET_ORDERS} from "../actions/orders";
import {Order} from "../../models/Order";

const initialState = {
    orders: []
}
export default function ordersReducer(state = initialState, action){
    switch (action.type) {
        case ADD_ORDER: {
            const newOrder = new Order(action.payload.id,
                action.payload.cartItems,
                action.payload.totalAmount,
                action.payload.date);
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            }
        }
        case SET_ORDERS: {
            return {
                ...state,
                orders: action.payload
            }
        }
    }
    return state;
}
