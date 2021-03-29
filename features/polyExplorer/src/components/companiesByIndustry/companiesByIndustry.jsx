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

function CompanyItem({ company, companyCount }) {
    // This component is currently slowing down the entire data exploration when
    // there are a lot of data recipients. As a temporary fix, we render a more
    // economical element for each company when the list is large.
    if (companyCount > 100)
        return (
            <div className="companies-by-industry-eco-item">{company.name}</div>
        );
    return <CompanyShortInfo company={company} />;
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
                                <CompanyItem
                                    key={index}
                                    company={company}
                                    companyCount={this.props.companies.length}
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
