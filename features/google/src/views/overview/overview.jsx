import React, { useContext } from "react";
import { PolyImportContext } from "@polypoly-eu/poly-look";
import { useHistory } from "react-router-dom";

const Overview = () => {
    const { account, handleRemoveFile, files, refreshFiles } =
        useContext(PolyImportContext);
    const history = useHistory();

    function onRemoveFile() {
        if (!files && files.length > 0) return;
        handleRemoveFile(files[0]?.id);
        refreshFiles();
        history.push("/import");
    }

    return (
        <div className="overview">
            Explore
            <div>
                <h1>Activities</h1>
                {account?.activities.map((activity, i) => (
                    <div key={i}>{activity.timestamp.toUTCString()}</div>
                ))}
            </div>
            <div>
                <h1>Place Visits</h1>
                {account?.placeVisits.map((placeVisit, i) => (
                    <div key={i}>{placeVisit.timestamp.toUTCString()}</div>
                ))}
            </div>
            <div>
                <h1>Activity segments</h1>
                {account?.activitySegments.map((activitySegment, i) => (
                    <div key={i}>{activitySegment.timestamp.toUTCString()}</div>
                ))}
            </div>
            <button onClick={onRemoveFile}>Remove file</button>
        </div>
    );
};

export default Overview;
