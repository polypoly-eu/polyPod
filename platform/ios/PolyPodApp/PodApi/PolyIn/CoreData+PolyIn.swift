// Please remove this line and the empty one after it

import Foundation
import CoreData

extension CoreDataStack: PolyIn {
    func addQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void) {
        perform { managedContext in
            do {
                let managedContext = try managedContext.get()
                for quad in quads {
                    createNode(for: quad, in: managedContext)
                }
                try managedContext.save()
                completionHandler(nil)
            } catch {
                Log.error("Could not save. \(error)")
                completionHandler(error)
            }
        }
    }
    
    func matchQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void) {
        let (predicate, filterOperation) = quadsPredicateAndFilter(matcher: matcher)
        perform { managedContext in
            do {
                let managedContext = try managedContext.get()
                let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                fetchRequest.predicate = predicate
                var quads = try managedContext.fetch(fetchRequest)
                
                if let filterOperation = filterOperation {
                    quads = quads.filter(filterOperation)
                }
                
                let result = extendedData(from: quads)
                completionHandler(result, nil)
            } catch {
                completionHandler(nil, error)
            }
        }
    }
    
    func deleteQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void) {
        perform { managedContext in
            for quad in quads {
                let (predicate, filterOperation) = quadsPredicateAndFilter(matcher: quad)
                
                do {
                    let managedContext = try managedContext.get()
                    let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                    fetchRequest.predicate = predicate
                    var quads = try managedContext.fetch(fetchRequest)
                    
                    if let filterOperation = filterOperation {
                        quads = quads.filter(filterOperation)
                    }
                    
                    for quad in quads {
                        managedContext.delete(quad)
                    }
                } catch {
                    completionHandler(error)
                }
            }
            completionHandler(nil)
        }
    }
    
    func hasQuads(quads: [ExtendedData], completionHandler: @escaping (Bool) -> Void) {
        perform { managedContext in
            for quad in quads {
                let (predicate, filterOperation) = quadsPredicateAndFilter(matcher: quad)
                do {
                    let managedContext = try managedContext.get()
                    let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                    fetchRequest.predicate = predicate
                    var quads = try managedContext.fetch(fetchRequest)
                    
                    if let filterOperation = filterOperation {
                        quads = quads.filter(filterOperation)
                    }
                    if !quads.isEmpty {
                        completionHandler(true)
                        return
                    }
                } catch {
                    // Silently ignore
                }
            }
            completionHandler(false)
        }
    }
}

fileprivate func quadsPredicateAndFilter(matcher: ExtendedData) -> (NSPredicate, ((Quad) -> Bool)?) {
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

@discardableResult
private func createNode(for extendedData: ExtendedData, in managedContext: NSManagedObjectContext) -> NSManagedObject? {
    let entityName = extendedData.classname.replacingOccurrences(of: "@polypoly-eu/rdf.", with: "")
    
    guard let entity = NSEntityDescription.entity(forEntityName: entityName, in: managedContext) else {
        assert(false)
        return nil
    }
    
    let node = NSManagedObject(entity: entity, insertInto: managedContext)
    
    for (key, value) in extendedData.properties {
        if let childExtendedData = value as? ExtendedData {
            let childNode = createNode(for: childExtendedData, in: managedContext)
            node.setValue(childNode, forKey: key)
        } else {
            if entity.attributesByName[key] == nil {
                Log.error("Warning: Attempted to set attribute \(key) which is not in \(entityName)")
                continue
            }
            node.setValue(value, forKeyPath: key)
        }
    }
    
    return node
}

fileprivate func extendedData(from quads: [Quad]) -> [ExtendedData] {
    var result: [ExtendedData] = []
    
    for (index, quad) in quads.enumerated() {
        var isDuplicate = false
        for otherIndex in index+1..<quads.count {
            let otherQuad = quads[otherIndex]
            if otherQuad.matches(other: quad) {
                isDuplicate = true
                break
            }
        }
        if !isDuplicate {
            let extendedData = createExtendedData(for: quad)
            result.append(extendedData)
        }
    }
    
    return result
}

fileprivate func createExtendedData(
    for managedObject: NSManagedObject,
    from sourceRelationship: NSManagedObject? = nil
) -> ExtendedData {
    let classname = "@polypoly-eu/rdf." + String(describing: type(of: managedObject))
    let attributes = managedObject.entity.attributesByName
    let relationships = managedObject.entity.relationshipsByName
    var properties: [String: Any] = [:]
    for (attribute, _) in attributes {
        if let value = managedObject.value(forKey: attribute) {
            properties[attribute] = value
        }
    }
    for (relationship, _) in relationships {
        if let value = managedObject.value(forKey: relationship) as? NSManagedObject {
            // Avoid infinite recursion for inverse relationships, this
            // wouldn't work for transitive inverse relationships, however.
            if value != sourceRelationship {
                properties[relationship] =
                createExtendedData(for: value, from: managedObject)
            }
        }
    }
    let extendedData = ExtendedData(classname: classname, properties: properties)
    return extendedData
}
