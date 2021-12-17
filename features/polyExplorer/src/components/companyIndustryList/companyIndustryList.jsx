import React from "react";
import EntityList from "../entityList/entityList.jsx";
import Scrollable from "../../components/scrollable/scrollable.jsx";

import "./companyIndustryList.css";

// This component is, at this point, a workaround to not slow down the entire
// data exploration when there are a lot of data recipients. While we do use the
// EntityList component that supports infinite scrolling, the (re)loading logic
// is currently not good enough for this use case - it still loads way too many
// entries initially. Hence this workaround with the more economical list
// entries.
class CompanyIndustryList extends React.PureComponent {
    render() {
        if (!this.props.ecoItems)
            return <EntityList entityGroups={this.props.companyIndustryMap} />;

        return (
            <Scrollable className="eco-company-industry-list">
                {Object.entries(this.props.companyIndustryMap).map(
                    ([industry, companies], index) => (
                        <div
                            key={index}
                            className="eco-company-industry-list-group"
                        >
                            <hr />
                            <h1>
                                {industry} ({companies.length})
                            </h1>
                            {companies.map((company, index) => (
                                <div
                                    key={index}
                                    className="eco-company-industry-list-item"
                                >
                                    {company.name}
                                </div>
                            ))}
                        </div>
                    )
                )}
            </Scrollable>
        );
    }
}

export default CompanyIndustryList;
