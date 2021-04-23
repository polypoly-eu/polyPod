import PpQObject from './PpQObject.js';

//
// ActivationConditions are used to determine whether the current
// question should be presented to the user.
//
// Typical criteria include:
// - Do or don't present based on the value chosen in a 
//   previous question.
// - Do or don't present based on the language
//
// Instance variables:
//
// _question: the current question (which will or won't be presented)
//

export default class PpActivationCondition extends PpQObject {
    constructor() {
        super();
        this._question = null;
    }

    get question() {
        return this._question;
    }

    set question(question) {
        this._question = question;
    }

    isActive() {
        throw Error('subclass responsibility');
    }

    toJSON() {
        let jsonObject = super.toJSON();
        if (this._question != null) {
            jsonObject._question = this._question.id;
        }
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad();
        if (this._question != null) {
            // The JSON object just stores the question id.
            // Retrieve the real object.
            this._question = questionnaire.questionId(this._question);
        }
    }
}

// //module.exports = PpActivationCondition;