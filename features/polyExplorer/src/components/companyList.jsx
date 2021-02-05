import React from "react";

const CompanyList = ({ companies }) => {
    const styles = {
        companyCardContainer: {
            display: "flex",
            overflowY: "auto",
            flexWrap: "wrap",
            marginTop: 12,
            position: "absolute",
            top: "10%",
            height: "80%",
            width: "98.5%",
            alignItems: "center",
        },
        companyCard: {
            width: "260px",
            height: "130px",
            backgroundColor: "#34408e",
            boxShadow: "4px 4px #0a1947",
            color: "white",
            marginTop: "22px",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "24px",
            padding: "32px",
            paddingTop: 0
        },
        companyName: {
            fontSize: "22px",
        },
        companyText: {
            fontSize: "14px",
        },
    };

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
