import SecureStorage from '../util/async-storage';

function questionnaireAnswersStorageId(questionnaireId) {
  return 'questionnaire-' + questionnaireId + '-answers';
}

export async function storeAnswers(questionnaire) {
  const storageKey = questionnaireAnswersStorageId(questionnaire.id);
  const jsonContent = JSON.stringify(questionnaire.answerJSON());

  await SecureStorage.setItem(storageKey, jsonContent);
}

export async function loadAnswers(questionnaire) {
  const storageKey = questionnaireAnswersStorageId(questionnaire.id);
  const answers = await SecureStorage.getItem(storageKey);
  if (answers != null) {
    const content = JSON.parse(answers);
    questionnaire.loadAnswers(content);
  }
}
