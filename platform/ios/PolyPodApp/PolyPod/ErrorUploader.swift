import Foundation

class ErrorUploader {

    func uploadToServer(_ errorMsg: String) {
        Log.error("\n\n\n\nFailed to Upload Error: \(errorMsg)")
        
        
    }


    func uploadToServer(error: Error) {
        console.log("Upload Error: \(error.localizedDescription)")
    }
}