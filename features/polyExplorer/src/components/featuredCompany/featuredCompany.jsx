import React from "react";
import { default as stylesArray } from "./featuredCompanyStyle.json";

const FeaturedCompany = ({ company }) => {
    const styles = stylesArray[0];
    console.log(company);

    const getContentButtons = () => {
        if (company.jurisdictions === undefined)
            return (
                <div style={styles.contentButtonHolder}>
                    <button style={styles.dataSharedButton}>
                        shares {company.dataTypesShared.length} datatypes
                    </button>
                    <button style={styles.purposesSharedButton}>
                        for {company.dataSharingPurposes.length} purposes
                    </button>
                    <button style={styles.companiesSharedButton}>
                        with {company.sharedWithCompanies.length} companies
                    </button>
                    <button style={styles.jurisdictionsSharedButton}>
                        in X jurisdictions
                    </button>
                </div>
            );
        return (
            <div style={styles.contentButtonHolder}>
                <button style={styles.dataSharedButton}>
                    shares {company.dataTypesShared.length} datatypes
                </button>
                <button style={styles.purposesSharedButton}>
                    for {company.dataSharingPurposes.length} purposes
                </button>
                <button style={styles.companiesSharedButton}>
                    with {company.sharedWithCompanies.length} companies
                </button>
                <button style={styles.jurisdictionsSharedButton}>
                    in {company.jurisdictions.children.length} jurisdictions
                </button>
            </div>
        );
    };

    return (
        <div style={styles.companyCard}>
            <h2 style={styles.companyName}>{company.name}</h2>
            <p style={styles.companyText}>Company Information</p>
            {getContentButtons()}
        </div>
    );
};

export default FeaturedCompany;
