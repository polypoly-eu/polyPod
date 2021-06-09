class State {
  and = function(state) {
    return new AndState([this, state]);
  };
}

class AndState extends State {
  constructor(states) {
    super();
    this._states = states;
  }
}

export class Submitted extends State {}

export class Expired extends State {}

export class Active extends State {}
