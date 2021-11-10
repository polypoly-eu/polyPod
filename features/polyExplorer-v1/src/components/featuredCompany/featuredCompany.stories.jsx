import React from "react";
import FeaturedCompany from "./featuredCompany";
import makeExampleData from "../dataViz/makeExampleData";

const companyData = makeExampleData();

export default {
    title: "featuredCompany",
    component: FeaturedCompany,
};

export const populated = () => <FeaturedCompany company={companyData[0]} />;
