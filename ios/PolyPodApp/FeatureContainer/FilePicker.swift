import UIKit

class FilePicker: NSObject, UIDocumentPickerDelegate {
    private var currentCompletion: ((URL?) -> Void)?
    
    private lazy var documentPickerController: UIDocumentPickerViewController = {
        let controller = UIDocumentPickerViewController(
            documentTypes: ["public.item"],
            in: .open
        )
        controller.delegate = self
        return controller
    }()
    
    func pick(completion: @escaping (URL?) -> Void) {
        if currentCompletion != nil {
            completion(nil)
            return
        }
        currentCompletion = completion
        
        let viewController =
            UIApplication.shared.windows.first!.rootViewController!
        viewController.present(documentPickerController, animated: true)
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
        // It shouldn't _quite_ be necessary to dismiss the controller
        // manually, but it's an attempted workaround for PROD4POD-859
        documentPickerController.dismiss(animated: true, completion: nil)
    }
}
