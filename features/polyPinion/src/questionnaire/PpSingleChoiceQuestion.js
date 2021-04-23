import assert from '../util/assert';
import PpChoiceQuestion from './PpChoiceQuestion.js';

export default class PpSingleChoiceQuestion extends PpChoiceQuestion {
    constructor(description) {
        super(description);
        this._explanation = 'general.choose-one';
    }

    selectedChoice() {
        return this._choices.find(item => item.isSelected());
    }

    isAnswered() {
        return this.selectedChoice() != undefined;
    }

    value() {
        return this.selectedChoice().value();
    }

    screen() {
        return 'MultipleChoiceQuestion';
    }

    // Answer the object to be stored in the answer json document.
    // This is the ids of selected choices.
    answer() {
        if (this.isAnswered()) {
            return this.selectedChoice().id;
        } else {
            return null;
        }
    }

    // The supplied choice has been selected.
    //
    // Deselect all other choices
    //
    selectChoice(choice) {
        this.choices().forEach(each => {
            if (each !== choice) {
                each.beNotSelected();
            }
        });
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        assert(answer.questionId == this.id);
        this._choices.forEach(choice => choice.beNotSelected());
        if (answer.answer != null) {
            this._choices.find(choice => choice.id == answer.answer)
                .beSelected();
        }
    }

}

//module.exports = PpSingleChoiceQuestion;
