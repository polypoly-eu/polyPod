import React from "react";
import FeaturedCompany from "../featuredCompany/featuredCompany.jsx";
import "./featuredCompanyHolder.css";

const FeaturedCompanyHolder = ({ featuredCompanies, onShowScreenChange }) => {
    return (
        <div className="featured-company-card-container">
            {featuredCompanies.map((company, index) => (
                <FeaturedCompany
                    key={index}
                    company={company}
                    onShowScreenChange={onShowScreenChange}
                />
            ))}
        </div>
    );
};

export default FeaturedCompanyHolder;
