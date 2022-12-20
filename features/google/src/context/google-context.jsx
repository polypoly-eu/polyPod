import React, { useEffect, useState } from "react";
import i18n from "!silly-i18n";

import { useNavigate, useLocation } from "react-router-dom";

export const GoogleContext = React.createContext();

function updatePodNavigation(pod, navigate, handleBack, location) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    pod.polyNav.setActiveActions(
        ["/import", "/overview"].includes(location.pathname) ? [] : ["back"]
    );
}

function updateTitle(pod, location) {
    let screenTitle;
    try {
        screenTitle = i18n.t(`navbarTitles:${location.pathname.substring(1)}`);
    } catch {
        screenTitle = i18n.t("navbarTitles:overview");
    }
    pod.polyNav.setTitle(location.pathname === "/" ? "" : screenTitle);
}

export const GoogleContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [popUp, setPopUp] = useState({});
    const [reportIsSent, setReportIsSent] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const closePopUp = () => {
        setPopUp({});
    };

    function handleBack() {
        if (popUp?.name) {
            closePopUp();
            return;
        }
        navigate(-1);
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

    //on location change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, navigate, handleBack, location);
        updateTitle(pod, location);
    }, [location, popUp]);

    //for popUp sideSheet
    useEffect(() => {
        document.body.style.overflowY = popUp?.name ? "hidden" : "unset";
    }, [popUp]);

    return (
        <GoogleContext.Provider
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
        </GoogleContext.Provider>
    );
};
