//
// PpCompoundActivationCondition is an abstract class for conditions
// that have one or more children. 
//
import PpActivationCondition from './PpActivationCondition.js';

export default class PpCompoundActivationCondition extends PpActivationCondition {
    constructor(question) {
        super();
        this._children = [];
    }

    get children() {
        return this._children;
    }

    addChild(childCondition) {
        this._children[this._children.length] = childCondition;
        return this;
    }

    removeChild(childCondition) {
        let index = this._children.indexOf(childCondition);
        if (index < 0) {
            throw Error('Unable to find child to be removed');
        }
        this._children.splice(index, 1);
        return this;
    }
}
