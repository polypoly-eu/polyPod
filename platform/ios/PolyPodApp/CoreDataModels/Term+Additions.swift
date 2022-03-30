import Foundation

extension Term {
    @objc func matches(other: Term) -> Bool {
        return self.termType == other.termType && self.value == other.value
    }
}
