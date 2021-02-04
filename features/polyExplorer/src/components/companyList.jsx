import React, { useState } from "react";

const CompanyList = ({ companies }) => {
    let styles = {
        companyCardContainer: {
            display: "flex",
            overflowY: "auto",
            flexWrap: "wrap",
            marginTop: 32,
            position: "absolute",
            top: "10%",
            height: "80%",
            width: "98.5%",
            padding: "8px",
            alignItems: "center",
        },
        companyCard: {
            width: "800px",
            height: "15%",
            backgroundColor: "#34408e",
            boxShadow: "4px 4px #0a1947",
            color: "white",
            marginTop: "32px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "24px",
            padding: "32px",
        },
    };

    return (
        <div style={styles.companyCardContainer}>
            {companies.map((company) => (
                <div style={styles.companyCard}>
                    <p style={{ fontSize: "32px" }}>{company.name}</p>
                    <p style={{ fontSize: "28px" }}>
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
