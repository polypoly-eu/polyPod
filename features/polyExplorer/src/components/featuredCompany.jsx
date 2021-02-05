import React from "react";

const FeaturedCompany = ({ company }) => {
    const styles = {
        companyCard: {
            minWidth: "800px",
            height: "94%",
            backgroundColor: "#34408e",
            boxShadow: "4px 4px #0a1947",
            color: "white",
            margin: "16px",
            marginLeft: "32px",
            borderRadius: "24px",
            padding: "32px",
        },
        companyName: {
            color: "white",
            fontSize: "48px",
            textAlign: "center",
        },
        companyText: { fontSize: "32px" },
    };

    return (
        <div style={styles.companyCard}>
            <h2 style={styles.companyName}>{company.name}</h2>
            <p style={styles.companyText}>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est Lorem ipsum dolor sit amet.
            </p>
        </div>
    );
};

export default FeaturedCompany;
