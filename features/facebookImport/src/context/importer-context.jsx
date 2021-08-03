import React from "react";

const ImporterContext = React.createContext();

export const ContextProvider = ({ children }) => {
    return (
        <ImporterContext.Provider value={{}}>
            {children}
        </ImporterContext.Provider>
    );
};
