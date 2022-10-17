import BackgroundTasks
import CoreData
import MessagePack
import PolyPodCoreSwift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    private static let updateNotificationCheckIdentifier = "coop.polypoly.polypod.updateNotificationCheck"

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // Override point for customization after application launch.
        Log.bootstrap()
        Log.info("Application initialized")

        let defaults = UserDefaults.standard
        defaults.disableDataProtection()
        let resetDefaults = defaults.bool(
            forKey: UserDefaults.Keys.resetUserDefaults.rawValue
        )
        if resetDefaults {
            Log.info("Resetting all user defaults")
            UserDefaults.standard.reset()
        }

        initCore(resetPreferences: resetDefaults)

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

        self.registerUpdateNotificationCheck()

        return true
    }

    private func initCore(resetPreferences: Bool) {
        let fsRoot = try! FileManager.default.url(
            for: .documentDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: false
        )

        switch Core.instance.bootstrap(
            args: .init(
                languageCode: Language.current,
                fsRoot: fsRoot.path,
                updateNotificationId: UpdateNotificationData().id
            )
        ) {
        case .success:
            Log.info("Core bootstraped!")
        case let .failure(content):
            Log.error(content.localizedDescription)
            if let coreFailure = content as? CoreFailure {
                if coreFailure.code == .coreAlreadyBootstrapped {
                    break
                }
            }
            fatalError(content.localizedDescription)
        }

        if resetPreferences {
            Log.info("Clearing core preferences")
            _ = Core.instance.executeRequest(.clearPreferences).inspectError {
                Log.error("clearPreferences request failed: \($0.localizedDescription)")
            }
        }

        _ = Core.instance.executeRequest(.handleStartup).inspectError {
            Log.error("handleStartup request failed: \($0.localizedDescription)")
        }
    }

    func applicationWillTerminate(_ application: UIApplication) {
        Log.info("Application terminated")
    }

    private func registerUpdateNotificationCheck() {
        BGTaskScheduler.shared.register(
            forTaskWithIdentifier: Self.updateNotificationCheckIdentifier,
            using: nil
        ) { task in
            self.handleUpdateNotificationCheck(task)
        }
    }

    private func handleUpdateNotificationCheck(_ task: BGTask) {
        task.expirationHandler = {
            Log.error("Update notification check expired")
            task.setTaskCompleted(success: false)
        }

        if UpdateNotification.showPush {
            UpdateNotification.handlePushSeen()
            showUpdateNotification()
        }
        task.setTaskCompleted(success: true)
        scheduleUpdateNotificationCheck()
    }

    private func showUpdateNotification() {
        let identifier = UUID().uuidString

        let content = UNMutableNotificationContent()
        let notificationData = UpdateNotificationData()
        content.title = notificationData.title
        content.body = notificationData.text

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

    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        // Called when a new scene session is being created.
        // Use this method to select a configuration to create the new scene with.
        return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
    }

    // MARK: - Data protection availability

    /*
     On a device that uses content protection, protected files are stored in an encrypted form
     and made available only at certain times, usually when the device is unlocked.
     This notification lets your app know that the device is now unlocked and
     that you may access certain types of protected files again.
     */
    func applicationProtectedDataDidBecomeAvailable(_ application: UIApplication) {
        DataProtection.instance.protectedDataDidBecomeAvailable()
        // Potentially CoreDataStack can use DataProtection class instead
        CoreDataStack.shared.protectedDataDidBecomeAvailable()
    }

    /*
     On a device that uses content protection, protected files are stored in an encrypted form
     and made available only at certain times, usually when the device is unlocked.
     This notification lets your app know that the device is about to be locked and
     that any protected files it is currently accessing might become unavailable shortly.

     If your app is currently accessing a protected file, you can use this method
     to release any references to that file. Although it is not an error to access the file
     while the device is locked, any attempts to do so will fail. Therefore, if your app
     depends on the file, you might want to take steps to avoid using that file while the device is locked.
     */
    func applicationProtectedDataWillBecomeUnavailable(_ application: UIApplication) {
        DataProtection.instance.protectedDataWillBecomeUnavailable()
        // Potentially CoreDataStack can use DataProtection class instead
        CoreDataStack.shared.protectedDataWillBecomeUnavailable()
    }

    func scheduleUpdateNotificationCheck() {
        let updateNotificationCheckIdentifier = Self.updateNotificationCheckIdentifier
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert]) {_, _ in }
        let task = BGProcessingTaskRequest(identifier: updateNotificationCheckIdentifier)
        task.earliestBeginDate = Date(timeIntervalSinceNow: TimeInterval(UpdateNotificationData().pushDelay))
        task.requiresExternalPower = false
        task.requiresNetworkConnectivity = false
        do {
            try BGTaskScheduler.shared.submit(task)
        } catch {
            Log.error(
                "Failed to schedule task " +
                "\(updateNotificationCheckIdentifier): \(error.localizedDescription)"
            )
        }
    }
}
