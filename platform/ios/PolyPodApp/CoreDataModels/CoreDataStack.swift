import Foundation
import CoreData

final class CoreDataStack {
    static let shared = CoreDataStack()
    
    // MARK: - Private API
    
    private let container: NSPersistentContainer
    
    /*
     This is the context to be used to perform all operations.
     
     Note: It is optional, as persistent stores are not loaded at initialization, but only when protected data is available.
     When protected data becomes unavailable, context will be saved and nullified, see protectedDataWillBecomeUnavailable.
     */
    private var context: NSManagedObjectContext?
    
    private init() {
        let modelName = "PolyPodModel"
        let model = NSManagedObjectModel.with(name: modelName, in: Bundle(for: CoreDataStack.self))
        container = NSPersistentContainer.load(from: NSPersistentContainer.defaultDirectoryURL().appendingPathComponent("\(modelName).sqlite"),
                                               name: modelName,
                                               model: model)
    }
    
    // MARK: - Internal API
    
    /*
     Allows asking if protected data is available.
     
     Note: It is unfortunate that this is needed. We cannot just rely on data protection delegate methods
     from app delegate. For example, protectedDataWillBecomeUnavailable will only be called if device is locked
     while polypod is in FOREGROUND. Otherwise no events of having protected data unavailable are sent.
     This closure will be used to imperatively ask if protected data is avaialble for use.
     */
    var isProtectedDataAvailable: ((@escaping (Bool) -> Void) -> Void)!
    
    /// Use this function to perform any CoreData operation on PolyPod model.
    /// The operation will be handed the NSManagedObjectContext if possible, otherwise an error will be handed.
    func perform(_ operation: @escaping (Result<NSManagedObjectContext, Error>) -> Void,
                 file: String = #file,
                 line: Int = #line,
                 function: String = #function) {
        isProtectedDataAvailable { available in
            guard let context = self.context, available == true else {
                Log.error("Invalid attempt to execute core data operation in \(function) from \(file) at \(line)")
                return operation(.failure(PodApiError.protectedDataUnavailable))
            }
            context.perform { operation(.success(context)) }
        }
    }
}

// MARK: - Protected data handling

extension CoreDataStack {
    
    /// Tell core data stack that protected data is available.
    /// Persistent stores will be loaded and context will be created. After this setup, operations can be performed.
    func protectedDataDidBecomeAvailable() {
        /// protectedDataWillBecomeUnavailable will not be called when the device is locked but PolyPod is not in foreground.
        /// Therefore the context and persistent stores didn't get a chance to be cleared. Avoid loading the persistent stores twice.
        guard context == nil else { return }
        
        var error: Error?
        container.loadPersistentStores {
            error = $1
        }
        
        if let error = error {
            Log.debug("Failed to load persistent stores -> \(error)")
        } else {
            Log.error("Loaded persistent stores")
            context = container.newBackgroundContext()
        }
    }
    
    /// Tell core data that protected data is about to become unavailable.
    /// Context will be saved, after wich persistent stores will be removed along with nullifying the context.
    func protectedDataWillBecomeUnavailable() {
        let coordinator = self.container.persistentStoreCoordinator
        perform { context in
            do {
                try? context.get().save()
                try coordinator.persistentStores.forEach(coordinator.remove)
                Log.debug("Unloaded persistent stores")
            } catch {
                Log.error("Failed to unload persistent stores -> \(error)")
            }
        }
        context = nil
    }
}

// MARK: - Core Data setup

fileprivate extension NSPersistentStoreDescription {
    static func make(for persistentStoreURL: URL) -> NSPersistentStoreDescription {
        let persistentStoreDescription = NSPersistentStoreDescription(url: persistentStoreURL)
        
        persistentStoreDescription.type = NSSQLiteStoreType
        persistentStoreDescription.shouldMigrateStoreAutomatically = true
        persistentStoreDescription.shouldInferMappingModelAutomatically = true
        persistentStoreDescription.setOption(FileProtectionType.complete as NSObject, forKey: NSPersistentStoreFileProtectionKey)
        
        return persistentStoreDescription
    }
}

fileprivate extension NSPersistentContainer {
    static func load(from url: URL, name: String, model: NSManagedObjectModel) -> NSPersistentContainer {
        let container = NSPersistentContainer(name: name, managedObjectModel: model)
        container.persistentStoreDescriptions = [NSPersistentStoreDescription.make(for: url)]
        return container
    }
}

fileprivate extension NSManagedObjectModel {
    static func with(name: String, in bundle: Bundle) -> NSManagedObjectModel {
        bundle
            .url(forResource: name, withExtension: "momd")
        // Can use force unwrap, this code should fail only if core data model is missing from the project.
            .flatMap(NSManagedObjectModel.init(contentsOf:))!
    }
}
