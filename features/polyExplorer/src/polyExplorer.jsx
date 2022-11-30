import React, { useContext } from "react";
import {
    MemoryRouter as Router,
    Routes,
    Route,
    useNavigate,
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
    const { navigationState, popUp } = useContext(ExplorerContext);

    return (
        <div className="poly-explorer poly-theme poly-theme-dark">
            <Routes>
                <Route index />
                {/* <Redirect
                        to={{ pathname: "/main", state: navigationState }}
                    />
                </Route> */}
                <Route exact path="/main" element={<MainScreen />} />
                <Route
                    exact
                    path="/entity-details"
                    element={<EntityDetailsScreen />}
                />
                <Route
                    exact
                    path="/data-exploratio"
                    element={<DataExplorationScreen />}
                />
                <Route
                    exact
                    path="/entity-filters"
                    element={<EntityFilterScreen />}
                />
                <Route exact path="/search" element={<EntitySearchScreen />} />
                <Route
                    exact
                    path="/story/messenger-storyn"
                    element={<MessengerStory />}
                />
                <Route exact path="/story/messenger-story">
                    <MessengerStory />
                </Route>
                <Route
                    exact
                    path="/story/digital-giants-story"
                    element={<DigitalGiantsStory />}
                />
                <Route
                    exact
                    path="/story/example-storyn"
                    element={<ExampleStory />}
                />
            </Routes>
            {popUp &&
                popUp.component({
                    onClose: popUp.onClose,
                    content: popUp.content,
                    ...popUp.props,
                })}
        </div>
    );
};

const PolyExplorer = () => {
    //global history object
    const navigate = useNavigate();

    return (
        <Router navigate={navigate}>
            <ExplorerProvider>
                <PolyExplorerApp />
            </ExplorerProvider>
        </Router>
    );
};

export default PolyExplorer;
