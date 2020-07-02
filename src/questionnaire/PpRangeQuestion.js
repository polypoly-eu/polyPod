//
// A PpRangeQuestion is one where the user selects a value from
// min to max by step.
//
// It will typically be presented to the user as a slider
//
// Attributes:
// - min - the minimum allowed value
// - max - the maximum allowed value
// - steps - if not null, the number of steps to move from min to max
// - labels - an array of labels to be displayed under the slider.
//      Initially this will only work with two values.
//
import assert from '../util/assert';
import PpQuestion from './PpQuestion.js';
import { i18n } from '../i18n/i18n.js';

export default class PpRangeQuestion extends PpQuestion {
    constructor (description) {
        super(description);
        this._explanation = 'general.choose-seat';
        this._min = 0;
        this._max = 0;
        this._steps = null;
        this._labels = [];
        this._value = null;
    }

    screen() {
        return 'RangeQuestion';
    }

    get min() {
        return this._min;
    }

    set min(min) {
        this._min = min;
    }

    get max() {
        return this._max;
    }

    set max(max) {
        this._max = max;
    }

    get steps() {
        return this._steps;
    }

    set steps(steps) {
        this._steps = steps;
    }

    get labels() {
        return this._labels.map(label => i18n.t(label));
    }

    set labels(labels) {
        this._labels = labels;
    }

    get raw_labels() {
        return this._labels;
    }

    isAnswered() {
        return this._value != null;
    }

    values() {
        let values = [];
        let current = this.min;

        while (current < this.max) {
            values.push(current);
            current += this.steps;
        };
        values.push(this.max);
        return values;
    }

    value() {
        return this._value;
    }

    setValue(value) {
        this._value = value;
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        assert(answer.questionId == this.id);
        this._value = answer.answer;
    }

}

//module.exports = PpRangeQuestion;
