import SwiftUI

extension Color {
    struct PolyPod {
        static var lightForeground = Color(red: 0.969, green: 0.98, blue: 0.988)
        static var darkForeground = Color(red: 0.059, green: 0.098, blue: 0.22)
        static var lightBackground = Color.white
        static var semiLightBackground = Color(red: 0.929, green: 0.949, blue: 0.969)
    }
    
    // iOS 13 support
    var cgColor: CGColor { UIColor(self).cgColor }
    
    var luminance: Double {
        guard let components = cgColor.components else {
            return 0
        }
        let red = components[0]
        let green = components[1]
        let blue = components[2]
        return Double(red * 0.2126 + green * 0.7152 + blue * 0.0722)
    }
    
    var isLight: Bool { luminance * 255 <= 50 }
    
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
