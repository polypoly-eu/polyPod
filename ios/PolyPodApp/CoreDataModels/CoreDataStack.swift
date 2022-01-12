// Please remove this line and the empty one after it

import Foundation
import CoreData

final class CoreDataStack {
    
    enum Error: Swift.Error {
        case modelNotFound
        case failedToLoadPersistentContainer(Swift.Error)
    }

    private let container: NSPersistentContainer
    private let context: NSManagedObjectContext

    init(storageURL: URL) throws {
        guard let model = NSManagedObjectModel.with(name: "PolyPodModel", in: Bundle(for: CoreDataStack.self)) else {
            throw Error.modelNotFound
        }
        
        do {
            container = try NSPersistentContainer.load(from: storageURL, name: "PolyPodModel", model: model)
            // Use background context to execute code on background queue
            context = container.newBackgroundContext()
        } catch {
            throw Error.failedToLoadPersistentContainer(error)
        }
    }
    
    func perform(_ action: @escaping (NSManagedObjectContext) -> Void) {
        let context = self.context
        context.perform { action(context) }
    }
}


extension NSPersistentStoreDescription {
    static func make(for persistentStoreURL: URL) -> NSPersistentStoreDescription {
        let persistentStoreDescription = NSPersistentStoreDescription(url: persistentStoreURL)

        persistentStoreDescription.type = NSSQLiteStoreType
        persistentStoreDescription.shouldMigrateStoreAutomatically = true
        persistentStoreDescription.shouldInferMappingModelAutomatically = true
        persistentStoreDescription.setOption(FileProtectionType.complete as NSObject, forKey: NSPersistentStoreFileProtectionKey)
        
        return persistentStoreDescription
    }
}

extension NSPersistentContainer {
    static func load(from url: URL, name: String, model: NSManagedObjectModel) throws -> NSPersistentContainer {
        let container = NSPersistentContainer(name: name, managedObjectModel: model)
        container.persistentStoreDescriptions = [NSPersistentStoreDescription.make(for: url)]
        
        var loadError: Error?
        container.loadPersistentStores { loadError = $1 }
        if let loadError = loadError {
            throw loadError
        }
        
        return container
    }
}

extension NSManagedObjectModel {
    static func with(name: String, in bundle: Bundle) -> NSManagedObjectModel? {
        bundle
            .url(forResource: name, withExtension: "momd")
            .flatMap(NSManagedObjectModel.init(contentsOf:))
    }
}
