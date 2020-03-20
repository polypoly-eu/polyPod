//
//  FeaturesWallet.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 17.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

let sharedFeaturesWallet = FeaturesWallet()

class FeaturesWallet {

    lazy private var featuresFileUrl: URL = {
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
        let featureUrl = URL(string: featuresFileUrl.path)!.appendingPathComponent(featureName)
        if !FileManager.default.fileExists(atPath: featureUrl.absoluteString) {
            do {
                try FileManager.default.createDirectory(atPath: featureUrl.absoluteString, withIntermediateDirectories: true, attributes: nil)
                print("Imported feature: " + featureName)
            } catch {
                print(error.localizedDescription);
            }
        }
    }
    
}
