import CoreData

protocol PolyIn {
    func addQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void)
    func matchQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void)
    func selectQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void)
    func deleteQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void)
    func hasQuads(quads: [ExtendedData], completionHandler: @escaping (Bool) -> Void)
}
