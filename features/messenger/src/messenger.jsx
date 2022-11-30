import React from "react";
import * as ReactDOM from "react-dom";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home.jsx";
import "./styles.css";
import { MessagesContextProvider } from "./context/messages.jsx";
import Room from "./views/room.jsx";

const Messenger = () => {
    return (
        <div className="poly-talk poly-theme poly-theme-dark">
            <Routes>
                <Route index />
                <Route exact path="/home" element={<Home />} />
                <Route exact path="/room" element={<Room />} />
            </Routes>
        </div>
    );
};

//Router and context
const MessengerApp = () => {
    return (
        <Router>
            <MessagesContextProvider>
                <div className="poly-nav-bar-separator-overlay" />
                <Messenger />
            </MessagesContextProvider>
        </Router>
    );
};

//render to html
ReactDOM.render(<MessengerApp />, document.getElementById("feature"));
