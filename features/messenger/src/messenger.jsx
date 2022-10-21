import React, { useContext } from "react";
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
import {
    MessagesContext,
    MessagesContextProvider,
} from "./context/messages.jsx";
import Room from "./views/room.jsx";

const Messenger = () => {
    return (
        <div className="poly-talk poly-theme poly-theme-dark">
            <Switch>
                <Route exact path="/">
                    <Redirect to={{ pathname: "/home" }} />
                </Route>
                <Route exact path="/home">
                    <Home />
                </Route>
                <Route exact path="/room">
                    <Room />
                </Route>
            </Switch>
        </div>
    );
};

//Router and context
const MessengerApp = () => {
    //global history object
    const history = useHistory();

    return (
        <Router history={history}>
            <MessagesContextProvider>
                <div className="poly-nav-bar-separator-overlay" />
                <Messenger />
            </MessagesContextProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<MessengerApp />, document.getElementById("feature"));
