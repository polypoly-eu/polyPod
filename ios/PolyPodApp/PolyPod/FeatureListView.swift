//
//  FeatureListView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 13.04.21.
//

import SwiftUI

struct FeatureListView: View {
    private let features: [Feature]

    init(_ features: [Feature]) {
        self.features = features
    }

    var body: some View {
        List() {
            Section(header: Text("Features:")) {
                ForEach(features, id: \.name) { feature in
                    NavigationLink(destination: FeatureView(feature: feature)) {
                        Text(feature.name)
                    }
                }
            }
        }
        .navigationBarTitle("app_name", displayMode: .inline)
        .navigationBarItems(
            leading: NavigationLink(destination: OnboardingView()) {
                Text("app_bar_info_button_desc")
            },
            trailing: Button("settings_title", action: handleOpenSettings))
    }

    private func handleOpenSettings() {
        UIApplication.shared.open(
            URL(string: UIApplication.openSettingsURLString)!,
            options: [:],
            completionHandler: nil)
    }
}

struct FeatureListView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            FeatureListView([
                createFeature(name: "Feature one"),
                createFeature(name: "Feature two")
            ])
        }
    }

    static private func createFeature(
        name: String,
        author: String? = nil,
        description: String? = nil,
        thumbnail: String? = nil,
        primaryColor: String? = nil,
        links: [String: String]? = nil
    ) -> Feature {
        let manifest = Feature.Manifest(
            name: name,
            author: author,
            description: description,
            thumbnail: thumbnail,
            primaryColor: primaryColor,
            links: links,
            translations: nil
        )
        return Feature(
            path: URL(fileURLWithPath: ""),
            manifest: manifest
        )
    }
}
