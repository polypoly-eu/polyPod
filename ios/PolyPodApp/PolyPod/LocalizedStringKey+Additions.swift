//
//  LocalizedStringKey+Additions.swift
//  PolyPod
//
//  Created by Felix Dahlke on 20.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

extension LocalizedStringKey {
    private var key: String {
        let description = "\(self)"
        let components = description.components(separatedBy: "key: \"")
            .map { $0.components(separatedBy: "\",") }
        return components[1][0]
    }

    func toLocalizedString() -> String {
        return NSLocalizedString(key, comment: "")
    }
}
