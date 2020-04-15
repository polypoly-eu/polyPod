//
//  FeaturesWallet.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 17.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation
import ZIPFoundation
import Zip

class FeaturesWallet {

    static let shared = FeaturesWallet()
    
    lazy var featuresFileUrl: URL = {
        let documentsDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first!
        let documentsUrl = URL(fileURLWithPath: documentsDirectory)
        let featuresUrl = documentsUrl.appendingPathComponent("Features")
        return featuresUrl
    }()
    
    func cleanFeatures() {
        let documentsDirectory = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true).first!
        let documentsUrl = URL(fileURLWithPath: documentsDirectory)
        let featuresUrl = documentsUrl.appendingPathComponent("Features")
        
        do {
            try FileManager.default.removeItem(at: featuresUrl)
        } catch {
            print(error.localizedDescription);
        }
        
        let quadsUrl = documentsUrl.appendingPathComponent("quads.json")
        
        do {
            try FileManager.default.removeItem(at: quadsUrl)
        } catch {
            print(error.localizedDescription);
        }
    }
    
    func featuresList() -> [String] {
        var featuresList: [String] = []
        
        do {
            let directoryContents = try FileManager.default.contentsOfDirectory(at: featuresFileUrl, includingPropertiesForKeys: nil)

            directoryContents.forEach { (url) in
                featuresList.append(url.lastPathComponent)
            }
        } catch {
            print(error.localizedDescription)
        }
        
        return featuresList
    }
    
    func importFeatures() {
        importFeature("helloWorld")
        importFeature("twitterImporter")
        importFeature("polyExplorer")
        importFeature("dataBrowser")
    }
    
    private func importFeature(_ featureName: String) {
        let featureDirUrl = URL(string: featuresFileUrl.path)!
        let featureUrl = featureDirUrl.appendingPathComponent(featureName)
        if !FileManager.default.fileExists(atPath: featureUrl.absoluteString) {
            do {
                try FileManager.default.createDirectory(atPath: featureDirUrl.absoluteString, withIntermediateDirectories: true, attributes: nil)
                if let _ = Bundle.main.path(forResource: featureName, ofType: "zip") {
                    let filePath = Bundle.main.url(forResource: featureName, withExtension: "zip")!
                    let unzipDirectory = try Zip.quickUnzipFile(filePath)
                    try FileManager.default.moveItem(at: unzipDirectory, to: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "feature", ofType: "js", toDestinationUrl: featureUrl)
                    try FileManager.default.copyBundleFile(forResource: "polyLook", ofType: "css", toDestinationUrl: featureUrl)
                    print("Imported feature: ", featureName)
                } else {
                    print("Feature for import not found: ", featureName)
                }
            } catch {
                print(error.localizedDescription);
            }
        }
    }
    
}
