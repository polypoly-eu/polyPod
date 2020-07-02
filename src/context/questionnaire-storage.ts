import AsyncStorage from '../util/async-storage';
const INDEX_KEY = 'questionaires-index';

function questionnaireDataStorageId(questionnaireId: string): string {
  return 'questionnaire-' + questionnaireId + '-data';
}

function questionnaireResultsStorageId(questionnaireId: string): string {
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

export async function loadQuestionnaireDataJson(questionnaireIndex: string) {
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

export async function appendQuestionnaireToIndex(questionnaireId: string): Promise<void> {
  let questionairesIndex = await loadQuestionnaireIndex();
  questionairesIndex.push(questionnaireId);
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(questionairesIndex));
}

export async function storeQuestionnaireData(
  questionnaireId: string,
  questionnaireDataJson: string,
): Promise<void> {
  await AsyncStorage.setItem(
    questionnaireDataStorageId(questionnaireId),
    questionnaireDataJson,
  );
}

export async function loadStoredQuestionnaireResultsJson(questionnaireId: string): Promise<string> {
  return await AsyncStorage.getItem(
    questionnaireResultsStorageId(questionnaireId),
  );
}

export async function storeQuestionnaireResults(questionnaireId: string, resultsData: any) {
  await AsyncStorage.setItem(
    questionnaireResultsStorageId(questionnaireId),
    JSON.stringify(resultsData),
  );
  return resultsData;
}
