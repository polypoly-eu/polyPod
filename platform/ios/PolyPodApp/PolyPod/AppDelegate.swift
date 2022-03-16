import BackgroundTasks
import UIKit
import CoreData

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    private static let updateNotificationCheckIdentifier = "coop.polypoly.polypod.updateNotificationCheck"
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        
        Log.bootstrap()
        Log.info("Application initialized")

        UserDefaults.standard.disableDataProtection()
        let defaults = UserDefaults.standard
        if defaults.bool(forKey: UserDefaults.Keys.resetUserDefaults.rawValue) {
            Log.info("Resetting all user defaults")
            UserDefaults.standard.reset()
        }
        
        // Location tracking is disabled for now - no feature needs it
        //LocationTracker.shared.startLocationLogging()
        
        CoreDataStack.shared.isProtectedDataAvailable = { completion in
            dispatchToMainQueue {
                completion(UIApplication.shared.isProtectedDataAvailable)
            }
        }
        
        if application.isProtectedDataAvailable {
            CoreDataStack.shared.protectedDataDidBecomeAvailable()
            CoreDataStack.shared.perform { context in
                let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
                let count = try! context.get().count(for: fetchRequest)
                Log.debug("Initialised triple store. Number of quads in Core Data: \(count)")
            }
        }
        
        // Disabled for now, need to investigate the issue with multiple notifications
        // while the device is locked
        self.registerUpdateNotificationCheck()
        
        return true
    }
    
    func applicationWillTerminate(_ application: UIApplication) {
        Log.info("Application terminated")
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
        DataProtection.instance.protectedDataDidBecomeAvailable()
        // Potentially CoreDataStack can use DataProtection class instead
        CoreDataStack.shared.protectedDataDidBecomeAvailable()
    }
    
    /*
     On a device that uses content protection, protected files are stored in an encrypted form and made available only at certain times, usually when the device is unlocked.
     This notification lets your app know that the device is about to be locked and that any protected files it is currently accessing might become unavailable shortly.
     
     If your app is currently accessing a protected file, you can use this method to release any references to that file.
     Although it is not an error to access the file while the device is locked, any attempts to do so will fail.
     Therefore, if your app depends on the file, you might want to take steps to avoid using that file while the device is locked.
     */
    func applicationProtectedDataWillBecomeUnavailable(_ application: UIApplication) {
        DataProtection.instance.protectedDataWillBecomeUnavailable()
        // Potentially CoreDataStack can use DataProtection class instead
        CoreDataStack.shared.protectedDataWillBecomeUnavailable()
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
