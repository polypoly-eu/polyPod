import CoreData

class DataFactory {
    static func namedNode(value: String, context moc: NSManagedObjectContext) -> NamedNode {
        let namedNode = NamedNode(context: moc)
        namedNode.termType = "NamedNode"
        namedNode.value = value
        return namedNode
    }
    
    static func variable(value: String, context moc: NSManagedObjectContext) -> Variable {
        let variable = Variable(context: moc)
        variable.termType = "Variable"
        variable.value = value
        return variable
    }
    
    static func literal(value: String, languageOrDatatype: Any?, context moc: NSManagedObjectContext) -> Literal {
        let literal = Literal(context: moc)
        literal.termType = "Literal"
        literal.value = value
        literal.language = ""
        if let namedNode = languageOrDatatype as? NamedNode {
            literal.datatype = namedNode
        } else if let language = languageOrDatatype as? String {
            literal.language = language
            literal.datatype = namedNode(value: "http://www.w3.org/1999/02/22-rdf-syntax-ns#langString", context: moc)
        }
        return literal
    }
    
    static func quad(subject: Term, predicate: Term, object: Term, graph: Term? = nil, context moc: NSManagedObjectContext) -> Quad {
        let quad = Quad(context: moc)
        if let graph = graph {
            quad.graph = graph
        } else {
            let defaultGraph = DefaultGraph(context: moc)
            defaultGraph.termType = "DefaultGraph"
            defaultGraph.value = ""
            quad.graph = defaultGraph
        }
        quad.predicate = predicate
        quad.subject = subject
        quad.object = object
        return quad
    }
}
