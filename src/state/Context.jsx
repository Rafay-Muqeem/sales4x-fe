import React, { createContext, useReducer, useContext } from 'react';
import { Reducer } from './Reducer';

const myContext = createContext();

const Context = ({children}) => {

    const initialState = {
        Settings: {
            General: {
                invoice: 'current',
            }
        },
        userToken: ''
    }
    const [state, dispatch] = useReducer(Reducer, initialState)

    return (
        <myContext.Provider value={{ state, dispatch}}>
            {children}
        </myContext.Provider>
    )
}

export default Context;

export const State = () => {
    return useContext(myContext)
}


