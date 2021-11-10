import React from "react";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import Scrollable from "../../components/scrollable/scrollable.jsx";

import "./companyIndustryList.css";

// This component is currently slowing down the entire data exploration when
// there are a lot of data recipients. As a temporary fix, we render a more
// economical element for each company when the list is large.
const CompanyItem = ({ company, ecoMode }) =>
    ecoMode ? (
        <div className="company-industry-list-eco-item">{company.name}</div>
    ) : (
        <CompanyShortInfo company={company} />
    );

class CompanyIndustryList extends React.PureComponent {
    render() {
        return (
            <Scrollable>
                <div className="company-industry-list">
                    {Object.entries(this.props.companyIndustryMap).map(
                        ([industry, companies], index) => (
                            <div
                                key={index}
                                className="company-industry-list-group"
                            >
                                <hr />
                                <h1>
                                    {industry} ({companies.length})
                                </h1>
                                {companies.map((company, index) => (
                                    <CompanyItem
                                        key={index}
                                        company={company}
                                        ecoMode={this.props.ecoItems}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>
            </Scrollable>
        );
    }
}

export default CompanyIndustryList;
