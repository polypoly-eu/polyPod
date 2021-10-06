import Foundation

enum PodApiError: Error {
    case unknown
    case databaseError
    case badSearchQuery
    case parameterMissing
    case noSuchFile(_ path: String)
}

extension PodApiError: LocalizedError {
    var errorDescription: String? {
        switch self {
        case .unknown:
            return "Unknown error"
        case .databaseError:
            return "Database error"
        case .badSearchQuery:
            return "Bad search query"
        case .parameterMissing:
            return "Parameter missing"
        case .noSuchFile(let path):
            return "No such file: \(path)"
        }
    }
}
