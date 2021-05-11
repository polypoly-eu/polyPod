enum PodApiError: Error {
    case unknown
    case databaseError
    case badSearchQuery
    case paramterMissing
    case noSuchFile
}
