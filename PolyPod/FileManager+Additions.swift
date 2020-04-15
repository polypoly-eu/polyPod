//
//  FileManager+Additions.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 02.04.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit

extension FileManager {
    func copyBundleFile(forResource name: String, ofType ext: String, toDestinationUrl dest: URL) throws {
        if let bundlePath = Bundle.main.path(forResource: name, ofType: ext) {
            let fileName = "\(name).\(ext)"
            let fullDestPath = dest.appendingPathComponent(fileName)
            let fullDestPathString = fullDestPath.path

            try FileManager.default.copyItem(atPath: bundlePath, toPath: fullDestPathString)
        }
    }
}
