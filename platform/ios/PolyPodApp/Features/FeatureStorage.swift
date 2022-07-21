import Combine
import Foundation
import PolyPodCoreSwift
import Zip

final class FeatureStorage {
    private let dataProtection: DataProtection
    private var dataProtectionCancellable: AnyCancellable?
    private let categoriesListSubject: CurrentValueSubject<[FeatureCategory], Never> = CurrentValueSubject([])

    var categoriesList: AnyPublisher<[FeatureCategory], Never> {
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

    func featureForId(_ id: String) -> Feature? {
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
        try copyCategories()
        try copyFeatures()
        categoriesListSubject.value = try Core
            .instance
            .loadFeatureCategories(featuresDirectory: featuresFileUrl.path).get()
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

    private func copyCategories() throws {
        try FileManager.default.copyBundleFile(
            forResource: "categories",
            ofType: "json",
            fromSubdirectory: "features",
            toDestinationUrl: featuresFileUrl)
    }
    
    private func copyFeatures() throws {
        try Bundle
                .main
                .urls(
                    forResourcesWithExtension: "zip",
                    subdirectory: "features"
                )?.forEach(importFeature)
    }
    
    private func importFeature(_ bundleURL: URL) throws {
        let featureUrl = featuresFileUrl.appendingPathComponent(bundleURL.deletingPathExtension().lastPathComponent)
        
        let unzipDirectory = try Zip.quickUnzipFile(bundleURL)
        try FileManager.default.moveItem(at: unzipDirectory, to: featureUrl)
        try FileManager.default.copyBundleFile(forResource: "pod", ofType: "html", toDestinationUrl: featureUrl)
        try FileManager.default.copyBundleFile(forResource: "initIframe", ofType: "js", toDestinationUrl: featureUrl)
        try importPodJs(destinationURL: featureUrl)
    }
    
    private func importPodJs(destinationURL: URL) throws {
        let fileManager = FileManager.default
        let resourceName = "pod"
        let resourceType = "js"

        if fileManager.hasBundleFile(
            forResource: resourceName,
            ofType: resourceType,
            atDestinationUrl: destinationURL
        ) {
            Log.info("""
                Ignoring \(resourceName).\(resourceType) provided by \
                \(destinationURL.lastPathComponent) feature
                """)
            try fileManager.removeBundleFile(
                forResource: resourceName,
                ofType: resourceType,
                atDestinationUrl: destinationURL
            )
        }

        try fileManager.copyBundleFile(
            forResource: resourceName,
            ofType: resourceType,
            toDestinationUrl: destinationURL
        )
    }
}
