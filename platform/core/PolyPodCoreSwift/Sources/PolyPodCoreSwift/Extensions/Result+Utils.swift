extension Result {
    public func inspectError(_ inspect: (Error) -> Void) -> Self {
        if case let.failure(error) = self {
            inspect(error)
        }
        return self
    }
    
    public func unwrapOr(_ fallback: Success) -> Success {
        if let value = try? self.get() {
            return value
        }
        
        return fallback
    }
}
