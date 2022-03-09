import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import {
    getStoredLanguage,
    storeLanguage,
    getStoredOrPhoneLanguageCode,
} from "../language/language-utils";
import AsyncStorage from "../../util/async-storage";
import React from "react";
import LoadingScreen from "../loading/LoadingScreen";
import { HashRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import HomeScreen from "../home/HomeScreen";
import QuestionScreen from "../questionnaire/QuestionScreen";
import IntroNavigator from "../intro/IntroNavigator";
import SurveyCompletedScreen from "../finish/SurveyCompletedScreen";
import SurveyLegalScreen from "../legal/SurveyLegalScreen";
import SubmittedScreen from "../submitted/SubmittedScreen";
import AnswersSubmissionErrorScreen from "../error/AnswersSubmissionErrorScreen";
import AnswersScreen from "../answers/AnswersScreen";
import OnboardingScreenOne from "../onboarding/OnboardingScreenOne";
import OnboardingScreenTwo from "../onboarding/OnboardingScreenTwo";
import OnboardingScreenThree from "../onboarding/OnboardingScreenThree";
import OnboardingScreenFour from "../onboarding/OnboardingScreenFour";

export default function AppNavigator() {
    //TODO: RDF triple store
    const [onboardingShown, setOnboardingShown] = useState(null);
    const [languageInitialized, setLanguageInitialized] = useState(false);
    const { i18n, ready } = useTranslation(null, { useSuspense: false });
    const { questionaireInitializationStatus, questionnaireList, updateStoredQuestionnaires } =
        useContext(QuestionnaireListContext);

    /**
     * Effect to set the language in the app and set the app language in the questionnaire
     */
    useEffect(() => {
        const setLanguage = (languageCode: string) => {
            i18n.changeLanguage(languageCode)
                .then(() => {
                    // In case a questionnaire does not have a language set, use the current one.
                    // This can happe when opening the app, if a user did not answer any question,
                    // as the language is saved when saving answers.
                    questionnaireList.forEach((questionnaire) => {
                        if (questionnaire.question_language === null) {
                            questionnaire.question_language = languageCode;
                        }
                    });
                })
                .then(() => getStoredLanguage())
                .then((savedLanguage) => {
                    // Only change the language in case it needed. This will only happen the first
                    // time when opening the app, as then savedLanguage will be null.
                    if (savedLanguage === null) {
                        // TODO: following line actually does nothing! there's no storage
                        return storeLanguage(languageCode);
                    }
                })
                .finally(() => setLanguageInitialized(true));
        };

        // Only proceed if questionnaires where loaded and the translation module is initialized.
        if (questionaireInitializationStatus && ready) {
            const currentLanguageCode = getStoredOrPhoneLanguageCode();
            currentLanguageCode.then((value) => setLanguage(value));
        }
    }, [questionaireInitializationStatus, ready]);

    /**
     * Effect to automatically download the initial questionnaire if no questionnaires are
     * downloaded locally.
     */
    useEffect(() => {
        if (
            questionaireInitializationStatus &&
            languageInitialized &&
            questionnaireList.length === 0
        ) {
            updateStoredQuestionnaires().catch((ex) => console.log(ex));
        }
    }, [questionaireInitializationStatus, languageInitialized, questionnaireList]);

    useEffect(() => {
        async function getOnboardingShown() {
            let wasShown = await AsyncStorage.getItem("onboardingshown");
            if (wasShown == null) {
                // TODO - bug - we assign a boolean to a string!
                wasShown = false;
            }
            setOnboardingShown(wasShown);
        }
        getOnboardingShown();
    }, [onboardingShown]);

    // Wait for various parts of the app to read data from storage and initialize.
    if (
        onboardingShown == null ||
        questionaireInitializationStatus === false ||
        ready === false ||
        languageInitialized === false
    ) {
        return <LoadingScreen />;
    }
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    {onboardingShown ? (
                        <Redirect to={{ pathname: "/home", state: { from: "/" } }} />
                    ) : (
                        <Redirect to={{ pathname: "/onboarding", state: { from: "/" } }} />
                    )}
                </Route>
                <Route exact path="/onboarding">
                    <OnboardingScreenOne />
                </Route>
                <Route exact path="/onboarding2">
                    <OnboardingScreenTwo />
                </Route>
                <Route exact path="/onboarding3">
                    <OnboardingScreenThree />
                </Route>
                <Route exact path="/onboarding4">
                    <OnboardingScreenFour />
                </Route>
                <Route exact path="/home">
                    <HomeScreen />
                </Route>
                <Route path="/intro">
                    <IntroNavigator />
                </Route>
                <Route exact path="/survey">
                    <QuestionScreen />
                </Route>
                <Route exact path="/survey-completed">
                    <SurveyCompletedScreen />
                </Route>
                <Route exact path="/survey-legal">
                    <SurveyLegalScreen />
                </Route>
                <Route exact path="/survey-submitted">
                    <SubmittedScreen />
                </Route>
                <Route exact path="/survey-error">
                    <AnswersSubmissionErrorScreen />
                </Route>
                <Route exact path="/answers">
                    <AnswersScreen />
                </Route>
            </Switch>
        </Router>
    );
}
