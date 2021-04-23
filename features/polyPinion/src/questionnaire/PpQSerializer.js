//
// Questionnaire deserializer
//
// A import PpQuestionnaire can be serialised to JSON with:
//
//		JSON.stringify(myQuestionnaire)
//
// To correctly deserialize the questionnaire:
//
//		import PpQDeserializer(jsonString)
//
// Note that in general the entire questionnaire must be serialized
// and deserialized as questions with activation conditions have the
// reference to the dependent question replaced with the question's id,
// and deserialization depends on access to the questionnaire.
//

import PpActivationCondition from './PpActivationCondition.js';
import PpDependOnSingleChoice from './PpDependOnSingleChoice.js';
import PpQuestionnaire from './PpQuestionnaire.js';
import PpMultipleChoiceQuestion from './PpMultipleChoiceQuestion.js';
import PpSingleChoiceQuestion from './PpSingleChoiceQuestion.js';
import PpChoice from './PpChoice.js';
import PpTextQuestion from './PpTextQuestion.js';
import PpChoiceQuestion from './PpChoiceQuestion.js';
import PpQObject from './PpQObject.js';
import PpTextualChoice from './PpTextualChoice.js';
import PpDependOnAnotherQuestion from './PpDependOnAnotherQuestion.js';
import PpTrueCondition from './PpTrueCondition.js';
import PpQuestionFactory from './PpQuestionFactory.js';
import PpDependOnMultipleChoice from './PpDependOnMultipleChoice.js';
import PpQuestion from './PpQuestion.js';
import PpRangeQuestion from './PpRangeQuestion.js';
import PpQuestionnaireLinkResult from './PpQuestionnaireLinkResult.js';
import PpAuthor from './PpAuthor.js';
import PpLegal from './PpLegal.js';
import PpTermsAndConditions from './PpTermsAndConditions.js';
import PpPrivacyPolicy from './PpPrivacyPolicy.js';

const KnownClasses = {
  PpActivationCondition: PpActivationCondition,
  PpDependOnSingleChoice: PpDependOnSingleChoice,
  PpQuestionnaire: PpQuestionnaire,
  PpMultipleChoiceQuestion: PpMultipleChoiceQuestion,
  PpSingleChoiceQuestion: PpSingleChoiceQuestion,
  PpChoice: PpChoice,
  PpTextQuestion: PpTextQuestion,
  PpChoiceQuestion: PpChoiceQuestion,
  PpQObject: PpQObject,
  PpTextualChoice: PpTextualChoice,
  PpDependOnAnotherQuestion: PpDependOnAnotherQuestion,
  PpTrueCondition: PpTrueCondition,
  PpQuestionFactory: PpQuestionFactory,
  PpDependOnMultipleChoice: PpDependOnMultipleChoice,
  PpQuestion: PpQuestion,
  PpRangeQuestion: PpRangeQuestion,
  PpQuestionnaireLinkResult: PpQuestionnaireLinkResult,
  PpAuthor: PpAuthor,
  PpLegal: PpLegal,
  PpTermsAndConditions: PpTermsAndConditions,
  PpPrivacyPolicy: PpPrivacyPolicy,
};

//
// Deserialise the suimport Pplied key / value pairs.
//
// Any value that has a __class__ object can create an instance of itself
// from 'the json object.
//
export function PpQReplacer(key, value) {
  if (value != null && value.__class__) {
    return KnownClasses[value.__class__].fromJSON(value);
  }
  return value;
}

export default function PpQDeserializer(jsonString) {
  let jsonObject = JSON.parse(jsonString, PpQReplacer);
  jsonObject.postJSONLoad();
  return jsonObject;
}
