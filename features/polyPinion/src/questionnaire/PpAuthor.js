import PpQObject from './PpQObject.js';

//
// PpAuthor - store details about the author of the questionnaire
//
// - _name: Author's name
// - _link: URL to the author's home page
// - _description: A description of the author.  This should be a key in to 
//   the questionnaire translation files.
// - _logo: base64 encoded image
//
export default class PpAuthor extends PpQObject {
    constructor() {
      super();
      this._name = null;
      this._link = null;
      this._description = null;
      this._logo = null;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get link() {
        return this._link;
    }

    set link(url) {
        this._link = url;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    get logo() {
        return this._logo;
    }

    set logo(base64String) {
        this._logo = base64String;
    }
}  