struct FetchRequestInit {
    let body: String?
    let method: String?
    let headers: [String: String]?
    
    init(with dictionary: [String: Any]) {
        body = dictionary["body"] as? String
        method = dictionary["method"] as? String
        headers = dictionary["headers"] as? [String: String]
    }
}
