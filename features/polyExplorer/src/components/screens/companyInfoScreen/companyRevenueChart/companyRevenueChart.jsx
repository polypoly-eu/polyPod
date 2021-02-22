import React from "react";

const CompanyRevenueChart = (company) => {
    //const [showTwoYears, setShowTwoYears] = useState(false);

    /*const handleShowTwoYearsChange = () => {
        setShowTwoYears(!showTwoYears);
    };*/

    return (
        <div>
            <p>Source: polyPedia</p>
            {company.name}
        </div>
    );
};

export default CompanyRevenueChart;
