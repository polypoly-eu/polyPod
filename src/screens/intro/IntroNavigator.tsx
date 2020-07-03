import { useTranslation } from "react-i18next";
import React from "react";
import IntroScreen from "./IntroScreen";

function IntroNavigator() {
    const {t} = useTranslation();

    return (
        <IntroScreen />
    );
  }

  export const route = 'IntroNavigator';
  export default IntroNavigator;