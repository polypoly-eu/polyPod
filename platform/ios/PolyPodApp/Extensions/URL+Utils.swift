import Foundation

extension URL {
    func isPDF() -> Bool {
        return self.lastPathComponent.lowercased().hasSuffix(".pdf")
    }
    
    func isPNG() -> Bool {
        return self.lastPathComponent.lowercased().hasSuffix(".png")
    }
}
