//
// PpAndActivationCondition is true if all its children are true. 
//
import PpCompoundActivationCondition from './PpCompoundActivationCondition.js';

export default class PpAndActivationCondition extends PpCompoundActivationCondition {
    isActive() {
        return this.children.find((child) => !child.isActive()) == undefined
    }
}
