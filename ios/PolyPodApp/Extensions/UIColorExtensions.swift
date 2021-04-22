import SwiftUI

extension UIColor {
    /**
     Convert a SwiftUI.Color to UIColor
     
     This constructor is coming in iOS 14, so to support iOS 13, we provide it.
     */
    convenience init(_ color: Color) {
        let scanner = Scanner(
            string: color.description.trimmingCharacters(
                in: CharacterSet.alphanumerics.inverted
            )
        )
        var hexNumber: UInt64 = 0
        scanner.scanHexInt64(&hexNumber)
        
        self.init(
            red: CGFloat((hexNumber & 0xFF000000) >> 24) / 255,
            green: CGFloat((hexNumber & 0xFF0000) >> 16) / 255,
            blue: CGFloat((hexNumber & 0xFF00) >> 8) / 255,
            alpha: CGFloat(hexNumber & 0xFF) / 255
        )
    }
}
