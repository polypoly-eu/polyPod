import UIKit
import CoreData

extension PolyIn {
    func matchQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void) {
        return selectQuads(matcher: matcher, completionHandler: completionHandler)
    }

    func selectQuads(matcher: ExtendedData, completionHandler: @escaping ([ExtendedData]?, Error?) -> Void) {
        Log.debug("Selecting quads")
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil, PodApiError.databaseError)
            return
        }
        
        let (predicate, filterOperation) = quadsPredicateAndFilter(matcher: matcher)
        appDelegate.coredDataStack?.perform({ managedContext in
            do {
                let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                fetchRequest.predicate = predicate
                var quads = try managedContext.fetch(fetchRequest)
                
                if let filterOperation = filterOperation {
                    quads = quads.filter(filterOperation)
                }
                
                let result = self.extendedData(from: quads)
                completionHandler(result, nil)
            } catch {
                completionHandler(nil, error)
            }
        })
    }
    
    private func extendedData(from quads: [Quad]) -> [ExtendedData] {
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
    
    private func createExtendedData(
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
}
