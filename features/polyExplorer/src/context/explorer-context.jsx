import React, { useContext, useEffect, useState } from "react";
import { pod } from "../fakePod.js";

//constants
const namespace = "http://polypoly.coop/schema/polyExplorer/#";

export const ExplorerContext = React.createContext();

async function readFirstRun() {
    const quads = await pod.polyIn.select({});
    return !quads.some(
        ({ subject, predicate, object }) =>
            subject.value === `${namespace}polyExplorer` &&
            predicate.value === `${namespace}firstRun` &&
            object.value === `${namespace}false`
    );
}

async function writeFirstRun(firstRun) {
    const { dataFactory, polyIn } = pod;
    const quad = dataFactory.quad(
        dataFactory.namedNode(`${namespace}polyExplorer`),
        dataFactory.namedNode(`${namespace}firstRun`),
        dataFactory.namedNode(`${namespace}${firstRun}`)
    );
    polyIn.add(quad);
}

export const ExplorerProvider = ({ children }) => {
    const [firstRun, setFirstRun] = useState(false);

    function handleOnboardingPopupClose() {
        setFirstRun(false);
        writeFirstRun(false);
    }

    function handleOnboardingPopupMoreInfo() {
        handleOnboardingPopupClose();
        handleActiveScreenChange("info");
    }

    //firstRun use
    useEffect(() => {
        setTimeout(() => readFirstRun().then(setFirstRun), 300);
    }, []);

    return (
        <ExplorerContext.Provider
            value={{
                firstRun,
                handleOnboardingPopupClose,
                handleOnboardingPopupMoreInfo,
            }}
        >
            {children}
        </ExplorerContext.Provider>
    );
};
