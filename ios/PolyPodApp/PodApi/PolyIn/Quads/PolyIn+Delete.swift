import UIKit
import CoreData

extension PolyIn {
    func deleteQuads(quads: [ExtendedData], completionHandler: @escaping (Error?) -> Void) -> Void {
        Log.debug("Deleting quads")
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(PodApiError.noAppDelegate)
            return
        }
        
        appDelegate.coredDataStack.perform({ managedContext in
            for quad in quads {
                let (predicate, filterOperation) = self.quadsPredicateAndFilter(matcher: quad)
                
                do {
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
        })
    }
}
