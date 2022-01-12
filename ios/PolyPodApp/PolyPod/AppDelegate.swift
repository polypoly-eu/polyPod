import BackgroundTasks
import UIKit
import CoreData

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    private static let updateNotificationCheckIdentifier = "coop.polypoly.polypod.updateNotificationCheck"
    
    lazy var coredDataStack: CoreDataStack? = {
        do {
            let stack = try CoreDataStack(storageURL: NSPersistentContainer.defaultDirectoryURL().appendingPathComponent("poly-pod.sqlite"))
            stack.perform { context in
                let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                let count = try! context.count(for: fetchRequest)
                Log.debug("Initialised triple store. Number of quads in Core Data: \(count)")
            }
            return stack
        } catch {
            print("Failed to create stack \(error)")
            return nil
        }
    }()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        let defaults = UserDefaults.standard
        if defaults.bool(forKey: UserDefaults.Keys.resetUserDefaults.rawValue) {
            Log.info("Resetting all user defaults")
            UserDefaults.standard.reset()
        }
        
        FeatureStorage.shared.cleanFeatures()
        FeatureStorage.shared.importFeatures()
        
        // Location tracking is disabled for now - no feature needs it
        //LocationTracker.shared.startLocationLogging()
        
        self.registerUpdateNotificationCheck()
        
        return true
    }
    
    private func registerUpdateNotificationCheck() {
        BGTaskScheduler.shared.register(forTaskWithIdentifier: AppDelegate.updateNotificationCheckIdentifier, using: nil) { task in
            self.handleUpdateNotificationCheck(task)
        }
    }
    
    private func handleUpdateNotificationCheck(_ task: BGTask) {
        task.expirationHandler = {
            Log.error("Update notification check expired")
            task.setTaskCompleted(success: false)
        }
        
        let notification = UpdateNotification()
        if notification.showPush {
            notification.handlePushSeen()
            showUpdateNotification()
        }
        task.setTaskCompleted(success: true)
        scheduleUpdateNotificationCheck()
    }
    
    private func showUpdateNotification() {
        let identifier = UUID().uuidString
        
        let content = UNMutableNotificationContent()
        let notification = UpdateNotification()
        content.title = notification.title
        content.body = notification.text
        
        // We show the notification with a delay to make debugging easier:
        // It won't show up if the app has focus.
        let delay = 10.0
        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: delay, repeats: false)
        let request = UNNotificationRequest(identifier: identifier, content: content, trigger: trigger)
        
        let notificationCenter = UNUserNotificationCenter.current()
        notificationCenter.add(request) { error in
            if error != nil {
                Log.error("Error showing update notification: \(error!.localizedDescription)")
            }
        }
    }
    
    // MARK: - UISceneSession Lifecycle
    
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
    
    // MARK: - Data protection availability

    /*
     On a device that uses content protection, protected files are stored in an encrypted form and made available only at certain times, usually when the device is unlocked.
     This notification lets your app know that the device is now unlocked and that you may access certain types of protected files again.
     */
    func applicationProtectedDataDidBecomeAvailable(_ application: UIApplication) {
        
    }
    
    /*
     On a device that uses content protection, protected files are stored in an encrypted form and made available only at certain times, usually when the device is unlocked.
     This notification lets your app know that the device is about to be locked and that any protected files it is currently accessing might become unavailable shortly.
     
     If your app is currently accessing a protected file, you can use this method to release any references to that file.
     Although it is not an error to access the file while the device is locked, any attempts to do so will fail.
     Therefore, if your app depends on the file, you might want to take steps to avoid using that file while the device is locked.
     */
    func applicationProtectedDataWillBecomeUnavailable(_ application: UIApplication) {
        
    }
    
    lazy var persistentContainer: NSPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
         */
        let container = NSPersistentContainer(name: "PolyPodModel")
        
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                fatalError("Unresolved error \(error), \(error.userInfo)")
            }
            
            // Enforce encryption
            do {
                let persistentStores = container.persistentStoreCoordinator.persistentStores
                guard persistentStores.count >= 0 else {
                    fatalError("Error enforcing encryption: No persistent stores found")
                }
                let persistentStore = persistentStores[0]
                var metadata = persistentStore.metadata
                if !metadata!.contains(where: {(key: String, value: Any) in
                    return key == NSPersistentStoreFileProtectionKey
                }) {
                    metadata?[NSPersistentStoreFileProtectionKey] = FileProtectionType.complete
                    container.persistentStoreCoordinator.setMetadata(metadata, for: persistentStore)
                    try container.viewContext.save()
                }
            } catch {
                if let error = error as NSError? {
                    fatalError("Encryption error \(error), \(error.userInfo)")
                }
            }
        })
        
        let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
        let count = try! container.viewContext.count(for: fetchRequest)
        Log.debug("Initialised triple store. Number of quads in Core Data: \(count)")
        
        return container
    }()
    
    // MARK: - Core Data Saving support
    
    func saveContext () {
        let context = persistentContainer.viewContext
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                let nserror = error as NSError
                fatalError("Unresolved error \(nserror), \(nserror.userInfo)")
            }
        }
    }
    
    func scheduleUpdateNotificationCheck() {
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert]) {_, _ in }
        
        let task = BGProcessingTaskRequest(identifier: AppDelegate.updateNotificationCheckIdentifier)
        task.earliestBeginDate = Date(timeIntervalSinceNow: TimeInterval(UpdateNotification().pushDelay))
        task.requiresExternalPower = false
        task.requiresNetworkConnectivity = false
        do {
            try BGTaskScheduler.shared.submit(task)
        } catch {
            Log.error("Failed to schedule task \(AppDelegate.updateNotificationCheckIdentifier): \(error.localizedDescription)")
        }
    }
}
