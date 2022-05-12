class ErrorUploader {

    func uploadToServer(error: Error) {
        console.log("Upload Error: \(error.localizedDescription)")
    }
}