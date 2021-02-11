import React from "react";
import { default as stylesArray } from "./companyListStyles.json";

const CompanyList = ({ companies }) => {
    const styles = stylesArray[0];
    return (
        <div style={styles.companyCardContainer}>
            {companies.map((company, index) => (
                <div key={index} style={styles.companyCard}>
                    <p style={styles.companyName}>{company.name}</p>
                    <p style={styles.companyText}>
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
