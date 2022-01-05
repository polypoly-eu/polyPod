import UIKit
import CoreData

extension PolyIn {
    func addQuads(quads: [ExtendedData], completionHandler: (Error?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(PodApiError.noAppDelegate)
            return
        }
        
        let managedContext = appDelegate.persistentContainer.viewContext
        
        for quad in quads {
            let _ = createNode(for: quad, in: managedContext)
        }
        
        do {
            try managedContext.save()
            completionHandler(nil)
        } catch {
            Log.error("Could not save. \(error)")
            completionHandler(error)
        }
    }
    
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
}
