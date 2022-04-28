import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const GoogleContext = React.createContext();

function updatePodNavigation(pod, history, handleBack, location) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    history.length > 1 &&
    location.pathname !== "/overview" &&
    location.pathname !== "/import"
        ? pod.polyNav.setActiveActions(["back"])
        : pod.polyNav.setActiveActions([]);
}

export const GoogleContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);

    const location = useLocation();
    const history = useHistory();

    function handleBack() {
        if (history.length > 1) {
            history.goBack();
        }
    }

    async function runWithLoadingScreen(task) {
        setIsLoading(true);
        await task();
        setIsLoading(false);
    }

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
        });
    }, []);

    //on history change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack, location);
    });

    return (
        <GoogleContext.Provider
            value={{
                pod,
                globalError,
                isLoading,
                setIsLoading,
                runWithLoadingScreen,
                setGlobalError,
            }}
        >
            {children}
        </GoogleContext.Provider>
    );
};
