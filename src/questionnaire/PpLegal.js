import PpQObject from './PpQObject.js';

export default class PpLegal extends PpQObject {
  constructor() {
    super();
    this._content = null;
    this._link = null;
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }

  get link() {
    return this._link;
  }

  set link(url) {
    this._link = url;
  }
}
