import Foundation

enum PodApiError: Error {
    case unknown
    case databaseError
    case badSearchQuery
    case parameterMissing
    case noSuchFile(_ path: String)
    case noAppDelegate
    case badArgumentData(_ arg: Any)
    case failedToReadGraph
    case badData
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
        case .noAppDelegate:
            return "AppDelegate not available"
        case .badArgumentData(let arg):
            return "Bad argument data: \(arg)"
        case .failedToReadGraph:
            return "Failed to read graph"
        case .badData:
            return "Bad data"
        }
    }
}
