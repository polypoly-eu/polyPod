import Foundation

func dispatchToMainQueue(_ operation: @escaping () -> Void) {
    if Thread.isMainThread {
        operation()
    } else {
        DispatchQueue.main.async {
            operation()
        }
    }
}
