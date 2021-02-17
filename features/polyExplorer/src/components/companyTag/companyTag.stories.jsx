import React from "react";
import CompanyTag from "./companyTag.jsx";

const company = {
    name: "Amazon Europe Core SARL",
    location: "Luxemburg, LU",
};

export default {
    title: "CompanyTag",
    component: CompanyTag,
};

export const populated = () => <CompanyTag company={company} />;
