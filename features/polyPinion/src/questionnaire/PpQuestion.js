import PpQObject from "./PpQObject.js";
import PpTrueCondition from "./PpTrueCondition.js";
import assert from "../util/assert";
import { nextGlobalId } from "./PpID.js";
import { i18n } from "../i18n/i18n.js";

// A PpQuestion is a single question in a questionnaire.
//
// The different types of questions (binary, text, single / multiple choice) are defined by subclasses.
//
// - Questions may be conditional on previous answers, see the activationCondition.
// - The explanation is a short 1 line hint on how to interpret / answer the question.
//

export default class PpQuestion extends PpQObject {
    constructor(description) {
        super();
        this._id = nextGlobalId();
        this._index = null;
        this._description = description;
        this._activationCondition = new PpTrueCondition();
        this._explanation = "";
        this._questionnaire = null;
    }

    get id() {
        return this._id;
    }

    get index() {
        return this._index;
    }

    set index(index) {
        this._index = index;
    }

    get questionnaire() {
        return this._questionnaire;
    }

    set questionnaire(questionnaire) {
        this._questionnaire = questionnaire;
    }

    get question_language() {
        return this.questionnaire.question_language;
    }

    activationCondition() {
        return this._activationCondition;
    }

    setActivationCondition(condition) {
        this._activationCondition = condition;
        condition.question = this;
        return this;
    }

    description() {
        return i18n.t(this._description);
    }

    setDescription(a_string) {
        this._description = a_string;
        return this;
    }

    explanation() {
        return i18n.t(this._explanation);
    }

    isActive() {
        return this._activationCondition.isActive();
    }

    isFirst() {
        return this.index === 1;
    }

    screen() {
        throw Error("subclass responsibility");
    }

    isAnswered() {
        throw Error("subclass responsibility");
    }

    value() {
        throw Error("subclass responsibility");
    }

    toJSON() {
        let jsonObject = super.toJSON();
        if (this._questionnaire != null) {
            jsonObject._questionnaire = this._questionnaire.id;
        }
        return jsonObject;
    }

    postJSONLoad(questionnaire) {
        super.postJSONLoad();
        if (this._questionnaire != null) {
            assert(questionnaire.id == this._questionnaire);
            this._questionnaire = this.questionnaire;
        }
        this._activationCondition.postJSONLoad(questionnaire);
    }

    // Update the receiver based on the supplied answer (JSON object)
    loadAnswer(answer) {
        throw Error("subclass responsibility");
    }
}
