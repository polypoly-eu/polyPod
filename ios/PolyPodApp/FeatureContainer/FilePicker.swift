import UIKit

class FilePicker: NSObject, UIDocumentPickerDelegate {
    private var currentCompletion: ((URL?) -> Void)?
    
    func pick(completion: @escaping (URL?) -> Void) {
        if currentCompletion != nil {
            completion(nil)
            return
        }
        currentCompletion = completion
        
        let documentPickerController = UIDocumentPickerViewController(
            documentTypes: ["public.item"],
            in: .import
        )
        documentPickerController.delegate = self
        
        let viewController =
            UIApplication.shared.windows.first!.rootViewController!
        viewController.present(
            documentPickerController,
            animated: true,
            completion: nil
        )
    }
    
    func documentPicker(
        _ controller: UIDocumentPickerViewController,
        didPickDocumentsAt urls: [URL]
    ) {
        complete(url: urls.first!)
    }
    
    func documentPickerWasCancelled(
        _ controller: UIDocumentPickerViewController
    ) {
        complete(url: nil)
    }
    
    private func complete(url: URL?) {
        currentCompletion?(url)
        currentCompletion = nil
    }
}
