import React from "react";
import FeaturedCompany from "../featuredCompany/featuredCompany.jsx";
import { default as stylesArray } from "./featuredCompanyHolderStyle.json";

const FeaturedCompanyHolder = ({ featuredCompanies }) => {
    const styles = stylesArray[0];

    return (
        <div style={styles.featuredCompanyCardContainer}>
            {featuredCompanies.map((company, index) => (
                <FeaturedCompany key={index} company={company} />
            ))}
        </div>
    );
};

export default FeaturedCompanyHolder;
