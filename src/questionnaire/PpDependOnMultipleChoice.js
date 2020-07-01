import PpDependOnAnotherQuestion from './PpDependOnAnotherQuestion.js';

export default class PpDependOnMultipleChoice extends PpDependOnAnotherQuestion {
    constructor(dependent_question, choices) {
        super(dependent_question);
        this._choices = choices;
    }

    choices() {
        return this._choices;
    }

    setChoices(choices) {
        this._choices = choices;
        return this;
    }

    // Answer a boolean indicating whether the receiver is active,
    // i.e. all the choices have been selected.
    isActive() {
        return this._choices.find((choice) => !choice.isSelected()) == undefined;
    }

    toJSON() {
        let choices = [];
        // Save the index of the choices and reconstruct on deseralisation
        this._choices.forEach((choice, index) => {
            choices[index] = this._dependent_question.choices().indexOf(choice);
        });
        let jsonObject = super.toJSON();
        jsonObject._choices = choices;
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        let choices = [];
        // Reconstruct the choices
        this._choices.forEach((choiceIndex, index) => {
            choices[index] = this._dependent_question.choices()[choiceIndex];
        });
        this._choices = choices;
    }
}
