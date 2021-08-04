import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
    withRouter,
} from "react-router-dom";

import {
    ImporterProvider,
    ImporterContext,
} from "./context/importer-context.jsx";

import "./components/facebook-import.js";
import "./components/explore-view.js";
import "./components/import-view.js";
import "./components/report-view.js";
import "./components/overview-view.js";

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";

const FacebookImporter = () => {
    const { pod, files } = useContext(ImporterContext);

    const renderSplash = () => {
        return <p>Loading ...</p>;
    };

    const handleImportFile = () => {};

    const handleExploreFile = () => {};

    const handleRemoveFile = () => {};

    return (
        <div className="facebook-importer">
            {pod ? (
                <Switch>
                    <Route exact path="/">
                        <Redirect to={{ pathname: "/overview" }} />
                    </Route>
                    <Route exact path="/overview">
                        <Overview />
                    </Route>
                    <Route exact path="/import">
                        <ImportView />
                    </Route>
                    <Route exact path="/remove">
                        <overview-view
                            pod={pod}
                            files={files}
                            import-file={handleImportFile}
                            remove-file={handleRemoveFile}
                            explore-file={handleExploreFile}
                        ></overview-view>
                    </Route>
                    <Route exact path="/explore">
                        <overview-view
                            pod={pod}
                            files={files}
                            import-file={handleImportFile}
                            remove-file={handleRemoveFile}
                            explore-file={handleExploreFile}
                        ></overview-view>
                    </Route>
                </Switch>
            ) : (
                renderSplash()
            )}
        </div>
    );
};

//Router and context
const FacebookImporterApp = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <ImporterProvider>
                <FacebookImporter />
            </ImporterProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<FacebookImporterApp />, document.getElementById("feature"));
