import Foundation
import CoreData

let typeIRI = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";

struct ValueModel {
    var type: String
}

struct EntityModel {
    var schema: String
    var type: String
    var valueModels: [String: ValueModel]
    
    func toQuads(entity: LiftedEntity, context moc: NSManagedObjectContext) -> [Quad] {
        let uuid = UUID().uuidString
        let subject = DataFactory.namedNode(value: uuid, context: moc)
        let predicate = DataFactory.variable(value: typeIRI, context: moc)
        let object = DataFactory.namedNode(value: schema + type, context: moc)
        
        var quads: [Quad] = [DataFactory.quad(subject: subject, predicate: predicate, object: object, context: moc)]
        
        for (key, value) in valueModels {
            let subject = DataFactory.namedNode(value: uuid, context: moc)
            let predicate = DataFactory.namedNode(value: schema + key, context: moc)
            let object = DataFactory.literal(value: entity.value(for: key), languageOrDatatype: DataFactory.namedNode(value: schema + value.type, context: moc), context: moc)
            
            let quad = DataFactory.quad(subject: subject, predicate: predicate, object: object, context: moc)
            quads.append(quad)
        }
        
        return quads
    }
}

protocol LiftedEntity {
    static func entityModel() -> EntityModel
    func value(for property: String) -> String
}
