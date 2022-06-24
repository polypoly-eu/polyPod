import SwiftUI

struct PolyStyle {
    struct Spacing {
        static let plSpace1x = 4.0
        static let plSpace2x = {
            2 * Self.plSpace1x
        }()
        static let plSpace3x = {
            3 * Self.plSpace1x
        }()
        static let plSpace4x = {
            4 * Self.plSpace1x
        }()
        static let plSpace5x = {
            5 * Self.plSpace1x
        }()
        static let plSpace6x = {
            6 * Self.plSpace1x
        }()
        static let plSpace7x = {
            7 * Self.plSpace1x
        }()
        static let plSpace8x = {
            8 * Self.plSpace1x
        }()
    }

    struct Radius {
        static let plRadiusBase1x = 4.0
        static let plRadiusBase2x = {
            2 * Self.plRadiusBase1x
        }()
        static let plRadiusBase3x = {
            3 * Self.plRadiusBase1x
        }()
        static let plRadiusBase4x = {
            4 * Self.plRadiusBase1x
        }()
        static let plRadiusBase5x = {
            5 * Self.plRadiusBase1x
        }()
        static let plRadiusBase6x = {
            6 * Self.plRadiusBase1x
        }()
    }

    struct Font {
        // swiftlint:disable nesting

        struct Family {
            static let jostRegular = "Jost-Regular"
            static let jostMedium = "Jost-Medium"
        }

        struct Weight {
            static let regular = SwiftUI.Font.Weight.regular
            static let medium = SwiftUI.Font.Weight.medium
        }

        struct Size {
            static let xs = 12.0
            static let sm = 14.0
            static let base = 16.0
            static let lg = 18.0
            static let xl = 20.0
            static let _2xl = 22.0
        }

        struct Alignment {
            static let center: TextAlignment = .center
            static let left: TextAlignment = .leading
            static let right: TextAlignment = .trailing
        }
        // swiftlint:enable nesting

    }

    struct Border {
        static let plBorder1x = 1.0
    }
}
