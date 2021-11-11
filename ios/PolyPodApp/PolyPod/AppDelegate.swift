import BackgroundTasks
import UIKit
import CoreData

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    private static let updateNotificationCheckIdentifier = "coop.polypoly.polypod.updateNotificationCheck"
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        let defaults = UserDefaults.standard
        if defaults.bool(forKey: UserDefaults.Keys.resetUserDefaults.rawValue) {
            print("Resetting all user defaults")
            UserDefaults.standard.reset()
        }
        
        FeatureStorage.shared.cleanFeatures()
        FeatureStorage.shared.importFeatures()
        
        // Location tracking is disabled for now - no feature needs it
        //LocationTracker.shared.startLocationLogging()
        
        let managedContext = persistentContainer.viewContext
        let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
        let count = try! managedContext.count(for: fetchRequest)
        print("Number of quads in Core Data:", count)
        
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
            print("Update notification check expired")
            task.setTaskCompleted(success: false)
        }
        
        let notification = UpdateNotification()
        if notification.showPush {
            notification.onPushSeen()
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
                print("Error showing update notification: \(error!.localizedDescription)")
            }
        }
    }
    
    // MARK: UISceneSession Lifecycle
    
    func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }
    
    func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
        // Called when the user discards a scene session.
        // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
        // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
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
            // Enforce encryption
            do {
                let persistentStore = container.persistentStoreCoordinator.persistentStores[0]
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
        })
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
            print("Failed to schedule task \(AppDelegate.updateNotificationCheckIdentifier): \(error.localizedDescription)")
        }
    }
}
