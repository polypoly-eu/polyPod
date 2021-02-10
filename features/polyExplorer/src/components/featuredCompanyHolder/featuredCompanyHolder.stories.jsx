import React from "react";
import FeaturedCompanyHolder from "./featuredCompanyHolder";

const featuredCompanies = [
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
];

export default {
    title: "featuredCompanyHolder",
    component: FeaturedCompanyHolder,
};

export const populated = () => (
    <FeaturedCompanyHolder featuredCompanies={featuredCompanies} />
);
