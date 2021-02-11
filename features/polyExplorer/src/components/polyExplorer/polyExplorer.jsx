import React, { useState } from "react";
import FeaturedCompanyHolder from "../featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../companyList/companyList.jsx";
import makeExampleData from "../dataViz/makeExampleData.jsx";
import { default as stylesArray } from "./polyExplorerStyles.json";

const PolyExplorer = () => {
    const [showFeatured, setShowFeatured] = useState(true);
    const [companyData] = useState(makeExampleData());
    const [featuredCompanyData] = useState(
        companyData.filter((e) => e.featured)
    );
    const styles = stylesArray[0];

    const handleShowFeatureChange = (featured) => {
        setShowFeatured(featured);
    };

    const getTabContent = () => {
        if (showFeatured)
            return (
                <FeaturedCompanyHolder
                    featuredCompanies={featuredCompanyData}
                />
            );
        return <CompanyList companies={companyData} />;
    };

    return (
        <div className="explorer-background" style={styles.explorerContainer}>
            <div style={styles.companyButtonContainer}>
                <button
                    onClick={() => handleShowFeatureChange(true)}
                    style={styles.companyButton}
                >
                    Featured Companies
                </button>
                <button
                    onClick={() => handleShowFeatureChange(false)}
                    style={styles.companyButton}
                >
                    All companies
                </button>
            </div>
            {getTabContent()}
        </div>
    );
};

export default PolyExplorer;
