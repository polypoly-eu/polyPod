import Foundation
import Zip
import Combine

fileprivate struct DecodedFeaturesCategory: Decodable {
    let id: String
    let name: String
    let features: [String]
}

enum FeaturesCategoryId: String {
    case yourData
    case knowHow
    case tools
    case other
}

struct FeaturesCategoryModel {
    let id: FeaturesCategoryId
    var name: String
    var features: [Feature]
}

final class FeatureStorage: ObservableObject {
    private let dataProtection: DataProtection
    private var dataProtectionCancellable: AnyCancellable?
    private let categoriesListSubject: CurrentValueSubject<[FeaturesCategoryModel], Never> = CurrentValueSubject([])
    

    var featuresList: [Feature] = []
    var categoriesList: AnyPublisher<[FeaturesCategoryModel], Never> {
        categoriesListSubject.eraseToAnyPublisher()
    }
    
    lazy var featuresFileUrl: URL = {
        do {
            let documentsUrl = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            let featuresUrl = documentsUrl.appendingPathComponent("Features")
            return featuresUrl
        } catch {
            Log.error("Failed to determine features path: \(error.localizedDescription)")
        }
        return URL(fileURLWithPath: "")
    }()
    
    lazy private var featureDirUrl: URL =
        URL(string: featuresFileUrl.path) ?? URL(fileURLWithPath: "")

    init(dataProtection: DataProtection) {
        self.dataProtection = dataProtection
        setup()
    }
    
    private func setup() {
        dataProtectionCancellable = dataProtection.state.sink { [weak self] protectedDataIsAvailable in
            guard self?.featuresList.isEmpty == true, protectedDataIsAvailable == true else {
                return
            }
            
            self?.cleanFeatures()
            self?.importFeatures()
        }
    }
    
    private func cleanFeatures() {
        do {
            let documentsUrl = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false)
            let featuresUrl = documentsUrl.appendingPathComponent("Features")
            try FileManager.default.removeItem(at: featuresUrl)
        } catch {
            Log.error("Failed to clean features: \(error.localizedDescription)")
        }
    }
    
    private func readCategories() -> [DecodedFeaturesCategory] {
        guard let url = Bundle.main.url(
            forResource: "categories",
            withExtension: "json",
            subdirectory: "features"
        ) else { return [] }
        guard let content = try? JSONDecoder().decode([DecodedFeaturesCategory].self, from: Data.init(contentsOf: url)) else { return [] }
        return content
    }

    func importFeatures() {
        createFeaturesFolder()
        let metaCategories = readCategories()

        var categories: [FeaturesCategoryModel] = []
        for metaCategory in metaCategories {
            guard let categoryId = FeaturesCategoryId(rawValue: metaCategory.id) else { continue }
            var features: [Feature] = []
            for featureId in metaCategory.features {
                if let importPath = importFeature(featureId) {
                    if let feature = Feature.load(
                        path: importPath
                    ) {
                        features.append(feature)
                    }
                }
            }
            categories.append(FeaturesCategoryModel(id: categoryId, name: metaCategory.name, features: features))
        }
        self.categoriesListSubject.value = categories
    }
    
    private func createFeaturesFolder() {
        do {
            try FileManager.default.createDirectory(atPath: featureDirUrl.absoluteString, withIntermediateDirectories: true, attributes: nil)
        } catch {
            Log.error("Failed to create features folder: \(error.localizedDescription)")
        }
    }
    
    private func importFeature(_ featureName: String) -> URL? {
        let featureUrl = featureDirUrl.appendingPathComponent(featureName)
        let featureCopyPath = featuresFileUrl.appendingPathComponent(featureName)
        if !FileManager.default.fileExists(atPath: featureUrl.absoluteString) {
            do {
                if let filePath = Bundle.main.url(forResource: featureName, withExtension: "zip", subdirectory: "features") {
                    let unzipDirectory = try Zip.quickUnzipFile(filePath)
                    try FileManager.default.moveItem(at: unzipDirectory, to: featureCopyPath)
                    try FileManager.default.copyBundleFile(forResource: "pod", ofType: "html", toDestinationUrl: featureCopyPath)
                    try FileManager.default.copyBundleFile(forResource: "initIframe", ofType: "js", toDestinationUrl: featureCopyPath)
                    try importPodJs(toFeature: featureName, atUrl: featuresFileUrl)
                    Log.info("Imported feature: \(featureName)")
                    return featureCopyPath
                } else {
                    Log.error("Feature for import not found: \(featureName)")
                }
            } catch {
                Log.error("Failed to import feature \(featureName): \(error.localizedDescription)")
            }
        } else {
            return featureCopyPath
        }
        
        return nil
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
