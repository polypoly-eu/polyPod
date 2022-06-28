import CoreData
import Foundation

extension Variable {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<Variable> {
        return NSFetchRequest<Variable>(entityName: "Variable")
    }
}
