import React, { useEffect, useState } from "react";

import i18n from "!silly-i18n";
import { useHistory, useLocation } from "react-router-dom";
import {
    sparqleInsertTemplate,
    jsObjectToTriplesString,
} from "@polypoly-eu/poly-sparql";

import popUps from "../popUps";

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

    function createPopUp({ type }) {
        setPopUp({ component: popUps[type] });
    }

    function closePopUp() {
        setPopUp(null);
    }

    function handleBack() {
        if (popUp) return setPopUp(null);
        history.length > 1 && history.goBack();
    }

    const initPod = async () => await window.pod;

    //on startup
    useEffect(() => {
        initPod().then(async (newPod) => {
            setPod(newPod);
            const a = {
                a: 1,
                b: "b",
                c: 3.5,
            };
            const { polyIn } = window.pod;
            const query = sparqleInsertTemplate({
                triples: jsObjectToTriplesString(
                    "<file://123>",
                    "poly:test",
                    a
                ),
            });
            console.log(query);
            await polyIn.update(query);
            const triples = await polyIn.query(
                "SELECT ?s ?p ?o WHERE { ?s ?p ?o }"
            );
            console.log(triples);
        });
    }, []);

    //on history change
    useEffect(() => {
        if (!pod) return;
        updatePodNavigation(pod, history, handleBack, location);
        updateTitle(pod, location, popUp);
    });

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
                createPopUp,
                closePopUp,
            }}
        >
            {children}
        </ImporterContext.Provider>
    );
};
