import React from "react";
import CompanyShortInfo from "./companyShortInfo.jsx";

const company = {
    name: "Amazon Europe Core SARL",
    location: "Luxemburg, LU",
};

export default {
    title: "CompanyShortInfo",
    component: CompanyShortInfo,
};

export const populated = () => <CompanyShortInfo company={company} />;
