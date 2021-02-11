import React from "react";
import { default as stylesArray } from "./featuredCompanyStyle.json";

const FeaturedCompany = ({ company }) => {
    const styles = stylesArray[0];

    return (
        <div style={styles.companyCard}>
            <h2 style={styles.companyName}>{company.name}</h2>
            <p style={styles.companyText}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
            </p>
            <button></button>
        </div>
    );
};

export default FeaturedCompany;
