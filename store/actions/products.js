import Product from "../../models/Product";

export const DELETE_PRODUCT =  'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS;'
export const fetchProducts = () => {
    return async (dispatch, getState) => {
        try{
            const userId = getState().auth.userId;
            const response = await fetch(`https://rn-complete-guide-cb760.firebaseio.com/products.json`);
            if(!response.ok){
                throw new Error("Something went wrong");
            }
            const data = await response.json();
            const loadedProducts = []
            for(const product_id in data){
                loadedProducts.push(new Product(product_id,
                    data[product_id].ownerId,
                    data[product_id].title,
                    data[product_id].imageUrl,
                    data[product_id].description,
                    data[product_id].price
                ));
            }
            dispatch({
                type: SET_PRODUCTS,
                payload: { loadedProducts, userProducts: loadedProducts.filter(prod => prod.ownerId === userId)}
            });
        }catch(e){
            throw e;
        }

    }
}
export const deleteProduct = productId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://rn-complete-guide-cb760.firebaseio.com/products/${productId}.json?auth=${token}`, {
            method: 'DELETE' ,
        });
        if(!response.ok){
            throw new Error("Something went wrong");
        }
        dispatch({
            type: DELETE_PRODUCT,
            payload: productId
        })
    }

}
export const createProduct = product => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        //any async action
        const response = await fetch(`https://rn-complete-guide-cb760.firebaseio.com/products.json?auth=${token}`, {
            method: 'POST' ,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...product, ownerId: userId})
        });
        const data = await response.json();

        dispatch({
            type: CREATE_PRODUCT,
            payload: {...product, id: data.name, ownerId: userId}
        });
    }
}
export const updateProduct = (id, product) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
       const response = await fetch(`https://rn-complete-guide-cb760.firebaseio.com/products/${id}.json?auth=${token}`, {
            method: 'PATCH' ,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
       if(!response.ok){
           throw new Error("Something went wrong");
       }
        dispatch({
            type: UPDATE_PRODUCT,
            payload: {id, product}
        });
    }
}
