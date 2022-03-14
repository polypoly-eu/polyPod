import Foundation

enum PodApiError: Error {
    case unknown
    case databaseError
    case badSearchQuery
    case parameterMissing
    case noSuchFile(_ path: String)
    case protectedDataUnavailable
    case badArgumentData(_ arg: Any)
    case failedToReadGraph(_ type: String)
    case badData(_ data: Any)
    case networkError(_ fetchType: String, responseCode: String)
    case endpointError(_ fetchType: String)
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
        case .protectedDataUnavailable:
            return "Protected data is unavailable to be accessed"
        case .badArgumentData(let arg):
            return "Bad argument data: \(arg)"
        case .failedToReadGraph(let type):
            return "Failed to read graph: \(type)"
        case .badData(let data):
            return "Bad data: \(data)"
        case .networkError(let fetchType, let responseCode):
            return "network.\(fetchType) failed, Response Code: \(responseCode)"
        case .endpointError(let fetchType):
            return "endpoint.\(fetchType) failed"
        }
    }
}
