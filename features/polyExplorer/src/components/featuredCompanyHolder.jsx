import React from "react";
import FeaturedCompany from "./featuredCompany.jsx";

const FeaturedCompanyHolder = ({ featuredCompanies }) => {
    let styles = {
        featuredCompanyCardContainer: {
            display: "flex",
            overflowX: "auto",
            flexWrap: "nowrap",
            margin: 16,
            marginTop: 32,
            position: "absolute",
            top: "10%",
            height: "80%",
            width: "100%",
            padding: "8px",
        },
    };

    return (
        <div style={styles.featuredCompanyCardContainer}>
            {featuredCompanies.map((company, index) => (
                <FeaturedCompany key={index} company={company} />
            ))}
        </div>
    );
};

export default FeaturedCompanyHolder;
