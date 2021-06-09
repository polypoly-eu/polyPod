import PpDependOnAnotherQuestion from './PpDependOnAnotherQuestion.js';

export default class PpDependOnSingleChoice extends PpDependOnAnotherQuestion {
    constructor(dependent_question, choice) {
        super(dependent_question);
        this._choice = choice;
    }

    choice() {
        return this._choice;
    }

    setChoice(choice) {
        this._choice = choice;
        return this;
    }

    isActive() {
        return this._choice.isSelected();
    }

    toJSON() {
        // Save the index of the choice and reconstruct on deseralisation
        let choice = this._dependent_question.choices().indexOf(this._choice);
        let jsonObject = super.toJSON();
        jsonObject._choice = choice;
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        let choice = this._dependent_question.choices()[this._choice];
        this._choice = choice;
    }
}
