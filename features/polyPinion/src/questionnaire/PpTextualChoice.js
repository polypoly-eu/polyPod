import PpChoice from './PpChoice.js';
import {i18n} from '../i18n/i18n.js';

export default class PpTextualChoice extends PpChoice {
  constructor(description) {
    super();
    this.is_selected = false;
    this._description = description;
  }

  beSelected() {
    this.is_selected = true;
    super.beSelected();
    return this;
  }

  beNotSelected() {
    this.is_selected = false;
    super.beNotSelected();
    return this;
  }

  description() {
    return this._description;
  }

  setDescription(a_string) {
    this._description = a_string;
    return this;
  }

  isSelected() {
    return this.is_selected;
  }

  value() {
    return i18n.t(this._description);
  }
}

//module.exports = PpTextualChoice;
