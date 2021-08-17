import React, { useContext } from "react";
import RouteButton from "../../components/buttons/routeButton.jsx";
import { ImporterContext } from "../../context/importer-context.jsx";

import "./explore.css";

const AnalysisCard = ({ analysis }) => {
    return (
        <div className="analysis-card">
            <h1>{analysis.title}</h1>
            <p>{analysis.render()}</p>
        </div>
    );
};

const UnrecognizedCard = ({ unrecognizedData }) => {
    return (
        <div className="analysis-card unrecognized-analysis-card">
            <h1>Unrecognised and Missing Data</h1>
            <p>{unrecognizedData.report}</p>
            <RouteButton route="/report" className="report-button">
                View&Send Report
            </RouteButton>
        </div>
    );
};

const ExploreView = () => {
    const { fileAnalysis } = useContext(ImporterContext);

    const renderFileAnalyses = () => {
        if (!fileAnalysis) {
            return "";
        }
        return (
            <div>
                <UnrecognizedCard
                    unrecognizedData={fileAnalysis.unrecognizedData}
                />
                {fileAnalysis.analyses.map((analysis, index) => (
                    <AnalysisCard analysis={analysis} key={index} />
                ))}
            </div>
        );
    };

    return (
        <div className="explore-view">
            <h1>Explore your data</h1>
            {renderFileAnalyses()}
        </div>
    );
};

export default ExploreView;
