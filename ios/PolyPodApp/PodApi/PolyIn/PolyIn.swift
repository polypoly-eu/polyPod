protocol PolyInProtocol {
    func addQuads(quads: [ExtendedData], completionHandler: (Bool) -> Void)
    func selectQuads(matcher: ExtendedData, completionHandler: ([ExtendedData]?, Error?) -> Void)
}

class PolyIn: PolyInProtocol {
    
}
