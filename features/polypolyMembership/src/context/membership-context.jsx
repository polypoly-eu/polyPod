import React, { useEffect, useState } from "react";
import i18n from "!silly-i18n";

import { useNavigate, useLocation } from "react-router-dom";

export const MembershipContext = React.createContext();

function updatePodNavigation(pod, handleBack, location) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    location.pathname !== "/onboarding" && location.pathname !== "/"
        ? pod.polyNav.setActiveActions(["back"])
        : pod.polyNav.setActiveActions([]);
}

function updateTitle(pod, location) {
    let screenTitle;
    try {
        screenTitle = i18n.t(`navbarTitles:${location.pathname.substring(1)}`);
    } catch {
        screenTitle = i18n.t("navbarTitles:overview");
    }
    pod.polyNav.setTitle(screenTitle);
}

export const MembershipContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    function handleBack() {
        navigate(-1);
    }

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then((newPod) => {
            setPod(newPod);
        });
    }, []);

    //on navigation change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, handleBack, location);
        updateTitle(pod, location);
    }, [pod, location]);

    return (
        <MembershipContext.Provider
            value={{
                pod,
                handleBack,
            }}
        >
            {children}
        </MembershipContext.Provider>
    );
};
