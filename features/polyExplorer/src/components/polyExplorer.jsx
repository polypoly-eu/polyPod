import React, { useState } from "react";
import FeaturedCompanyHolder from "./featuredCompanyHolder.jsx";
import CompanyList from "./companyList.jsx";

const PolyExplorer = () => {
    let [showFeatured, setShowFeatured] = useState(true);
    let [companyData, setCompanyData] = useState([
        {
            name: "BMW",
            featured: true,
        },
        {
            name: "IKEA",
            featured: true,
        },
        {
            name: "PayPal",
            featured: true,
        },
        {
            name: "Microsoft",
            featured: false,
        },
        {
            name: "Apple",
            featured: false,
        },
        {
            name: "Bayer",
            featured: true,
        },
        {
            name: "Audi",
            featured: false,
        },
        {
            name: "VW",
            featured: true,
        },
        {
            name: "Mercedes",
            featured: false,
        },
        {
            name: "Henkel",
            featured: false,
        },
    ]);
    let [featuredCompanyData, setFeaturedCompanyData] = useState(
        companyData.filter((e) => e.featured)
    );

    const handleShowFeatureChange = (bool) => {
        setShowFeatured(bool);
    };

    const getContent = () => {
        if (showFeatured)
            return (
                <FeaturedCompanyHolder
                    featuredCompanies={featuredCompanyData}
                />
            );
        else return <CompanyList companies={companyData} />;
    };

    let styles = {
        explorerContainer: {
            position: "absolute",
            backgroundColor: "#172553",
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
            backgroundColor: "#172553",
            width: "50%",
            height: "100%",
            fontSize: 32,
            color: "white",
            borderColor: "transparent",
            boxShadow: "4px 4px #0a1947",
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
            {getContent()}
        </div>
    );
};

export default PolyExplorer;
