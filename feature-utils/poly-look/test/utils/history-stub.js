export class HistoryStub {
  constructor() {
    this._route = null;
    this._state = null;
  }

  get route() {
    return this._route;
  }

  get state() {
    return this._state;
  }

  push(route, state) {
    this._route = route;
    this._state = state;
  }
}
