extension Result {
    func inspectError(_ inspect: (Error) -> Void) -> Self {
        if case let.failure(error) = self {
            inspect(error)
        }
        return self
    }
    
    func unwrapOr(_ fallback: Success) -> Success {
        if let value = try? self.get() {
            return value
        }
        
        return fallback
    }
    
    func consume() {}
}
