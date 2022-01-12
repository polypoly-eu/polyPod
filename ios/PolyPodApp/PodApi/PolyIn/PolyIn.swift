import CoreData

protocol PolyInProtocol {
    func addQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void)
    func matchQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void)
    func selectQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void)
    func deleteQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void)
    func hasQuads(quads: [ExtendedData], completionHandler: @escaping (Bool) -> Void) -> Void
}

class PolyIn: PolyInProtocol {
    func quadsPredicateAndFilter(matcher: ExtendedData) -> (NSPredicate, ((Quad) -> Bool)?) {
        var formatItems: [String] = []
        var arguments: [Any] = []
        
        if let subjectsMatcher = matcher.properties["subject"] as? ExtendedData {
            formatItems.append("subject.termType == %@ && subject.value == %@")
            arguments.append(subjectsMatcher.properties["termType"] as! String)
            arguments.append(subjectsMatcher.properties["value"] as! String)
        }
        if let predicatesMatcher = matcher.properties["predicate"] as? ExtendedData {
            formatItems.append("predicate.termType == %@ && predicate.value == %@")
            arguments.append(predicatesMatcher.properties["termType"] as! String)
            arguments.append(predicatesMatcher.properties["value"] as! String)
        }
        var filterOperation: ((Quad) -> Bool)? = nil
        if let objectsMatcher = matcher.properties["object"] as? ExtendedData {
            let termType = objectsMatcher.properties["termType"] as! String
            if termType == "Literal" {
                let language = objectsMatcher.properties["language"] as! String
                let datatype = objectsMatcher.properties["datatype"] as! ExtendedData
                let termType = datatype.properties["termType"] as! String
                let value = datatype.properties["value"] as! String
                filterOperation = { (quad: Quad) -> Bool in
                    let literal = quad.object as! Literal
                    if literal.language == language && literal.datatype.termType == termType && literal.datatype.value == value {
                        return true
                    }
                    return false
                    
                }
            }
            formatItems.append("object.termType == %@ && object.value == %@")
            arguments.append(termType)
            arguments.append(objectsMatcher.properties["value"] as! String)
        }
        
        var format:String = ""
        for (i, formatItem) in formatItems.enumerated() {
            if i != 0 {
                format += " && "
            }
            format += formatItem
        }
        
        // Passing an empty matcher selects all elements
        if format == "" {
            return (NSPredicate(value: true), filterOperation)
        }
        
        let predicate = NSPredicate(format: format, argumentArray: arguments)
        return (predicate, filterOperation)
    }
}
