protocol InfoProtocol {
    func getRuntime() -> String
    func getVersion() -> String
}

class Info: InfoProtocol {
    func getRuntime() -> String {
        return RuntimeInfo.name
    }
    
    func getVersion() -> String {
        return RuntimeInfo.version
    }
}
