import React, { useState } from "react";
import { Route } from "react-router-dom";
import ReportDetails from "./details.jsx";
import ReportView from "./report.jsx";

const ReportWrapper = () => {
    const [reportStories, setReportStories] = useState(null);
    return (
        <div>
            <Route exact path="/report">
                <ReportView
                    reportStories={reportStories}
                    setReportStories={setReportStories}
                />
            </Route>
            <Route exact path="/report/details">
                <ReportDetails reportStories={reportStories} />
            </Route>
        </div>
    );
};

export default ReportWrapper;
