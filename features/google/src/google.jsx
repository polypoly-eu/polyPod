import React, { useContext } from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
} from "react-router-dom";

import { GoogleContextProvider } from "./context/google-context.jsx";

import Overview from "./views/overview/overview.jsx";
import ImportView from "./views/import/import.jsx";

import "./styles.css";

const Google = () => {
    const renderSplash = () => "Loading";

    return (
        <div className="google poly-theme poly-theme-dark">
            {pod ? (
                <Switch>
                    <Route exact path="/">
                        <Redirect to={{ pathname: "/import" }} />
                    </Route>
                    <Route exact path="/overview">
                        <Overview />
                    </Route>
                    <Route exact path="/import">
                        <ImportView />
                    </Route>
                </Switch>
            ) : (
                renderSplash()
            )}
        </div>
    );
};

//Router and context
const GoogleApp = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <GoogleContextProvider>
                <div className="poly-nav-bar-separator-overlay" />
                <Google />
            </GoogleContextProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<GoogleApp />, document.getElementById("feature"));
