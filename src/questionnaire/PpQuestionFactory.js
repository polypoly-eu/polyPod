import PpTextQuestion from './PpTextQuestion.js';
import PpSingleChoiceQuestion from './PpSingleChoiceQuestion.js';
import PpMultipleChoiceQuestion from './PpMultipleChoiceQuestion.js';
import PpQuestionnaire from './PpQuestionnaire.js';
import PpDependOnSingleChoice from './PpDependOnSingleChoice.js';
import PpDependOnMultipleChoice from './PpDependOnMultipleChoice.js';
import PpDependOnLanguage from './PpDependOnLanguage.js';
import PpRangeQuestion from './PpRangeQuestion.js';
import PpAndActivationCondition from './PpAndActivationCondition.js';
import PpOrActivationCondition from './PpOrActivationCondition.js';
import PpTrueCondition from './PpTrueCondition.js';
import PpFalseCondition from './PpFalseCondition.js';
import PpAuthor from './PpAuthor.js';
import PpLegal from './PpLegal.js';
import PpTermsAndConditions from './PpTermsAndConditions.js';
import PpPrivacyPolicy from './PpPrivacyPolicy.js';

export default class PpQuestionFactory {
  textQuestion(description) {
    return new PpTextQuestion(description);
  }

  singleChoiceQuestion(description) {
    return new PpSingleChoiceQuestion(description);
  }

  multipleChoiceQuestion(description) {
    return new PpMultipleChoiceQuestion(description);
  }

  rangeQuestion(description) {
    return new PpRangeQuestion(description);
  }

  questionnaire() {
    return new PpQuestionnaire();
  }

  author() {
    return new PpAuthor();
  }

  legal() {
    return new PpLegal();
  }

  termsAndConditions() {
    return new PpTermsAndConditions();
  }

  privacyPolicy() {
    return new PpPrivacyPolicy();
  }

  dependOnSingleChoice(question, choice) {
    return new PpDependOnSingleChoice(question, choice);
  }

  dependOnMultipleChoice(question, choices) {
    return new PpDependOnMultipleChoice(question, choices);
  }

  dependOnLanguage(language_tags) {
    return new PpDependOnLanguage(language_tags);
  }

  andCondition() {
    return new PpAndActivationCondition();
  }

  orCondition() {
    return new PpOrActivationCondition();
  }

  trueCondition() {
    return new PpTrueCondition();
  }

  falseCondition() {
    return new PpFalseCondition();
  }
}

//module.exports = PpQuestionFactory;
