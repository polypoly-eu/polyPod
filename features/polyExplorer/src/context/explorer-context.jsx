import React, { useContext, useState } from "react";

export const ExplorerContext = React.createContext();

export const ExplorerProvider = ({ children }) => {
    return (
        <ExplorerContext.Provider value={{ test }}>
            {children}
        </ExplorerContext.Provider>
    );
};
