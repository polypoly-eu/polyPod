//
//  FeatureListView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 13.04.21.
//

import SwiftUI

struct FeatureListView: View {
    var body: some View {
        NavigationView {
            List() {
                Section(header: Text("Features:")) {
                    ForEach(features, id: \.name) { feature in
                        NavigationLink(destination: FeatureView(feature: feature)) {
                            Text(feature.name)
                        }
                    }
                }
            }
            .navigationBarTitle("polyPod", displayMode: .inline)
            .navigationBarItems(trailing: Button("Settings", action: handleOpenSettings))
        }
    }

    private let features: [Feature] = FeatureStorage.shared.featuresList()

    private func handleOpenSettings() {
        UIApplication.shared.open(
            URL(string: UIApplication.openSettingsURLString)!,
            options: [:],
            completionHandler: nil)
    }
}
