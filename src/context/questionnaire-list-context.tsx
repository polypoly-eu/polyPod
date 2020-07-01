import React, {createContext, useState} from 'react';
import {useTranslation} from 'react-i18next';

// import {getStoredLanguage} from '../screens/language/language-utils';

import {PpQReplacer} from './../questionnaire/PpQSerializer.js';
import PpQuestionnaireLinkResult from '../questionnaire/PpQuestionnaireLinkResult';

import {
  downloadQuestionnaireData,
  downloadQuestionnaireResults,
  downloadActiveQuestionnairesMetadata,
} from '../server/questionnaire-download';
import {
  loadStoredQuestionnaireResultsJson,
  loadQuestionnaireIndex,
  loadQuestionnaireDataJson,
  appendQuestionnaireToIndex,
  storeQuestionnaireData,
  storeQuestionnaireResults,
} from '../context/questionnaire-storage';
import {storeAnswers, loadAnswers} from './answers-storage';

export const QuestionnaireListContext = createContext({});

export const QuestionnaireListProvider = ({children}) => {
  const {i18n} = useTranslation();

  // State to indicate when the list of questionnaire is initialized.
  const [
    questionaireInitializationStatus,
    setQuestionaireInitializationStatus,
  ] = useState(false);
  const [questionnaireList, setQuestionnaireList] = useState([]);

  const triggerUpdate = () => {
    setQuestionnaireList([...questionnaireList]);
  };

  /**
   * I save questionnaire on disk without notifying any UI updates
   */
  const saveQuestionnaireAnswers = questionnaire => {
    storeAnswers(questionnaire);
  };

  const markQuestionaireSubmitted = questionnaire => {
    questionnaire.updateSubmittedTime();
    saveQuestionnaireAnswers(questionnaire);
    triggerUpdate();
  };

  const buildQuestionnaireObject = questionaireDataJson => {
    const currentQuestionaireData = JSON.parse(
      questionaireDataJson,
      PpQReplacer,
    );
    const currentQuestionaire = currentQuestionaireData.questionnaire;
    currentQuestionaire.postJSONLoad();
    currentQuestionaire.loadTranslations(
      i18n,
      currentQuestionaireData.languages,
    );
    return currentQuestionaire;
  };

  const ensureLanguage = async questionnaire => {
    // If after loading a questionnaire the language is not set, use the current language.
    if (questionnaire.question_language === null) {
      const languageCode = await getStoredLanguage();
      questionnaire.question_language = languageCode;
    }
  };

  const downloadAndStoreQuestionnaire = async function(questionaireMetadata) {
    const responseContent = await downloadQuestionnaireData(
      questionaireMetadata.questionnaireId,
    );
    const currentQuestionaire = buildQuestionnaireObject(responseContent);

    await storeQuestionnaireData(currentQuestionaire.id, responseContent);
    await appendQuestionnaireToIndex(currentQuestionaire.id);

    // Set the current language as the language of the questionnaire after download.
    await ensureLanguage(currentQuestionaire);
    return currentQuestionaire;
  };

  const getNewActiveQuestionnairesMetadata = async () => {
    const resultValue = await downloadActiveQuestionnairesMetadata();
    const allActiveQuestionnairesMetadata = JSON.parse(resultValue);
    if (
      allActiveQuestionnairesMetadata === null ||
      allActiveQuestionnairesMetadata.length === 0
    ) {
      return [];
    }

    const questionnairesIndex = questionnaireList.map(
      questionnaire => questionnaire.id,
    );
    let newMetadata = [];
    for (const questionaireMetadata of allActiveQuestionnairesMetadata) {
      if (!questionnairesIndex.includes(questionaireMetadata.questionnaireId)) {
        newMetadata.push(questionaireMetadata);
      }
    }
    return newMetadata;
  };

  const updateQuestionnaireResults = async questionnaire => {
    const responseContent = await downloadQuestionnaireResults(
      questionnaire.id,
    );
    const responseValue = JSON.parse(responseContent);
    if (
      responseValue.result_status === 'available' &&
      responseValue.result_url
    ) {
      const result = new PpQuestionnaireLinkResult();
      result.url = responseValue.result_url;

      questionnaire.result = result;
      await storeQuestionnaireResults(questionnaire.id, result.toJSON());
    }
  };

  const updateStoredQuestionnaires = async () => {
    const questionnairesMetadata = await getNewActiveQuestionnairesMetadata();

    let downloadedQuestionnaires = [];
    try {
      for (const questionaireMetadata of questionnairesMetadata) {
        const currentQuestionnaire = await downloadAndStoreQuestionnaire(
          questionaireMetadata,
        );
        downloadedQuestionnaires.push(currentQuestionnaire);
      }

      const noResultsQuestionnaires = questionnaireList.filter(
        questionnaire =>
          questionnaire.hasResult() === false &&
          (questionnaire.isSubmitted() || questionnaire.isExpired()),
      );
      for (const questionaire of noResultsQuestionnaires) {
        await updateQuestionnaireResults(questionaire);
      }
    } catch (ex) {
      console.log(ex);
    } finally {
      setQuestionnaireList([...questionnaireList, ...downloadedQuestionnaires]);
    }
  };

  const loadResults = async questionnaire => {
    const questionnaireResultsJson = await loadStoredQuestionnaireResultsJson(
      questionnaire.id,
    );
    if (questionnaireResultsJson !== null) {
      const questionnaireResults = JSON.parse(
        questionnaireResultsJson,
        PpQReplacer,
      );
      questionnaireResults.postJSONLoad();
      questionnaire.result = questionnaireResults;
    }
  };

  /**
   * Main effect: load the questionnaire data from storage when app is started.
   */
  React.useEffect(() => {
    const loadInitialQuestionnaires = async function() {
      let loadedQuestionnaires = [];
      const questionnairesIndexList = await loadQuestionnaireIndex();
      for (const questionnaireId of questionnairesIndexList) {
        const currentQuestionaireDataJson = await loadQuestionnaireDataJson(
          questionnaireId,
        );
        const currentQuestionaire = buildQuestionnaireObject(
          currentQuestionaireDataJson,
        );

        await loadAnswers(currentQuestionaire);
        await loadResults(currentQuestionaire);

        loadedQuestionnaires.push(currentQuestionaire);
      }
      setQuestionnaireList(loadedQuestionnaires);
    };
    loadInitialQuestionnaires().finally(() =>
      // Mark the questionnaire as initialized in a finally bloc,
      // to be set even if there is an error during initialization.
      setQuestionaireInitializationStatus(true),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QuestionnaireListContext.Provider
      value={{
        triggerUpdate,
        saveQuestionnaireAnswers,
        markQuestionaireSubmitted,
        questionaireInitializationStatus,
        questionnaireList,
        setQuestionnaireList,
        updateStoredQuestionnaires,
      }}>
      {children}
    </QuestionnaireListContext.Provider>
  );
};

// hacky stuff
async function getStoredLanguage() {
  return "de";
}
