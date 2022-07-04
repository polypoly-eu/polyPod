import CoreData
import Foundation

extension Literal {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<Literal> {
        return NSFetchRequest<Literal>(entityName: "Literal")
    }
    
    @NSManaged public var language: String
    @NSManaged public var datatype: NamedNode
}
