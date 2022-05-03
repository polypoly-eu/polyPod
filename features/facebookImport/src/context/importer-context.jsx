import React, { useEffect, useState } from "react";

import i18n from "../i18n.js";
import { useHistory, useLocation } from "react-router-dom";

export const ImporterContext = React.createContext();

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

function updateTitle(pod, location, popUp) {
    pod.polyNav.setTitle(
        location.pathname === "/"
            ? ""
            : popUp
            ? i18n.t("navbarTitles:info")
            : i18n.t(`navbarTitles:${location.pathname.substring(1)}`)
    );
}

export const ImporterProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [globalError, setGlobalError] = useState(null);
    const [reportResult, setReportResult] = useState(null);
    const [popUp, setPopUp] = useState(null);
    const history = useHistory();
    const location = useLocation();

    async function runWithLoadingScreen(task) {
        setIsLoading(true);
        await task();
        setIsLoading(false);
    }

    function handleBack() {
        if (popUp) {
            return setPopUp(null);
        }
        history.length > 1 && history.goBack();
    }

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => setPod(newPod));
    }, []);

    //on history change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack, location);
        updateTitle(pod, location, popUp);
    });

    useEffect(() => {
        document.body.style.overflowY = popUp ? "hidden" : "unset";
    }, [popUp]);

    return (
        <ImporterContext.Provider
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
                setPopUp,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
