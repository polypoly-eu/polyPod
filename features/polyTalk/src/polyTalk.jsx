import React from "react";
import * as ReactDOM from "react-dom";
import {
    MemoryRouter as Router,
    Switch,
    Redirect,
    Route,
    useHistory,
} from "react-router-dom";
import Home from "./views/home.jsx";
import "./styles.css";
import { MessagesContextProvider } from "./context/messages.jsx";

const PolyTalk = () => {
    return (
        <div className="poly-talk poly-theme poly-theme-dark">
            <Switch>
                <Route exact path="/">
                    <Redirect to={{ pathname: "/home" }} />
                </Route>
                <Route exact path="/home">
                    <Home />
                </Route>
            </Switch>
        </div>
    );
};

//Router and context
const PolyTalkApp = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <MessagesContextProvider>
                <div className="poly-nav-bar-separator-overlay" />
                <PolyTalk />
            </MessagesContextProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<PolyTalkApp />, document.getElementById("feature"));
