//
//  OnboardingView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 16.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct OnboardingView: View {
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        PageViewController(
            Slide(
                headline: "onboarding_slide1_headline",
                subHeadline: "onboarding_slide1_sub_headline",
                bodyText: "onboarding_slide1_body_text"
            ),
            Slide(
                headline: "onboarding_slide2_headline",
                subHeadline: "onboarding_slide2_sub_headline",
                bodyText: "onboarding_slide2_body_text"
            ),
            Slide(
                headline: "onboarding_slide3_headline",
                subHeadline: "onboarding_slide3_sub_headline",
                bodyText: "onboarding_slide3_body_text",
                button: Button("onboarding_button_end") {
                    presentationMode.wrappedValue.dismiss()
                }
            )
        )
            .navigationBarBackButtonHidden(true)
            .navigationBarItems(
                leading: Button("app_bar_close_button_desc") {
                    presentationMode.wrappedValue.dismiss()
                }
            )
    }
}

private struct Slide: View {
    var headline: LocalizedStringKey
    var subHeadline: LocalizedStringKey
    var bodyText: LocalizedStringKey
    var button: Button<Text>?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(headline).font(.largeTitle)
            Text(subHeadline).font(.title)
            Text(bodyText)
            button
        }.padding()
    }
}

private struct PageViewController: UIViewControllerRepresentable {
    private let viewControllers: [UIViewController]

    init(_ slides: Slide...) {
        viewControllers = slides.map { UIHostingController(rootView: $0) }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    func makeUIViewController(context: Context) -> UIPageViewController {
        let pageViewController = UIPageViewController(
            transitionStyle: .scroll,
            navigationOrientation: .horizontal
        )
        pageViewController.dataSource = context.coordinator
        pageViewController.setViewControllers(
            [viewControllers[0]],
            direction: .forward,
            animated: false
        )
        return pageViewController
    }

    func updateUIViewController(_ pageViewController: UIPageViewController, context: Context) {
    }

    class Coordinator: NSObject, UIPageViewControllerDataSource {
        var parent: PageViewController

        init(_ parent: PageViewController) {
            self.parent = parent
        }

        func pageViewController(
            _ pageViewController: UIPageViewController,
            viewControllerBefore viewController: UIViewController
        ) -> UIViewController? {
            guard let index = parent.viewControllers.firstIndex(of: viewController) else {
                return nil
            }
            if index == 0 {
                return nil
            }
            return parent.viewControllers[index - 1]
        }

        func pageViewController(
            _ pageViewController: UIPageViewController,
            viewControllerAfter viewController: UIViewController
        ) -> UIViewController? {
            guard let index = parent.viewControllers.firstIndex(of: viewController) else {
                return nil
            }
            if index == parent.viewControllers.count - 1 {
                return nil
            }
            return parent.viewControllers[index + 1]
        }
    }
}
