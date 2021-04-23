import PpQuestion from './PpQuestion.js';
import PpTextualChoice from './PpTextualChoice.js';

export default class PpChoiceQuestion extends PpQuestion {
    constructor(description) {
        super(description);
        this._choices = [];
    }

    choices() {
        return this._choices;
    }

    selectChoice() {
        // Subclasses will override with required behaviour
    }

    // updateEnabled()
    //
    // The state of one or more of the receiver's choices have changed.
    // Update the other choices as required.
    // This will be overridden by subclasses if required.
    //
    updateEnabled() {
    }

    addTextualChoiceWithDescription(a_string) {
        let choice = new PpTextualChoice(a_string);

        this._choices[this._choices.length] = choice;
        choice.question = this;
        choice.index = this._choices.length - 1;

        return this;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad(questionnaire);
        this._choices.forEach(choice => choice.question = this);
    }

    toString() {
        var result = this.constructor.name + '(';
        this.choices().forEach(choice => {
            result += choice.index + ': ' + choice.isSelected() + ', ';
        })
        result += ')';
        return result;
    }
}

//module.exports = PpChoiceQuestion;