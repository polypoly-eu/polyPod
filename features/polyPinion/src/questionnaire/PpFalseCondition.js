//
// PpFalseCondition - just for automated testing - always return false.
//
import PpActivationCondition from './PpActivationCondition.js';

export default class PpFalseCondition extends PpActivationCondition {

    isActive() {
        return false;
    }
}
