import React, { useState } from "react";
import FeaturedCompanyHolder from "../featuredCompanyHolder/featuredCompanyHolder.jsx";
import CompanyList from "../companyList/companyList.jsx";
import makeExampleData from "../dataViz/makeExampleData.jsx";

const PolyExplorer = () => {
    const [showFeatured, setShowFeatured] = useState(true);
    const [companyData] = useState(makeExampleData());
    const [featuredCompanyData] = useState(
        companyData.filter((e) => e.featured)
    );

    console.log(companyData);

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

    const styles = {
        explorerContainer: {
            position: "absolute",
            backgroundColor: "#0F1938",
            width: "100%",
            height: "100%",
            overflow: "hidden",
        },
        companyButtonContainer: {
            position: "absolute",
            height: "10%",
            width: "100%",
        },
        companyButton: {
            backgroundColor: "#0F1938",
            width: "50%",
            height: "100%",
            fontSize: 16,
            color: "white",
            borderColor: "transparent",
        },
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
