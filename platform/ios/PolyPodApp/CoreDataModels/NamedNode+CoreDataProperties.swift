import CoreData
import Foundation

extension NamedNode {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<NamedNode> {
        return NSFetchRequest<NamedNode>(entityName: "NamedNode")
    }
}
