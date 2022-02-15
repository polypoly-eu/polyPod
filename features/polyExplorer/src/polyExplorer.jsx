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
import EntityDetailsScreen from "./screens/entityDetails/entityDetails.jsx";

//stories
import MessengerStory from "./screens/stories/messengerStory.jsx";
import ExampleStory from "./screens/stories/exampleStory.jsx";
import DigitalGiantsStory from "./screens/stories/digitalGiantsStory.jsx";

const PolyExplorerApp = () => {
    return (
        <div className="poly-explorer poly-theme poly-theme-dark">
            <Switch>
                <Route exact path="/">
                    <RedirectToMain />
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
            <Popup />
        </div>
    );
};

const RedirectToMain = () => {
    const { navigationState } = useContext(ExplorerContext);
    return <Redirect to={{ pathname: "/main", state: navigationState }} />;
};

const Popup = () => {
    const { popUp } = useContext(ExplorerContext);

    if (!popUp) {
        return null;
    }

    return popUp.component({
        onClose: popUp.onClose,
        content: popUp.content,
        ...popUp.props,
    });
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
