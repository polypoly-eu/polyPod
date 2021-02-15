import React from "react";
import "./companyList.css";

const CompanyList = ({ companies }) => {
    return (
        <div className="company-card-container">
            {companies.map((company, index) => (
                <div key={index} className="company-card">
                    <p className="company-name">{company.name}</p>
                    <p className="company-text">
                        Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
                        sed diam nonumy eirmod tempor invidunt ut labore et
                        dolore magna aliquyam erat, sed diam voluptua.
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CompanyList;
