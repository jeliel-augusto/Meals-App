export const SIGNUP =  'SIGNUP';
export const SIGNIN = 'SIGNIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT'
import { AsyncStorage } from "react-native";
let timer;
export const authenticate = (userId, token, expirationTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expirationTime));
        dispatch({type: AUTHENTICATE, payload: {userId, token}});
    }

}
export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAGjf0Y3jQ-vYFBeT8E___Ccin156Gx8g0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        })
        if(!response.ok){
            const errResData = await response.json();
            const errorId = errResData.error.message;
            let message = 'Something went wrong';
            if(errorId === 'EMAIL_EXISTS'){
                message = 'This email exists already'
            }else if(errorId.includes('WEAK_PASSWORD')){
                message = 'Password should be at least 6 characters'
            }
            throw new Error(message)
        }
        const resData = await response.json();
        console.log(resData);
        dispatch(authenticate(resData.userId, resData.idToken, parseInt(resData.expiresIn) *1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn()) * 1000);

        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};
export const signin = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAGjf0Y3jQ-vYFBeT8E___Ccin156Gx8g0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        })
        if(!response.ok){
            const errResData = await response.json();
            const errorId = errResData.error.message;
            let message = 'Something went wrong, try again later';

            if(errorId === 'EMAIL_NOT_FOUND'){
                message = 'This email could not be found'
            }else if(errorId === 'INVALID_PASSWORD'){
                message = 'Wrong password'
            }
            console.log(errResData);
            throw new Error(message)
        }
        const resData = await response.json();
        console.log(resData);
        dispatch(authenticate(resData.userId, resData.idToken, parseInt(resData.expiresIn) *1000))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};
export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
}
const clearLogoutTimer = () => {
    if(timer){
        clearTimeout(timer);
    }
}
const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}
const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({token, userId, expirationDate: expirationDate.toISOString()}));
}
