import PpQObject from './PpQObject.js';

//
// PpPrivacyPolicy - store details about the T&C of the questionnaire
//
// - _text: The text to be displayed.
// - _link: The primary link to the web page containing the T&C
//
export default class PpPrivacyPolicy extends PpQObject {
    constructor() {
      super();
      this._link = null;
      this._text = null;
    }

    get link() {
        return this._link;
    }

    set link(url) {
        this._link = url;
    }

    get text() {
        return this._text;
    }

    set text(text) {
        this._text = text;
    }

}