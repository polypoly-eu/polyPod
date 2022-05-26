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
            self?.loadFeatures()
            self?.loadCategories()
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
    
    private func loadCategories() {
        let categories = readCategories()
        var models = mapCategories(categories)
        let mappedFeatures = models.reduce(into: []) { partialResult, model in
            partialResult.append(contentsOf: model.features)
        }
        
        let remainingFeatures = featuresList.filter { feature in
            !mappedFeatures.contains { mappedFeature in
                feature.id == mappedFeature.id
            }
        }
        
        if !remainingFeatures.isEmpty {
            models.append(FeaturesCategoryModel(id: .other, name: "Other", features: remainingFeatures))
        }
        
        self.categoriesListSubject.value = models
    }
    
    private func loadFeatures() {
        var featuresList: [Feature] = []
        
        do {
            let directoryContents = try FileManager.default.contentsOfDirectory(at: featuresFileUrl, includingPropertiesForKeys: nil)
            let subDirs = directoryContents.filter{ $0.hasDirectoryPath }
            for featureDir in subDirs {
                if let feature = Feature.load(
                    path: featureDir
                ) {
                    featuresList.append(feature)
                }
            }
        } catch {
            Log.error("Failed to list features: \(error.localizedDescription)")
        }
        
        self.featuresList = featuresList
    }
    
    private func mapFeatures(features: [String]) -> [Feature] {
        return features.compactMap { id in
            self.featuresList.first { feature in
                return feature.id == id
            }
        }
    }
    
    private func mapCategories(_ categories: [DecodedFeaturesCategory]) -> [FeaturesCategoryModel] {
        return categories.compactMap({ category -> FeaturesCategoryModel? in
            guard let id = FeaturesCategoryId(rawValue: category.id) else { return nil }
            let features = mapFeatures(features: category.features)
            
            return FeaturesCategoryModel(id: id, name: category.name, features: features)
        })
    }
    
    private func readOrder() -> [String] {
        guard let url = Bundle.main.url(
            forResource: "order",
            withExtension: nil,
            subdirectory: "features"
        ) else { return [] }
        guard let content = try? String(contentsOf: url) else { return [] }
        return content.components(separatedBy: .newlines)
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
        let order = readOrder()

        for id in order {
            importFeature(id)
        }
    }
    
    private func createFeaturesFolder() {
        do {
            try FileManager.default.createDirectory(atPath: featureDirUrl.absoluteString, withIntermediateDirectories: true, attributes: nil)
        } catch {
            Log.error("Failed to create features folder: \(error.localizedDescription)")
        }
    }
    
    private func importFeature(_ featureName: String) {
        let featureUrl = featureDirUrl.appendingPathComponent(featureName)
        if !FileManager.default.fileExists(atPath: featureUrl.absoluteString) {
            do {
                if let filePath = Bundle.main.url(forResource: featureName, withExtension: "zip", subdirectory: "features") {
                    let unzipDirectory = try Zip.quickUnzipFile(filePath)
                    try FileManager.default.moveItem(at: unzipDirectory, to: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "pod", ofType: "html", toDestinationUrl: featuresFileUrl.appendingPathComponent(featureName))
                    try FileManager.default.copyBundleFile(forResource: "initIframe", ofType: "js", toDestinationUrl: featuresFileUrl.appendingPathComponent(featureName))
                    try importPodJs(toFeature: featureName, atUrl: featuresFileUrl)
                    Log.info("Imported feature: \(featureName)")
                } else {
                    Log.error("Feature for import not found: \(featureName)")
                }
            } catch {
                Log.error("Failed to import feature \(featureName): \(error.localizedDescription)")
            }
        }
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
