import React, { useContext, useEffect, useRef, useState } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./explore.css";

const AnalysisCard = ({
    analysis,
    setActiveDetails,
    exploreScrollingProgress,
}) => {
    return (
        <div className="analysis-card">
            <h1>{analysis.title}</h1>
            <div>{analysis.renderSummary()}</div>
            {analysis.renderDetails ? (
                <RouteButton
                    route="/explore/details"
                    className="details-button"
                    onClick={() => setActiveDetails(analysis)}
                    stateChange={{ exploreScrollingProgress }}
                >
                    View details
                </RouteButton>
            ) : null}
        </div>
    );
};

const UnrecognizedCard = ({ unrecognizedData }) => {
    return (
        <div className="analysis-card unrecognized-analysis-card">
            <div className="unrecognized-analysis-title">
                <div className="alert-fake-icon">!</div>
                <h1>Unrecognised and Missing Data</h1>
            </div>
            <p>{unrecognizedData.report}</p>
            <RouteButton route="/report" className="report-button">
                View and send report
            </RouteButton>
        </div>
    );
};

const ExploreView = () => {
    const { navigationState, fileAnalysis, setActiveDetails } =
        useContext(ImporterContext);

    const [scrollingProgress, setScrollingProgress] = useState(
        navigationState.exploreScrollingProgress
    );
    const exploreRef = useRef();

    const renderFileAnalyses = () => {
        if (!fileAnalysis) {
            return (
                <div>
                    <p>Analyzing your data ...</p>
                    <p>
                        If this takes more than a few seconds - or for large
                        data sets maybe minutes - please report this as an issue
                        - there was likely an error.
                    </p>
                </div>
            );
        }
        return (
            <div>
                <UnrecognizedCard
                    unrecognizedData={fileAnalysis.unrecognizedData}
                />
                {fileAnalysis.analyses.map((analysis, index) => (
                    <AnalysisCard
                        analysis={analysis}
                        key={index}
                        setActiveDetails={setActiveDetails}
                        exploreScrollingProgress={scrollingProgress}
                    />
                ))}
            </div>
        );
    };

    const saveScrollingProgress = (e) => {
        setScrollingProgress(e.target.scrollTop);
    };

    useEffect(() => {
        exploreRef.current.scrollTo(0, scrollingProgress);
    }, []);

    return (
        <div
            ref={exploreRef}
            className="explore-view"
            onScroll={saveScrollingProgress}
        >
            <h1 className="explore-view-title">Explore your data</h1>
            {renderFileAnalyses()}
        </div>
    );
};

export default ExploreView;
