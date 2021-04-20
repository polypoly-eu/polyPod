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

    var initialSlide: Int = 0

    var body: some View {
        PageViewController(
            initialIndex: initialSlide,
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
                buttonLabel: "onboarding_button_end",
                buttonAction: {
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

struct OnboardingView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            OnboardingView(initialSlide: 0)
        }

        NavigationView {
            OnboardingView(initialSlide: 1)
        }

        NavigationView {
            OnboardingView(initialSlide: 2)
        }
    }
}

private struct Slide: View {
    var headline: LocalizedStringKey
    var subHeadline: LocalizedStringKey
    var bodyText: LocalizedStringKey
    var buttonLabel: LocalizedStringKey?
    var buttonAction: (() -> Void)?

    private let indigo = Color(red: 0.059, green: 0.098, blue: 0.22)

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ParagraphView(
                text: headline,
                fontName: "Jost-Light",
                fontSize: 34,
                kerning: -0.38,
                lineHeightMultiple: 0.83,
                foregroundColor: indigo
            )

            ParagraphView(
                text: subHeadline,
                fontName: "polyDisplay-Semi1.0",
                fontSize: 34,
                kerning: -0.24,
                lineHeightMultiple: 0.83,
                foregroundColor: indigo
            ).padding(.bottom, 24)

            ParagraphView(
                text: bodyText,
                fontName: "Jost-Regular",
                fontSize: 20,
                kerning: -0.24,
                lineHeightMultiple: 0.83,
                foregroundColor: indigo
            )

            Spacer()

            if let buttonLabel = buttonLabel {
                Button(action: buttonAction ?? {}) {
                    Text(buttonLabel)
                        .font(.custom("Jost-Medium", size: 14))
                        .kerning(-0.18)
                        .foregroundColor(indigo)
                        .frame(minWidth: 296, minHeight: 48)
                        .background(
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color(red: 0.984, green: 0.541, blue: 0.537))
                        )
                }
                .buttonStyle(PlainButtonStyle())
                .frame(maxWidth: .infinity, alignment: .center)
            }
        }
        .padding(28)
        .background(Color.white)
    }
}

private struct PageViewController: UIViewControllerRepresentable {
    private let initialIndex: Int
    private let viewControllers: [UIViewController]

    init(initialIndex: Int = 0, _ slides: Slide...) {
        self.initialIndex = initialIndex
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
            [viewControllers[initialIndex]],
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
