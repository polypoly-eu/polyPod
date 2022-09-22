import React, { useEffect, useState } from "react";
import i18n from "!silly-i18n";

import { useNavigate, useLocation } from "react-router-dom";

export const MembershipContext = React.createContext();

function updatePodNavigation(pod, navigate, handleBack, location) {
    pod.polyNav.actions = {
        back: () => handleBack(),
    };
    navigate.length > 1 && location.pathname !== "/onboarding"
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
    const podLocation = useLocation();
    const navigate = useNavigate();

    function handleBack() {
        navigate.length > 1 && navigate(-1);
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
        updatePodNavigation(pod, navigate, handleBack, podLocation);
        updateTitle(pod, podLocation);
    }, [pod, podLocation]);

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
