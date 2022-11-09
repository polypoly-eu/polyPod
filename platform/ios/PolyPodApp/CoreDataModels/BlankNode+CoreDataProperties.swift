import CoreData
import Foundation

extension BlankNode {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<BlankNode> {
        return NSFetchRequest<BlankNode>(entityName: "BlankNode")
    }
}
