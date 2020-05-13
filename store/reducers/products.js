import PRODUCTS from "../../data/dummy-data";
import {CREATE_PRODUCT, DELETE_PRODUCT, SET_PRODUCTS, UPDATE_PRODUCT} from "../actions/products";
import Product from "../../models/Product";
const initialState = {
    availableProducts: [],
    userProducts: []
};
export default function productsReducer(state = initialState, action){
    switch (action.type) {
        case DELETE_PRODUCT:
            return {...state,
                userProducts: state.userProducts.filter((item) => item.id !== action.payload),
                availableProducts: state.availableProducts.filter((item) => item.id !== action.payload),
            };
        case SET_PRODUCTS: {
            const products = action.payload.loadedProducts;
            const userProducts =  action.payload.userProducts
            return {availableProducts: products, userProducts: userProducts}
        }
        case CREATE_PRODUCT:{
            const newProduct = new Product(action.payload.id, action.payload.ownerId,
                action.payload.title,
                action.payload.imageUrl,
                action.payload.description,
                action.payload.price);
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.availableProducts.concat(newProduct)
            }
        }
        case UPDATE_PRODUCT: {
            const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.payload.id);
            const productIndex = state.userProducts.findIndex(prod => prod.id === action.payload.id);
            const {title, imageUrl, description} = action.payload.product;
            const updatedProduct = new Product(action.payload.id,
                state.userProducts[productIndex].ownerId, title,
                imageUrl,
                description,
                state.userProducts[productIndex].price);

            const updatedUserProducts = [...state.userProducts];
            updatedUserProducts[productIndex] = updatedProduct;
            const updatedAvailableProducts = [...state.availableProducts]
            updatedAvailableProducts[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
        }
        default:
            return state;
    }
}
