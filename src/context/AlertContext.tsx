import React, { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alertInfo, setAlertInfo] = useState({
        show: false,
        message: "",
        severity: "info",
    });

    return (
        <AlertContext.Provider value={{ alertInfo, setAlertInfo }}>
            {children}
        </AlertContext.Provider>
    );
};