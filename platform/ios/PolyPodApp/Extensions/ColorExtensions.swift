import SwiftUI

extension Color {
    struct PolyPod {
        // Do not use named colours, e.g. Color.white here, not while we use
        // compatInit in UIColorExtensions.swift at least.
        static var lightForeground = Color(fromHex: "#F7FAFC")
        static var darkForeground = Color(fromHex: "#0F1938")
        static var lightBackground = Color(fromHex: "#FFFFFF")
        static var semiLightBackground = Color(fromHex: "#EDF2F7")
    }
    
    var compatCgColor: CGColor? {
        if #available(iOS 14, *) {
            return cgColor
        }
        return UIColor.compatInit(self).cgColor
    }
    
    var luminance: Double {
        guard let components = compatCgColor?.components else {
            return 0
        }
        let red = components[0]
        let green = components[1]
        let blue = components[2]
        return Double(red * 0.2126 + green * 0.7152 + blue * 0.0722)
    }
    
    var isLight: Bool { luminance * 255 > 80 }
    
    init(fromHex hexValue: String) {
        let scanner = Scanner(string: hexValue)
        if let hashIndex = hexValue.firstIndex(of: "#") {
            scanner.currentIndex = hexValue.index(after: hashIndex)
        }
        let hexDigitCount = scanner.string.distance(
            from: scanner.currentIndex,
            to: scanner.string.endIndex
        )
        
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
