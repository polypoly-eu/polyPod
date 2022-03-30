import Foundation
import CoreData

extension Term {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<Term> {
        return NSFetchRequest<Term>(entityName: "Term")
    }
    
    @NSManaged public var termType: String
    @NSManaged public var value: String
}
