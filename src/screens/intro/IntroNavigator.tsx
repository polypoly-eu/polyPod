import { useTranslation } from "react-i18next";
import React from "react";
import IntroScreen from "./IntroScreen";
import { Switch, Route } from "react-router-dom";
import AuthorDetailsScreen from "./AuthorDetailsScreen";

function IntroNavigator() {
    const {t} = useTranslation();

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

  export const route = 'IntroNavigator';
  export default IntroNavigator;