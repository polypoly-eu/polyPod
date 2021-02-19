import React from "react";
//import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx"

const CompanyInfo = ({ company, onShowScreenChange }) => {
    return (
        <div className="explorer-container">
            <button onClick={() => onShowScreenChange("start", undefined)}>
                X
            </button>
            {company.name}
        </div>
    );
};

export default CompanyInfo;
