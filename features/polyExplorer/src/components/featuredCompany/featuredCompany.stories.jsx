import React from "react";
import FeaturedCompany from "./featuredCompany";

const featuredCompany = {
    name: "BMW",
    featured: true,
};

export default {
    title: "featuredCompany",
    component: FeaturedCompany,
};

export const populated = () => <FeaturedCompany company={featuredCompany} />;
