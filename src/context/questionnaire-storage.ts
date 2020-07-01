import AsyncStorage from '../util/async-storage';
const INDEX_KEY = 'questionaires-index';

function questionnaireDataStorageId(questionnaireId) {
  return 'questionnaire-' + questionnaireId + '-data';
}

function questionnaireResultsStorageId(questionnaireId) {
  return 'questionnaire-' + questionnaireId + '-results-update';
}

export async function loadQuestionnaireIndex() {
  const questionairesIndexJson = await AsyncStorage.getItem(INDEX_KEY);
  if (questionairesIndexJson == null) {
    return [];
  }
  return JSON.parse(questionairesIndexJson);
}

export async function hasQuestionnaires() {
  const questionairesIndex = await loadQuestionnaireIndex();
  return questionairesIndex && questionairesIndex.length > 0;
}

export async function loadQuestionnaireDataJson(questionnaireIndex) {
  if (!(await hasQuestionnaires())) {
    return null;
  }

  const questionnaireDataJson = await AsyncStorage.getItem(
    questionnaireDataStorageId(questionnaireIndex),
  );
  if (!questionnaireDataJson) {
    return null;
  }

  return questionnaireDataJson;
}

export async function appendQuestionnaireToIndex(questionnaireId) {
  let questionairesIndex = await loadQuestionnaireIndex();
  questionairesIndex.push(questionnaireId);
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(questionairesIndex));
}

export async function storeQuestionnaireData(
  questionnaireId,
  questionnaireDataJson,
) {
  await AsyncStorage.setItem(
    questionnaireDataStorageId(questionnaireId),
    questionnaireDataJson,
  );
}

export async function loadStoredQuestionnaireResultsJson(questionnaireId) {
  return await AsyncStorage.getItem(
    questionnaireResultsStorageId(questionnaireId),
  );
}

export async function storeQuestionnaireResults(questionnaireId, resultsData) {
  await AsyncStorage.setItem(
    questionnaireResultsStorageId(questionnaireId),
    JSON.stringify(resultsData),
  );
  return resultsData;
}
