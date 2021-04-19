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
                createStubFeature(name: "Feature one"),
                createStubFeature(name: "Feature two")
            ])
        }
    }
}
