import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { QuestionnaireListContext } from "../../context/questionnaire-list-context";
import { getStoredLanguage, storeLanguage, getStoredOrPhoneLanguageCode } from "../language/language-utils";
import AsyncStorage from "../../util/async-storage";
import React from "react";
import LoadingScreen from "../loading/LoadingScreen";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";

export default function AppNavigator() {
    const [onboardingShown, setOnboardingShown] = useState(null);
    const [languageInitialized, setLanguageInitialized] = useState(false);
    const {t, i18n, ready} = useTranslation(null, {useSuspense: false});
    //@ts-ignore
    const {questionaireInitializationStatus, questionnaireList, updateStoredQuestionnaires,
    } = useContext(QuestionnaireListContext);

    /**
     * Effect to set the language in the app and set the app language in the questionnaire
     */
    useEffect(() => {
      const setLanguage = languageCode => {
        i18n
          .changeLanguage(languageCode)
          .then(() => {
            // In case a questionnaire does not have a language set, use the current one.
            // This can happe when opening the app, if a user did not answer any question,
            // as the language is saved when saving answers.
            questionnaireList.forEach(questionnaire => {
              if (questionnaire.question_language === null) {
                questionnaire.question_language = languageCode;
              }
            });
          })
          .then(() => getStoredLanguage())
          .then(savedLanguage => {
            // Only change the language in case it needed. This will only happen the first
            // time when opening the app, as then savedLanguage will be null.
            if (savedLanguage === null) {
              return storeLanguage(languageCode);
            }
          })
          .finally(() => setLanguageInitialized(true));
      };

      // Only proced if questionnaires where loaded and the translation module is initialized.
      if (questionaireInitializationStatus && ready) {
        let currentLanguageCode = getStoredOrPhoneLanguageCode(t);
        currentLanguageCode.then(value => setLanguage(value));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
        updateStoredQuestionnaires().catch(ex => console.log(ex));
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      questionaireInitializationStatus,
      languageInitialized,
      questionnaireList,
    ]);

    useEffect(() => {
      async function getOnboardingShown() {
        let wasShown = await AsyncStorage.getItem('onboardingshown');
        if (wasShown == null) {
        //@ts-ignore
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
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/topics">Topics</Link>
              </li>
            </ul>

            <hr />

            <Switch>
              <Route exact path="/">
                home
              </Route>
              <Route path="/topics">
topics
              </Route>
            </Switch>
          </div>
        </Router>
      );
}