import PpActivationCondition from './PpActivationCondition.js';

//
// PpDependOnLanguage is used to activate or deactivate questions
// based on the question language of the questionnaire (which may 
// be different from the language the questionnaire is displayed in).
//
// The language tag is assumed to be in the format:
//
//      <languageCode>_<countryCode>
// e.g.
//      en_AU
//
// Comparisons are made by simply checking if the language 
// string begins with the specified language string, so specifying
// "en" will match all English language variants, while "en_AU" is 
// specific to Australian English.
//
// String encoding, e.g. "en_AU.UTF-8", is ignored.
//
// Instance variables:
//
// - _language_tags: The languages to match against.
//   The condition is active if any one of the tags matches.
//

export default class PpDependOnLanguage extends PpActivationCondition {
    constructor(language_tags) {
        super();
        this._language_tags = language_tags.map(x => x.toLowerCase());
    }

    get language_tags() {
        return this._language_tags;
    }

    set language_tags(tags) {
        this._language_tag = tags;
    }

    // Answer the language the questionnaire is presentated in.
    get question_language() {
        return this.question.question_language;
    }

    isActive() {
        let language = this.question_language.toLowerCase();
        return this._language_tags
            .find(tag => language.startsWith(tag)) != undefined;
    }
}