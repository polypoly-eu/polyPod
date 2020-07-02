import PpActivationCondition from './PpActivationCondition.js';

//
// PpDependOnAnotherQuestion is an abstract class that is activated
// based on the response chosen in another question.
// Subclasses exist for each type of selector question.
//
// Instance variables:
//
// - _dependent_question: The question whose value will determine
//   whether to display the current question
//

export default class PpDependOnAnotherQuestion extends PpActivationCondition {
    constructor(dependent_question) {
        super();
        this._dependent_question = dependent_question;
    }

    get dependent_question() {
        return this._dependent_question;
    }

    set dependent_question(question) {
        this._dependent_question = question;
    }

    toJSON() {
        let jsonObject = super.toJSON();
        jsonObject._dependent_question = this._dependent_question.id;
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        // The JSON object just stores the question id.
        // Retrieve the real object.
        this._dependent_question = questionnaire.questionId(this._dependent_question);
    }
}