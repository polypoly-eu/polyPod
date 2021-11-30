import UIKit

class FilePicker: NSObject, UIDocumentPickerDelegate {
    private var currentCompletion: ((URL?) -> Void)?
    
    func mimeToUti(_ mime: String?) -> String {
        guard let mime = mime else { return "public.item" }
        if mime == "application/zip" { return "com.pkware.zip-archive" }
        // TODO: Throw proper error
        print("Unsupported MIME type: \(mime)")
        return mimeToUti(nil)
    }
    
    func pick(type: String?, completion: @escaping (URL?) -> Void) {
        if currentCompletion != nil {
            completion(nil)
            return
        }
        currentCompletion = completion
        
        let documentPickerController = UIDocumentPickerViewController(
            documentTypes: [mimeToUti(type)],
            in: .import
        )
        documentPickerController.delegate = self
        
        // This is a workaround for a fairly nasty issue: On iOS 14.4 and 15.0,
        // potentially other versions as well, on _some_ devices, a presentation
        // style of e.g. .pageSheet (same as .automatic on those versions),
        // .formSheet or .popover will lead to the tap area of buttons towards
        // the top end of the screen (e.g. our navigation bar) to be pushed
        // down, resulting in untappable elements (unless you know you need to
        // tap _below_ them). As a workaround. The previous default,
        // .fullscreen, doesn't lead to this bug. If we stumble upon an iOS
        // version that doesn't have this bug, we can switch it back to
        // .automatic there.
        //
        // See:
        // - https://developer.apple.com/forums/thread/131404
        // - https://stackoverflow.com/q/60026248/368405
        documentPickerController.modalPresentationStyle = .fullScreen
        
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
