import PpQObject from './PpQObject.js';
import {nextGlobalId} from './PpID.js';

// PpChoice repesents a single option within a single- or multiple-
// choice question.
//
// Instance Variables:
//
// - id uniquely identifies the question with the global scope.
//   See PpID.js for a description of global UID management.
// - question holds the question to which this choice belongs.
//   This is cleared and reloaded as part of
//   serialisation / deserialisation.
// - index is the choice number in the question
// - enabled indicates whether the corresponding UI element should
//   be enabled or not.  It is managed by the question.
//
export default class PpChoice extends PpQObject {
  constructor() {
    super();
    this._id = nextGlobalId();
    this._question = null;
    this._index = null;
    this._enabled = true;
  }

  get id() {
    return this._id;
  }

  get question() {
    return this._question;
  }

  set question(question) {
    this._question = question;
  }

  get index() {
    return this._index;
  }

  set index(index) {
    this._index = index;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled) {
    this._enabled = enabled;
  }

  // Set the selection state of the receiver
  selected(a_boolean) {
    if (a_boolean) {
      this.beSelected();
    } else {
      this.beNotSelected();
    }
  }

  beSelected() {
    this._question.selectChoice(this);
    this._question.updateEnabled();
  }

  beNotSelected() {
    this._question.updateEnabled();
  }

  isSelected() {
    return false;
  }

  value() {
    throw Error('subclass responsibility');
  }

  toJSON() {
    let jsonObject = super.toJSON();
    // Don't save the question, it will be restored on load
    jsonObject._question = null;
    return jsonObject;
  }

  postJSONLoad(question) {
    super.postJSONLoad();
    this._question = question;
  }
}
