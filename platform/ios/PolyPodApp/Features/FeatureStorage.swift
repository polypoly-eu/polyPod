import Combine
import Foundation
import Zip

private struct DecodedFeaturesCategory: Decodable {
    let id: String
    let name: String
    let features: [String]
    let visible: Bool?
}

enum FeaturesCategoryId: String {
    case yourData
    case knowHow
    case tools
    case developer
}

struct FeaturesCategoryModel {
    let id: FeaturesCategoryId
    var name: String
    var features: [Feature]
}

final class FeatureStorage {
    enum FeatureStorageFailure: Error {
        case featureForImportNotFound(featureName: String)
        case missingCategoriesFile
    }

    private let dataProtection: DataProtection
    private var dataProtectionCancellable: AnyCancellable?
    private let categoriesListSubject: CurrentValueSubject<[FeaturesCategoryModel], Never> = CurrentValueSubject([])

    var categoriesList: AnyPublisher<[FeaturesCategoryModel], Never> {
        categoriesListSubject.eraseToAnyPublisher()
    }

    lazy var featuresFileUrl: URL = {
        do {
            let documentsUrl = try FileManager.default.url(
                for: .documentDirectory,
                in: .userDomainMask,
                appropriateFor: nil,
                create: false
            )
            let featuresUrl = documentsUrl.appendingPathComponent("Features")
            return featuresUrl
        } catch {
            Log.error("Failed to determine features path: \(error.localizedDescription)")
        }
        return URL(fileURLWithPath: "")
    }()

    init(dataProtection: DataProtection) {
        self.dataProtection = dataProtection
        setup()
    }

    func featureForId(_ id: FeatureId) -> Feature? {
        for category in categoriesListSubject.value {
            for feature in category.features where feature.id == id {
                return feature
            }
        }
        return nil
    }

    private func setup() {
        dataProtectionCancellable = dataProtection.state.sink { [weak self] protectedDataIsAvailable in
            guard self?.categoriesListSubject.value.isEmpty == true, protectedDataIsAvailable == true else {
                return
            }

            do {
                try self?.importFeatures()
            } catch {
                Log.error("Failed to import features \(error.localizedDescription)")
            }
        }
    }

    private func importFeatures() throws {
        try createFeaturesFolder()
        let metaCategories = try readCategories()

        var categories: [FeaturesCategoryModel] = []
        for metaCategory in metaCategories {
            guard !metaCategory.features.isEmpty else { continue }

            guard let categoryId = FeaturesCategoryId(rawValue: metaCategory.id) else {
                Log.info("Unknown category \(metaCategory.id), will be ignored.")
                continue
            }

            if !(metaCategory.visible ?? true) {
                Log.info("Category \(metaCategory.id) not visible, will be ignored.")
                continue
            }

            var features: [Feature] = []
            for featureId in metaCategory.features {
                do {
                    let importPath = try importFeature(featureId)
                    if let feature = Feature.load(path: importPath) {
                        features.append(feature)
                    }
                } catch {
                    Log.error("Failed to import feature \(error.localizedDescription)")
                }
            }

            categories.append(
                FeaturesCategoryModel(id: categoryId,
                                      name: metaCategory.name,
                                      features: features)
            )
        }

        self.categoriesListSubject.value = categories
    }

    private func createFeaturesFolder() throws {
        if FileManager.default.fileExists(atPath: featuresFileUrl.path) {
            try FileManager.default.removeItem(atPath: featuresFileUrl.path)
        }

        try FileManager.default.createDirectory(
            atPath: featuresFileUrl.path,
            withIntermediateDirectories: true,
            attributes: nil
        )
    }

    private func readCategories() throws -> [DecodedFeaturesCategory] {
        guard let url = Bundle.main.url(
            forResource: "categories",
            withExtension: "json",
            subdirectory: "features"
        ) else { throw FeatureStorageFailure.missingCategoriesFile }
        return try JSONDecoder().decode([DecodedFeaturesCategory].self, from: Data.init(contentsOf: url))
    }

    private func importFeature(_ featureName: String) throws -> URL {
        let featureUrl = featuresFileUrl.appendingPathComponent(featureName)

        guard let filePath = Bundle.main.url(
            forResource: featureName,
            withExtension: "zip",
            subdirectory: "features"
        ) else {
            throw FeatureStorageFailure.featureForImportNotFound(featureName: featureName)
        }

        let unzipDirectory = try Zip.quickUnzipFile(filePath)
        try FileManager.default.moveItem(at: unzipDirectory, to: featureUrl)
        try FileManager.default.copyBundleFile(forResource: "pod", ofType: "html", toDestinationUrl: featureUrl)
        try FileManager.default.copyBundleFile(forResource: "initIframe", ofType: "js", toDestinationUrl: featureUrl)
        try importPodJs(toFeature: featureName, atUrl: featuresFileUrl)
        Log.info("Imported feature: \(featureName)")
        return featureUrl
    }

    private func importPodJs(toFeature featureName: String, atUrl url: URL) throws {
        let fileManager = FileManager.default
        let resourceName = "pod"
        let resourceType = "js"
        let destinationUrl = featuresFileUrl.appendingPathComponent(featureName)

        if fileManager.hasBundleFile(
            forResource: resourceName,
            ofType: resourceType,
            atDestinationUrl: destinationUrl
        ) {
            Log.info("""
                Ignoring \(resourceName).\(resourceType) provided by \
                \(featureName)
                """)
            try fileManager.removeBundleFile(
                forResource: resourceName,
                ofType: resourceType,
                atDestinationUrl: destinationUrl
            )
        }

        try fileManager.copyBundleFile(
            forResource: resourceName,
            ofType: resourceType,
            toDestinationUrl: destinationUrl
        )
    }
}
