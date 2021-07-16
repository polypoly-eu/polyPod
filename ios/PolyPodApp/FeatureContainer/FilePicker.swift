import UIKit

class FilePicker: NSObject, UIDocumentPickerDelegate {
    private var currentCompletion: ((Data?) -> Void)?
    
    func pick(completion: @escaping (Data?) -> Void) {
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
        let url = urls.first!
        let contents = try? Data(contentsOf: url)
        complete(contents)
    }
    
    func documentPickerWasCancelled(
        _ controller: UIDocumentPickerViewController
    ) {
        complete(nil)
    }
    
    private func complete(_ data: Data?) {
        currentCompletion?(data)
        currentCompletion = nil
    }
}
