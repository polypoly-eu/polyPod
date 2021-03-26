import React from "react";
import i18n from "../../i18n.js";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";

import "./companiesByIndustry.css";

function buildIndustryMap(companies) {
    const map = {};
    for (let company of companies) {
        const industry =
            company.industryCategory?.name[i18n.language] ||
            i18n.t("common:category.undisclosed");
        if (!map[industry]) map[industry] = [];
        map[industry].push(company);
    }
    return map;
}

class CompaniesByIndustry extends React.PureComponent {
    render() {
        const industryMap = buildIndustryMap(this.props.companies);
        return (
            <div className="companies-by-industry">
                {Object.entries(industryMap).map(
                    ([industry, companies], index) => (
                        <div
                            key={index}
                            className="companies-by-industry-group"
                        >
                            <hr />
                            <h1>
                                {industry} ({companies.length})
                            </h1>
                            {companies.map((company, index) => (
                                <CompanyShortInfo
                                    key={index}
                                    company={company}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        );
    }
}

export default CompaniesByIndustry;
