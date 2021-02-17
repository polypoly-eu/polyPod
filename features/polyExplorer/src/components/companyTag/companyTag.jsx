import React from "react";
import "./companyTag.css";

const CompanyHead = ({ company }) => {
    return (
        <button className="company-tag">
            <div className="company-logo"></div>
            <div className="company-info">
                <p className="company-name">{company.name}</p>
                <div className="company-location">
                    <div className="location-icon">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="20"
                            viewBox="0 0 24 24"
                            width="20"
                        >
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path
                                fill="white"
                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                            />
                        </svg>
                    </div>
                    <p className="location-name">{company.location}</p>
                </div>
            </div>
        </button>
    );
};

export default CompanyHead;
