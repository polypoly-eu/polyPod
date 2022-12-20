import React, { useEffect, useState } from "react";

import i18n from "!silly-i18n";
import { useNavigate, useLocation } from "react-router-dom";

import popUps from "../popUps";

export const FacebookContext = React.createContext();

function updatePodNavigation(pod, handleBack, location) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    pod.polyNav.setActiveActions(
        ["/import", "/overview"].includes(location.pathname) ? [] : ["back"]
    );
}

function updateTitle(pod, location, popUp) {
    pod.polyNav.setTitle(
        location.pathname === "/"
            ? ""
            : popUp
            ? i18n.t("navbarTitles:info")
            : i18n.t(`navbarTitles:${location.pathname.substring(1)}`)
    );
}

export const FacebookProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [reportResult, setReportResult] = useState(null);
    const [popUp, setPopUp] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    async function runWithLoadingScreen(task) {
        setIsLoading(true);
        await task();
        setIsLoading(false);
    }

    function createPopUp({ type }) {
        setPopUp({ component: popUps[type] });
    }

    function closePopUp() {
        setPopUp(null);
    }

    function handleBack() {
        if (popUp) return setPopUp(null);
        navigate(-1);
    }

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => setPod(newPod));
    }, []);

    //on location change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, handleBack, location);
        updateTitle(pod, location, popUp);
    }, [location]);

    return (
        <FacebookContext.Provider
            value={{
                pod,
                handleBack,
                globalError,
                setGlobalError,
                reportResult,
                setReportResult,
                isLoading,
                setIsLoading,
                runWithLoadingScreen,
                popUp,
                createPopUp,
                closePopUp,
            }}
        >
            {children}
        </FacebookContext.Provider>
    );
};
