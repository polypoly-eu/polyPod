import React, { useContext } from "react";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
} from "react-router-dom";
import {
    ExplorerProvider,
    ExplorerContext,
} from "./context/explorer-context.jsx";

import MainScreen from "./screens/main/main.jsx";
import DataExplorationScreen from "./screens/dataExploration/dataExploration.jsx";
import EntityFilterScreen from "./screens/entityFilter/entityFilter.jsx";
import EntitySearchScreen from "./screens/entitySearch/entitySearch.jsx";
import InfoScreen from "./screens/info/info.jsx";
import EntityDetailsScreen from "./screens/entityDetails/entityDetails.jsx";
import DataRegionInfoScreen from "./screens/dataRegionInfo/dataRegionInfo.jsx";
import DataTypesInfoScreen from "./screens/explorationInfo/dataTypesInfo/dataTypesInfo.jsx";
import CategoryInfoScreen from "./screens/explorationInfo/categoryInfo/categoryInfo.jsx";
import CorrelationInfoScreen from "./screens/explorationInfo/correlationInfo/correlationInfo.jsx";
import PurposeInfoScreen from "./screens/explorationInfo/purposeInfo/purposeInfo.jsx";
import CompaniesInfoScreen from "./screens/explorationInfo/companiesInfo/companiesInfo.jsx";
import JurisdictionInfoScreen from "./screens/explorationInfo/jurisdictionInfo/jurisdictionInfo.jsx";
import FeaturedEntityInfoScreen from "./screens/featuredEntityInfo/featuredEntityInfo.jsx";
import OnboardingPopup from "./components/onboardingPopup/onboardingPopup.jsx";

//stories
import MessengerStory from "./screens/stories/messengerStory.jsx";
import ExampleStory from "./screens/stories/exampleStory.jsx";
import DigitalGiantsStory from "./screens/stories/digitalGiantsStory.jsx";

const PolyExplorerApp = () => {
    const {
        navigationState,
        handleOnboardingPopupClose,
        handleOnboardingPopupMoreInfo,
    } = useContext(ExplorerContext);
    const { firstRun } = navigationState;

    return (
        <div className="poly-explorer poly-theme poly-theme-dark">
            <Switch>
                <Route exact path="/">
                    <Redirect
                        to={{ pathname: "/main", state: navigationState }}
                    />
                </Route>
                <Route exact path="/main">
                    <MainScreen />
                </Route>
                <Route exact path="/entity-details">
                    <EntityDetailsScreen />
                </Route>
                <Route exact path="/data-exploration">
                    <DataExplorationScreen />
                </Route>
                <Route exact path="/entity-filters">
                    <EntityFilterScreen />
                </Route>
                <Route exact path="/search">
                    <EntitySearchScreen />
                </Route>
                <Route exact path="/featured-entity-info">
                    <FeaturedEntityInfoScreen />
                </Route>
                <Route exact path="/info">
                    <InfoScreen />
                </Route>
                <Route exact path="/data-region-info">
                    <DataRegionInfoScreen />
                </Route>
                <Route exact path="/data-types-info">
                    <DataTypesInfoScreen />
                </Route>
                <Route exact path="/data-category-info">
                    <CategoryInfoScreen />
                </Route>
                <Route exact path="/data-correlation-info">
                    <CorrelationInfoScreen />
                </Route>
                <Route exact path="/purpose-info">
                    <PurposeInfoScreen />
                </Route>
                <Route exact path="/companies-info">
                    <CompaniesInfoScreen />
                </Route>
                <Route exact path="/jurisdiction-info">
                    <JurisdictionInfoScreen />
                </Route>
                <Route exact path="/story/messenger-story">
                    <MessengerStory />
                </Route>
                <Route exact path="/story/digital-giants-story">
                    <DigitalGiantsStory />
                </Route>
                <Route exact path="/story/example-story">
                    <ExampleStory />
                </Route>
            </Switch>
            {firstRun ? (
                <OnboardingPopup
                    onClose={handleOnboardingPopupClose}
                    onMoreInfo={handleOnboardingPopupMoreInfo}
                />
            ) : null}
        </div>
    );
};

const PolyExplorer = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <ExplorerProvider>
                <PolyExplorerApp />
            </ExplorerProvider>
        </Router>
    );
};

export default PolyExplorer;
