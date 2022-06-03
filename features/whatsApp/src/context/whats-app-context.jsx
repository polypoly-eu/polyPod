import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

export const WhatsAppContext = React.createContext();

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

export const WhatsAppContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [popUp, setPopUp] = useState({});
    const [reportIsSent, setReportIsSent] = useState(false);

    const location = useLocation();
    const history = useHistory();

    const closePopUp = () => {
        setPopUp({});
    };

    function handleBack() {
        if (popUp?.name) return closePopUp();
        history.length > 1 && history.goBack();
    }

    async function runWithLoadingScreen(task) {
        setIsLoading(true);
        await task();
        setIsLoading(false);
    }

    function handleReportSent(sentSuccessfully) {
        setReportIsSent(sentSuccessfully);
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

    //for popUp sideSheet
    useEffect(() => {
        document.body.style.overflowY = popUp?.name ? "hidden" : "unset";
    }, [popUp]);

    return (
        <WhatsAppContext.Provider
            value={{
                pod,
                popUp,
                setPopUp,
                closePopUp,
                globalError,
                isLoading,
                setIsLoading,
                runWithLoadingScreen,
                setGlobalError,
                handleBack,
                handleReportSent,
                reportIsSent,
            }}
        >
            {children}
        </WhatsAppContext.Provider>
    );
};
