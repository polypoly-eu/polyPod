import PpQObject from './PpQObject.js';

export default class PpQuestionnaireLinkResult extends PpQObject {
  constructor() {
    super();
    this._url = null;
  }

  get url() {
    return this._url;
  }

  set url(newUrl) {
    this._url = newUrl;
  }
}
