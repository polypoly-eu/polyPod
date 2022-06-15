import SwiftUI

extension UIColor {
    /**
     Construct a UIColor from a SwiftUI.Color
     
     A constructor for this is coming in iOS 14, so to support iOS 13, we
     provide a compatibility function. Unfortunately, this implementation
     does not work with named colours, e.g. Color.white.
     */
    static func compatInit(_ color: Color) -> UIColor {
        if #available(iOS 14, *) {
            return UIColor(color)
        }
        let scanner = Scanner(
            string: color.description.trimmingCharacters(
                in: CharacterSet.alphanumerics.inverted
            )
        )
        var hexNumber: UInt64 = 0
        scanner.scanHexInt64(&hexNumber)
        
        return UIColor(
            red: CGFloat((hexNumber & 0xFF000000) >> 24) / 255,
            green: CGFloat((hexNumber & 0xFF0000) >> 16) / 255,
            blue: CGFloat((hexNumber & 0xFF00) >> 8) / 255,
            alpha: CGFloat(hexNumber & 0xFF) / 255
        )
    }
}
