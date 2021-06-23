import React from "react";
import CompanyShortInfo from "../companyShortInfo/companyShortInfo.jsx";
import Scrollable from "../../components/scrollable/scrollable.jsx";
import { useHistory } from "react-router";

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

const CompanyIndustryList = ({
    companyIndustryMap,
    ecoItems,
    activeExplorationIndex,
}) => {
    const history = useHistory();

    const saveActiveIndex = () => {
        history.location.state.explorationState.index = activeExplorationIndex;
    };

    return (
        <Scrollable>
            <div className="company-industry-list" onClick={saveActiveIndex}>
                {Object.entries(companyIndustryMap).map(
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
                                    ecoMode={ecoItems}
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
        </Scrollable>
    );
};

export default CompanyIndustryList;
