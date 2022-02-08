import OnboardingPopup from "../components/onboardingPopup/onboardingPopup.jsx";
import PurposeInfoPopup from "./centerBox/centerBox.jsx";

import InfoScreen from "./infoPopUps/info/info.jsx";
import DataRegionInfoScreen from "./infoPopUps/dataRegionInfo/dataRegionInfo.jsx";
import DataTypesInfoScreen from "./infoPopUps/dataTypesInfo/dataTypesInfo.jsx";
import CategoryInfoScreen from "./infoPopUps/categoryInfo/categoryInfo.jsx";
import CorrelationInfoScreen from "./infoPopUps/correlationInfo/correlationInfo.jsx";
import PurposeInfoScreen from "./infoPopUps/purposeInfo/purposeInfo.jsx";
import CompaniesInfoScreen from "./infoPopUps/companiesInfo/companiesInfo.jsx";
import JurisdictionInfoScreen from "./infoPopUps/jurisdictionInfo/jurisdictionInfo.jsx";
import FeaturedEntityInfoScreen from "./infoPopUps/featuredEntityInfo/featuredEntityInfo.jsx";
import DetailsLineChartInfo from "./infoPopUps/detailsLineChartInfo/detailsLineChartInfo.jsx";
import CompanyDataTypesInfo from "./infoPopUps/dataTypesMatrixInfo/companyDataTypesInfo.jsx";
import SharesDataTypesInfo from "./infoPopUps/dataTypesMatrixInfo/sharesDataTypesInfo.jsx";
import TypesDataTypesInfo from "./infoPopUps/dataTypesMatrixInfo/typesDataTypesInfo.jsx";
import IndustriesPackedCircleInfo from "./infoPopUps/industriesPackedCircleInfo/industriesPackedCircleInfo.jsx";
import PurposesBarChartInfo from "./infoPopUps/barChartInfo/purposesBarChartInfo.jsx";
import OverviewBarChartInfo from "./infoPopUps/barChartInfo/overviewBarChartInfo.jsx";
import DataRegionsDiagramInfo from "./infoPopUps/dataRegionsDiagramInfo/dataRegionsDiagramInfo.jsx";
import DetailsTreemapInfo from "./infoPopUps/detailsTreemapInfo/detailsTreemapInfo.jsx";
import CompaniesBarChartInfo from "./infoPopUps/barChartInfo/companiesBarChartInfo.jsx";
import CompanyRevenueBarChartInfo from "./infoPopUps/companyRevenueBarChartInfo/companyRevenueBarChartInfo.jsx";

export default {
    "onboarding-popup": OnboardingPopup,
    "center-popup": PurposeInfoPopup,

    "info-main": InfoScreen,
    "data-region-info": DataRegionInfoScreen,
    "data-types-info": DataTypesInfoScreen,
    "category-info": CategoryInfoScreen,
    "correlation-info": CorrelationInfoScreen,
    "purpose-info": PurposeInfoScreen,
    "companies-info": CompaniesInfoScreen,
    "jurisdiction-info": JurisdictionInfoScreen,
    "featured-entity-info": FeaturedEntityInfoScreen,
    "details-line-chart-info": DetailsLineChartInfo,
    "company-data-types-info": CompanyDataTypesInfo,
    "shares-data-types-info": SharesDataTypesInfo,
    "types-data-types-info": TypesDataTypesInfo,
    "industries-packed-circle-info": IndustriesPackedCircleInfo,
    "purposes-bar-chart-info": PurposesBarChartInfo,
    "overview-bar-chart-info": OverviewBarChartInfo,
    "data-regions-diagram-info": DataRegionsDiagramInfo,
    "details-treemap-info": DetailsTreemapInfo,
    "companies-bar-chart-info": CompaniesBarChartInfo,
    "company-revenue-info": CompanyRevenueBarChartInfo,
};
