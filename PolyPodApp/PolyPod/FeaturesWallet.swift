//
//  FeaturesWallet.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 17.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation
import Zip

class FeaturesWallet {

    static let shared = FeaturesWallet()
    
    lazy var featuresFileUrl: URL = {
        do {
            let documentsUrl = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            let featuresUrl = documentsUrl.appendingPathComponent("Features")
            return featuresUrl
        } catch {
            print(error.localizedDescription);
        }
        return URL(fileURLWithPath: "")
    }()
    
    func cleanFeatures() {
        do {
            let documentsUrl = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            let featuresUrl = documentsUrl.appendingPathComponent("Features")
            try FileManager.default.removeItem(at: featuresUrl)
        } catch {
            print(error.localizedDescription);
        }
    }
    
    func featuresList() -> [String] {
        var featuresList: [String] = []
        
        do {
            let directoryContents = try FileManager.default.contentsOfDirectory(at: featuresFileUrl, includingPropertiesForKeys: nil)
            let subDirs = directoryContents.filter{ $0.hasDirectoryPath }
            featuresList = subDirs.map{ $0.lastPathComponent }
        } catch {
            print(error.localizedDescription)
        }
        
        return featuresList
    }
    
    func importFeatures() {
        createFeaturesFolder()
        importFeature("podCheck")
        importFeature("questionnaire-feature")
    }
    
    private func createFeaturesFolder() {
        let featureDirUrl = URL(string: featuresFileUrl.path)!
        do {
            try FileManager.default.createDirectory(atPath: featureDirUrl.absoluteString, withIntermediateDirectories: true, attributes: nil)
        } catch {
            print(error.localizedDescription);
        }
    }
    
    private func importFeature(_ featureName: String) {
        let featureDirUrl = URL(string: featuresFileUrl.path)!
        let featureUrl = featureDirUrl.appendingPathComponent(featureName)
        if !FileManager.default.fileExists(atPath: featureUrl.absoluteString) {
            do {
                if let _ = Bundle.main.path(forResource: featureName, ofType: "zip") {
                    let filePath = Bundle.main.url(forResource: featureName, withExtension: "zip")!
                    let unzipDirectory = try Zip.quickUnzipFile(filePath)
                    try FileManager.default.moveItem(at: unzipDirectory, to: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "pod", ofType: "html", toDestinationUrl: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "polyLook", ofType: "css", toDestinationUrl: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "initIframe", ofType: "js", toDestinationUrl: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "pod", ofType: "js", toDestinationUrl: featuresFileUrl.appendingPathComponent(featureName))
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
