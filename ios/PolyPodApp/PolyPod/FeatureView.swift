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
                leading: Button(
                    activeActions.contains("back") ? "app_bar_back_button_desc" : "app_bar_close_button_desc"
                ) {
                    if activeActions.contains("back") {
                        triggerAction("back")
                        return
                    }
                    presentationMode.wrappedValue.dismiss()
                },
                trailing: HStack {
                    if activeActions.contains("info") {
                        Button("app_bar_info_button_desc") {
                            triggerAction("info")
                        }
                    }
                    if activeActions.contains("search") {
                        Button("app_bar_search_button_desc") {
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
                message: String.localizedStringWithFormat(
                    NSLocalizedString("message_url_open_prevented %@ %@", comment: ""),
                    feature.name, target
                ),
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
            message: String.localizedStringWithFormat(
                NSLocalizedString("message_url_open_requested %@ %@", comment: ""),
                feature.name, urlString
            ),
            preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(
                            title: NSLocalizedString("button_url_open_confirm", comment: ""),
                            style: .default,
                            handler: { (action: UIAlertAction!) in
                                UIApplication.shared.open(url)
                            }))
        alert.addAction(UIAlertAction(
                            title: NSLocalizedString("button_url_open_reject", comment: ""),
                            style: .default))
        viewController.present(alert, animated: true, completion: nil)
    }

    private func triggerAction(_ action: String) {
        queuedAction = (action, DispatchTime.now())
    }
}
