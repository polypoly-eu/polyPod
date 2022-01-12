import UIKit
import CoreData

extension PolyIn {
    func hasQuads(quads: [ExtendedData], completionHandler: @escaping (Bool) -> Void) {
        Log.debug("Has quads")
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(false)
            return
        }
        
        appDelegate.coredDataStack?.perform({ managedContext in
            for quad in quads {
                let (predicate, filterOperation) = self.quadsPredicateAndFilter(matcher: quad)
                do {
                    let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                    fetchRequest.predicate = predicate
                    var quads = try managedContext.fetch(fetchRequest)
                    
                    if let filterOperation = filterOperation {
                        quads = quads.filter(filterOperation)
                    }
                    if quads.count > 0 {
                        completionHandler(true)
                        return
                    }
                } catch {
                    // Silently ignore
                }
            }
            completionHandler(false)
        })
    }
}
