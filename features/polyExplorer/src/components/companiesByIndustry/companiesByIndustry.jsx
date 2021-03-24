import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";

import "./companiesByIndustry.css";

function CompaniesByIndustry({ companies }) {
    const industryMap = {};
    for (let company of companies) {
        const industry =
            company.industryCategory?.name[i18n.language] ||
            i18n.t("common:category.undisclosed");
        if (!industryMap[industry]) industryMap[industry] = [];
        industryMap[industry].push(company);
    }

    return (
        <div className="companies-by-industry">
            {Object.entries(industryMap).map(([industry, companies], index) => (
                <div key={index} className="companies-by-industry-group">
                    <hr />
                    <h1>
                        {industry} ({companies.length})
                    </h1>
                    {companies.map((company, index) => (
                        <CompanyShortInfo key={index} company={company} />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default CompaniesByIndustry;
