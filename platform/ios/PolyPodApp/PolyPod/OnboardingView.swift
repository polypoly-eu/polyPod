import SwiftUI

struct OnboardingView: View {
    @Environment(\.presentationMode) var presentationMode

    @State var activeSlide: Int = 0
    var securityOnly: Bool = false
    var closeAction: () -> Void = {}

    var body: some View {
        let slides = createSlides().map { $0.padding(28) }
        return VStack(spacing: 0) {
            NavigationBar(
                leading: Button(action: closeAction) {
                    Image("NavIconCloseDark").renderingMode(.original)
                }
            )

            PageViewController(activeIndex: $activeSlide, views: slides)

            Spacer()

            if slides.count > 1 {
                Pagination(active: activeSlide, max: slides.count - 1)
                    .padding(.bottom, 36)
            }
        }
        .background(Color.PolyPod.lightBackground)
        .accessibilityIdentifier("onboarding_view")
    }

    private func createSlides() -> [Slide] {
        let authSlide = Slide(
            headline: "onboarding_slide4_headline",
            subHeadline: "onboarding_slide4_sub_headline",
            bodyText: "onboarding_slide4_body_text",
            confirmLabel: "onboarding_button_auth",
            confirmAction: setUpAuth,
            denyLabel: "onboarding_button_do_not_ask",
            denyAction: disableAuthCheck
        )

        if securityOnly {
            return [authSlide]
        }

        let showSecurity = Authentication.shared.shouldShowPrompt()
        return [
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
                confirmLabel: showSecurity ? nil : "onboarding_button_end",
                confirmAction: closeAction
            ),
            showSecurity ? authSlide : nil
        ].compactMap { $0 }
    }

    private func setUpAuth() {
        Authentication.shared.setUp(newStatus: true) { success in
            if success {
                closeAction()
            }
        }
    }

    private func disableAuthCheck() {
        Authentication.shared.disableCheck()
        closeAction()
    }
}

struct OnboardingView_Previews: PreviewProvider {
    static var previews: some View {
        ForEach((0...2), id: \.self) { index in
            OnboardingView(activeSlide: index)
        }

        OnboardingView(securityOnly: true)
    }
}

private struct Slide: View {
    var headline: LocalizedStringKey
    var subHeadline: LocalizedStringKey
    var bodyText: LocalizedStringKey
    var confirmLabel: LocalizedStringKey?
    var confirmAction: (() -> Void)?
    var denyLabel: LocalizedStringKey?
    var denyAction: (() -> Void)?

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ParagraphView(
                text: headline,
                font: UIFont(name: "Jost-Light", size: 34),
                kerning: -0.38,
                lineHeightMultiple: 0.83,
                foregroundColor: Color.PolyPod.darkForeground
            )

            ParagraphView(
                text: subHeadline,
                font: UIFont(name: "Jost-Medium", size: 34),
                kerning: -0.38,
                lineHeightMultiple: 0.83,
                foregroundColor: Color.PolyPod.darkForeground
            ).padding(.bottom, 24)

            ParagraphView(
                text: bodyText,
                font: UIFont(name: "Jost-Regular", size: 20),
                kerning: -0.24,
                lineHeightMultiple: 0.83,
                foregroundColor: Color.PolyPod.darkForeground
            )

            Spacer()

            if let confirmLabel = confirmLabel {
                PrimaryButton(title: confirmLabel,
                              onAction: confirmAction ?? {})
            }

            if let denyLabel = denyLabel {
                // swiftlint:disable multiple_closures_with_trailing_closure
                Button(action: denyAction ?? {}) {
                    Text(denyLabel)
                }
                .padding(.top, 20)
                .frame(maxWidth: .infinity, alignment: .center)
                // swiftlint:enable multiple_closures_with_trailing_closure
            }
        }
    }
}

private struct Pagination: View {
    var active: Int
    var max: Int

    var body: some View {
        HStack(spacing: 12) {
            ForEach((0...max), id: \.self) { index in
                Item(active: index == active)
            }
        }
    }

    private struct Item: View {
        var active: Bool
        private let diameter = 12

        var body: some View {
            Circle()
                .strokeBorder(Color.PolyPod.darkForeground, lineWidth: 1.5)
                .background(
                    Circle().foregroundColor(
                        active ? Color.PolyPod.darkForeground : Color.clear
                    )
                )
                .frame(width: CGFloat(diameter), height: CGFloat(diameter))
        }
    }
}

private struct PageViewController<Content: View>: UIViewControllerRepresentable {
    private let activeIndex: Binding<Int>?
    private let viewControllers: [UIViewController]

    init(activeIndex: Binding<Int>? = nil, views: [Content]) {
        self.activeIndex = activeIndex
        viewControllers = views.map { UIHostingController(rootView: $0) }
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
        pageViewController.delegate = context.coordinator
        pageViewController.setViewControllers(
            [viewControllers[activeIndex?.wrappedValue ?? 0]],
            direction: .forward,
            animated: false
        )
        return pageViewController
    }

    func updateUIViewController(
        _ pageViewController: UIPageViewController,
        context: Context
    ) {
    }

    class Coordinator: NSObject, UIPageViewControllerDataSource,
                       UIPageViewControllerDelegate {
        var parent: PageViewController

        init(_ parent: PageViewController) {
            self.parent = parent
        }

        func pageViewController(
            _ pageViewController: UIPageViewController,
            viewControllerBefore viewController: UIViewController
        ) -> UIViewController? {
            guard let index =
                    parent.viewControllers.firstIndex(of: viewController) else {
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
            guard let index =
                    parent.viewControllers.firstIndex(of: viewController) else {
                return nil
            }
            if index == parent.viewControllers.count - 1 {
                return nil
            }
            return parent.viewControllers[index + 1]
        }

        func pageViewController(
            _ pageViewController: UIPageViewController,
            didFinishAnimating finished: Bool,
            previousViewControllers: [UIViewController],
            transitionCompleted completed: Bool
        ) {
            if let currentVC = pageViewController.viewControllers?.first,
               let index = parent.viewControllers.firstIndex(of: currentVC) {
                parent.activeIndex?.wrappedValue = index
            }
        }
    }
}
