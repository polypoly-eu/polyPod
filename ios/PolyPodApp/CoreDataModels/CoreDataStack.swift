// Please remove this line and the empty one after it

import Foundation
import CoreData

final class CoreDataStack {
    static let shared = CoreDataStack()

    private let container: NSPersistentContainer
    private var context: NSManagedObjectContext?

    private init() {
        let modelName = "PolyPodModel"
        let model = NSManagedObjectModel.with(name: modelName, in: Bundle(for: CoreDataStack.self))
        container = NSPersistentContainer.load(from: NSPersistentContainer.defaultDirectoryURL().appendingPathComponent("\(modelName).sqlite"),
                                               name: modelName,
                                               model: model)
    }
    
    func perform(_ operation: @escaping (NSManagedObjectContext) -> Void,
                 file: String = #file,
                 line: Int = #line,
                 function: String = #function) {
        guard let context = context else {
            Log.error("Invalid attempt to execute core data operation in \(function) from \(file) at \(line)")
            return
        }
        context.perform { operation(context) }
    }
}

// MARK: - Protected data handling

extension CoreDataStack {
    func protectedDataDidBecomeAvailable() {
        var error: Error?
        container.loadPersistentStores {
            error = $1
        }
        
        if let error = error {
            Log.debug("Failed to load persistent stores \(error)")
        } else {
            Log.debug("Loaded persistent stores")
            context = container.newBackgroundContext()
        }
    }
    
    func protectedDataWillBecomeUnavailable() {
        let coordinator = self.container.persistentStoreCoordinator
        perform { context in
            do {
                try? context.save()
                try coordinator.persistentStores.forEach(coordinator.remove)
                Log.debug("Unloaded persistent stores")
            } catch {
                Log.debug("Failed to unload persistent stores -> \(error)")
            }
        }
        context = nil
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
    static func load(from url: URL, name: String, model: NSManagedObjectModel) -> NSPersistentContainer {
        let container = NSPersistentContainer(name: name, managedObjectModel: model)
        container.persistentStoreDescriptions = [NSPersistentStoreDescription.make(for: url)]
        return container
    }
}

extension NSManagedObjectModel {
    static func with(name: String, in bundle: Bundle) -> NSManagedObjectModel {
        bundle
            .url(forResource: name, withExtension: "momd")
            // Force unwrap, this code should fail only if core data model is missing from the project.
            .flatMap(NSManagedObjectModel.init(contentsOf:))!
        
    }
}
