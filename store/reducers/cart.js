import {ADD_TO_CART, REMOVE_FROM_CART} from "../actions/cart";
import CartItem from "../../models/Cart-Item";
import {ADD_ORDER} from "../actions/orders";
import {DELETE_PRODUCT} from "../actions/products";
const initialState = {
    products: {},
    totalAmount: 0
}
export default function cartReducer(state = initialState, action){
    switch (action.type) {
        case ADD_TO_CART: {
            const addedProduct = action.payload;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;
            let newOrUpdatedItem;
            if(state.products[addedProduct.id]){
                newOrUpdatedItem = new CartItem(state.products[addedProduct.id].quantity + 1, productPrice, productTitle,
                    state.products[addedProduct.id].sum + productPrice
                )

            }else{
                newOrUpdatedItem =  new CartItem(1, productPrice, productTitle, productPrice);
            }
            return {
                ...state,
                products: {...state.products, [addedProduct.id]: newOrUpdatedItem},
                totalAmount: state.totalAmount + productPrice
            }
        }
        case REMOVE_FROM_CART: {
            const id = action.payload;
            const currentItem = state.products[id];
            const currentQuantity = currentItem.quantity;
            let updatedProducts;
            if(currentQuantity > 1){
                const newItem = new CartItem(currentQuantity-1,
                        currentItem.productPrice,
                        currentItem.productTitle,
                    currentItem.sum - currentItem.productPrice)
                updatedProducts = {...state.products, [id]: newItem}
            }else{
                updatedProducts = {...state.products};
                delete updatedProducts[id];
            }
            return {
                ...state,
                products: updatedProducts,
                totalAmount: state.totalAmount - currentItem.productPrice
            }
        }
        case ADD_ORDER: {
            return {...initialState}
        }
        case DELETE_PRODUCT:{
            if(!state.products[action.payload]){
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.products[action.payload].sum;
            delete updatedItems[action.payload];
            return {
                ...state,
                products: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            };
        }
        default:
            return state;
    }

}
