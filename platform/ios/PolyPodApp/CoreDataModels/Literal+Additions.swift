import Foundation

extension Literal {
    override func matches(other: Term) -> Bool {
        guard let other = other as? Literal else {
            return false
        }
        if !super.matches(other: other) {
            return false
        }
        return self.language == other.language && self.datatype.matches(other: other.datatype)
    }
}
