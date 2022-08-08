import SwiftUI

extension UIColor {
    /**
     Construct a UIColor from a SwiftUI.Color
     
     A constructor for this is coming in iOS 14, so to support iOS 13, we
     provide a compatibility function. Unfortunately, this implementation
     does not work with named colours, e.g. Color.white.
     */
    static func compatInit(_ color: Color) -> UIColor {
        return UIColor(color)
    }
}
