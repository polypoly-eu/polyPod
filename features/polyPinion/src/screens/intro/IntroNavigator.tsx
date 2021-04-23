import React from "react";
import IntroScreen from "./IntroScreen";
import { Switch, Route } from "react-router-dom";
import AuthorDetailsScreen from "./AuthorDetailsScreen";

function IntroNavigator() {
    return (
        <Switch>
            <Route exact path="/intro">
                <IntroScreen />
            </Route>
            <Route exact path="/intro/authordetails">
                <AuthorDetailsScreen />
            </Route>
        </Switch>
    );
}

export const route = "IntroNavigator";
export default IntroNavigator;
