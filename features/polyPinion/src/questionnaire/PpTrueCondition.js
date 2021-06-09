import PpActivationCondition from './PpActivationCondition.js';

export default class PpTrueCondition extends PpActivationCondition {

    isActive() {
        return true;
    }
}
