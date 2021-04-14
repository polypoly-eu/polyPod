//
//  FeatureView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 13.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct FeatureView: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>

    let feature: Feature
    @State var title: String = ""
    @State var activeActions: [String] = []
    @State var queuedAction: (String, DispatchTime)? = nil

    var body: some View {
        FeatureContainerView(
            feature: feature,
            title: $title,
            activeActions: $activeActions,
            queuedAction: queuedAction,
            openUrlHandler: openUrl
        )
            .navigationBarTitle(Text(title), displayMode: .inline)
            .navigationBarBackButtonHidden(true)
            .navigationBarItems(
                leading: Button(activeActions.contains("back") ? "Back" : "Close") {
                    if activeActions.contains("back") {
                        triggerAction("back")
                        return
                    }
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: HStack {
                    if activeActions.contains("info") {
                        Button("Info") {
                            triggerAction("info")
                        }
                    }
                    if activeActions.contains("search") {
                        Button("Search") {
                            triggerAction("search")
                        }
                    }
                }
            )
    }

    private func openUrl(target: String) {
        let viewController = UIApplication.shared.windows.first!.rootViewController!
        guard let urlString = feature.findUrl(target: target) else {
            let alert = UIAlertController(
                title: "",
                message: """
                Ich habe \(feature.name) davon abgehalten, eine URL zu öffnen:
                \(target)
                """,
                preferredStyle: UIAlertController.Style.alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            viewController.present(alert, animated: true, completion: nil)
            return
        }
        guard let url = URL(string: urlString) else {
            print("Error: Invalid URL format: \(urlString)")
            return
        }
        let alert = UIAlertController(
            title: "",
            message: """
            \(feature.name) möchte eine URL in Ihrem Browser öffnen:

            \(urlString)

            Zulassen?
            """,
            preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(
                            title: "Ja",
                            style: .default,
                            handler: { (action: UIAlertAction!) in
                                UIApplication.shared.open(url)
                            }))
        alert.addAction(UIAlertAction(title: "Nein", style: .default))
        viewController.present(alert, animated: true, completion: nil)
    }

    private func triggerAction(_ action: String) {
        queuedAction = (action, DispatchTime.now())
    }
}
