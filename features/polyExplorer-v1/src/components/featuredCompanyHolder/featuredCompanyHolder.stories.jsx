import React from "react";
import FeaturedCompanyHolder from "./featuredCompanyHolder";
import makeExampleData from "../dataViz/makeExampleData";

const featuredCompanies = makeExampleData();

export default {
    title: "featuredCompanyHolder",
    component: FeaturedCompanyHolder,
};

export const populated = () => (
    <FeaturedCompanyHolder featuredCompanies={featuredCompanies} />
);
