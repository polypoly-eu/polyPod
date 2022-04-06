class HistoryStub {
  constructor() {
    this._route = null;
    this.state = null;
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
