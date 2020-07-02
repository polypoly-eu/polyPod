import SecureStorage from '../util/async-storage';
import Questionnaire from "../questionnaire/PpQuestionnaire";

function questionnaireAnswersStorageId(questionnaireId: string): string {
  return 'questionnaire-' + questionnaireId + '-answers';
}

export async function storeAnswers(questionnaire: Questionnaire) {
  const storageKey = questionnaireAnswersStorageId(questionnaire.id);
  const jsonContent = JSON.stringify(questionnaire.answerJSON());

  await SecureStorage.setItem(storageKey, jsonContent);
}

export async function loadAnswers(questionnaire: Questionnaire) {
  const storageKey = questionnaireAnswersStorageId(questionnaire.id);
  const answers = await SecureStorage.getItem(storageKey);
  if (answers != null) {
    const content = JSON.parse(answers);
    questionnaire.loadAnswers(content);
  }
}
