import assert from '../util/assert';
import PpQuestion from './PpQuestion.js';
import { i18n } from '../i18n/i18n.js';

export default class PpTextQuestion extends PpQuestion {
    constructor(description) {
        super(description);
        this._answer = null;
        this._explanation = 'general.enter-answer-below';
        this._max_length = null;
        this._multiline = false;
        this._number_of_lines = 1;
        this._one_word_validation = false;
    }

    get maxLength() {
        return this._max_length;
    }

    set maxLength(an_integer) {
        this._max_length = an_integer;
    }

    get multiline() {
        return this._multiline;
    }

    set multiline(a_boolean) {
        this._multiline = a_boolean;
    }

    get numberOfLines() {
        return this._number_of_lines;
    }

    set numberOfLines(an_integer) {
        this._number_of_lines = an_integer;
    }

    get oneWordValidation() {
        return this._one_word_validation;
    }

    set oneWordValidation(a_boolean) {
        this._one_word_validation = a_boolean;
    }

    isAnswered() {
        if (this._answer == undefined || this._answer == null) {
            return false;
        }
        return this._answer.length > 0;
    }

    answer() {
        return this._answer;
    }

    setAnswer(value) {
        if (this.maxLength != null && value.length > this.maxLength) {
            throw Error('Answer length too long: ' + value.length + ' > ' + this.maxLength);
        }
        this._answer = value;
        return this;
    }

    value() {
        if (this._answer == null) {
            return null;
        }
        return i18n.t(this._answer);
    }

    screen() {
        return 'TextQuestion';
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        assert(answer.questionId == this.id);
        this._answer = answer.answer;
    }

}

//module.exports = PpTextQuestion;
