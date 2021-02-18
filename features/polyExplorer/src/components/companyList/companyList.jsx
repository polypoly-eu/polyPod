import React from "react";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import "./companyList.css";

const CompanyList = ({ companies }) => {
    return (
        <div className="company-list">
            {companies.map((company, index) => (
                <CompanyShortInfo key={index} company={company} />
            ))}
        </div>
    );
};

export default CompanyList;
