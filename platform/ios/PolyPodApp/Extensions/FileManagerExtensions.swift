import UIKit

extension FileManager {
    func copyBundleFile(
        forResource name: String,
        ofType ext: String,
        toDestinationUrl dest: URL
    ) throws {
        if let bundlePath = Bundle.main.path(forResource: name, ofType: ext) {
            let destPath = findDestinationPath(
                forResource: name,
                ofType: ext,
                atDestinationUrl: dest
            )
            try FileManager.default.copyItem(
                atPath: bundlePath,
                toPath: destPath
            )
        }
    }
    
    func hasBundleFile(
        forResource name: String,
        ofType ext: String,
        atDestinationUrl dest: URL
    ) -> Bool {
        let destPath = findDestinationPath(
            forResource: name,
            ofType: ext,
            atDestinationUrl: dest
        )
        return FileManager.default.fileExists(atPath: destPath)
    }
    
    func removeBundleFile(
        forResource name: String,
        ofType ext: String,
        atDestinationUrl dest: URL
    ) throws {
        let destPath = findDestinationPath(
            forResource: name,
            ofType: ext,
            atDestinationUrl: dest
        )
        try FileManager.default.removeItem(atPath: destPath)
    }
}

private func findDestinationPath(
    forResource name: String,
    ofType ext: String,
    atDestinationUrl dest: URL
) -> String {
    dest.appendingPathComponent("\(name).\(ext)").path
}
