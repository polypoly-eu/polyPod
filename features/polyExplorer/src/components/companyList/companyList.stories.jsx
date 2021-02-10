import React from "react";
import CompanyList from "./companyList";

const companyData = [
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
];

export default {
    title: "componentList",
    component: CompanyList,
};

export const populated = () => <CompanyList companies={companyData} />;
