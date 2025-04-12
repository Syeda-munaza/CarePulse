"use client"
import { Provider } from "react-redux";
import { store } from "./store";
import { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

const ReduxToolkitProvider = ({ children }) => {
    return (
        <>
            <Provider store={store}>
                {children}
            </Provider>
        </>
    )
};
export const PersistGateProvider = ({children}) => {
    return (
        <>
            <PersistGate persistor={persistor} loading={null}>
                {children}
            </PersistGate>
        </>
    )
}

export default ReduxToolkitProvider;