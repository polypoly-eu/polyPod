import Foundation
import CoreData

extension DefaultGraph {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<DefaultGraph> {
        return NSFetchRequest<DefaultGraph>(entityName: "DefaultGraph")
    }
}
