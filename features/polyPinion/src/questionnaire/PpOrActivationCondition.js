//
// PpOrActivationCondition is true if any of its children are true. 
//
import PpCompoundActivationCondition from './PpCompoundActivationCondition.js';

export default class PpOrActivationCondition extends PpCompoundActivationCondition {
    isActive() {
        return this.children.find((child) => child.isActive()) != undefined
    }
}
