import React, { useEffect, useState } from "react";

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

export const MembershipContextProvider = ({ children }) => {
    const [pod, setPod] = useState(null);
    const location = useLocation();
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
        updatePodNavigation(pod, navigate, handleBack, location);
    });

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
