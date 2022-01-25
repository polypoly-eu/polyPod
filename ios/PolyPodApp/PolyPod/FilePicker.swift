import UIKit
import MessagePack

struct ExternalFile {
    let url: String
    let name: String
    let size: Int64
    
    public var messagePackObject: MessagePackValue {
        var messagePackMap: [MessagePackValue: MessagePackValue] = [:]
        
        messagePackMap["url"] = .string(url)
        messagePackMap["name"] = .string(name)
        messagePackMap["size"] = .int(size)
        
        return MessagePackValue.map(messagePackMap)
    }
}

class FilePicker: NSObject, UIDocumentPickerDelegate {
    private var currentCompletion: ((ExternalFile?) -> Void)?
    
    func mimeToUti(_ mime: String?) -> String {
        guard let mime = mime else { return "public.item" }
        if mime == "application/zip" { return "com.pkware.zip-archive" }
        // TODO: Throw proper error
        Log.error("Unsupported MIME type: \(mime)")
        return mimeToUti(nil)
    }
    
    func loadExternalFileData(url: URL) -> ExternalFile {
        var fileSize: Int64 = 0
        do {
            let fileAttribute: [FileAttributeKey : Any] =
            try FileManager.default.attributesOfItem(atPath: url.path)
            if let fileNumberSize: NSNumber = fileAttribute[FileAttributeKey.size] as? NSNumber {
                fileSize = Int64(truncating: fileNumberSize)
            }
        } catch {
            Log.error("Failed to load file data: \(error.localizedDescription)")
        }
        return ExternalFile(url: url.absoluteString, name: url.lastPathComponent, size: fileSize)
    }
    
    func pick(type: String?, completion: @escaping (ExternalFile?) -> Void) {
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
        complete(externalFile: loadExternalFileData(url: urls.first!))
    }
    
    func documentPickerWasCancelled(
        _ controller: UIDocumentPickerViewController
    ) {
        complete(externalFile: nil)
    }
    
    private func complete(externalFile: ExternalFile?) {
        currentCompletion?(externalFile)
        currentCompletion = nil
    }
}
