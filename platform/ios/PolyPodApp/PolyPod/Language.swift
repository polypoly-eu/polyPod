import Foundation

class Language {
    static let fallback = "en"
    static let current = Locale.current.languageCode ?? Language.fallback
}
