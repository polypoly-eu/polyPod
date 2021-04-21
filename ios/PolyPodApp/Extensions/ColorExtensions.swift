//
//  Color+Additions.swift
//  PolyPod
//
//  Created by Felix Dahlke on 21.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

extension Color {
    struct PolyPod {
        static var lightForeground = Color(red: 0.969, green: 0.98, blue: 0.988)
        static var darkForeground = Color(red: 0.059, green: 0.098, blue: 0.22)
        static var lightBackground = Color.white
        static var semiLightBackground = Color(red: 0.929, green: 0.949, blue: 0.969)
    }

    init(fromHex hexValue: String) {
        let scanner = Scanner(string: hexValue)
        if let hashIndex = hexValue.firstIndex(of: "#") {
            scanner.currentIndex = hexValue.index(after: hashIndex)
        }
        let hexDigitCount = scanner.string.distance(from: scanner.currentIndex, to: scanner.string.endIndex)

        var rgbValue: UInt64 = 0
        scanner.scanHexInt64(&rgbValue)

        switch hexDigitCount {
        case 6:
            self.init(
                red: Double(rgbValue >> 16 & 0xFF) / 255,
                green: Double(rgbValue >> 8 & 0xFF) / 255,
                blue: Double(rgbValue & 0xFF) / 255
            )
        case 8:
            self.init(
                red: Double(rgbValue >> 24 & 0xFF) / 255,
                green: Double(rgbValue >> 16 & 0xFF) / 255,
                blue: Double(rgbValue >> 8 & 0xFF ) / 255,
                opacity: Double(rgbValue & 0xFF) / 255
            )
        default:
            self.init(red: 0, green: 0, blue: 0, opacity: 0)
        }
    }
}
