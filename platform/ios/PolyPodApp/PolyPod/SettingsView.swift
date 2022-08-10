import SwiftUI
import PolyPodCoreSwift
import Combine

private enum Sections {
    case main, imprint, privacyPolicy, termsOfUse, licenses
}

extension Sections {
    func title() -> LocalizedStringKey {
        switch self {
        case .main:
            return "settings_title"
        case .imprint:
            return "settings_imprint_title"
        case .privacyPolicy:
            return "settings_privacy_policy_title"
        case .termsOfUse:
            return "settings_terms_of_use_title"
        case .licenses:
            return "settings_licenses_title"
        }
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}

extension UserSessionTimeoutOption: Identifiable {
    public var id: Self { self }
}

extension UserSessionTimeoutOptionConfig: Identifiable {
    public var id: UserSessionTimeoutOption {
        self.option
    }
}

extension Result {
    func inspectError(_ inspect: (Error) -> Void) -> Self {
        if case let.failure(error) = self {
            inspect(error)
        }
        return self
    }
    
    func unwrapOr(_ fallback: Success) -> Success {
        if let value = try? self.get() {
            return value
        }
        
        return fallback
    }
}

class SettingsViewModel: ObservableObject {
    @Published var userSessionTimeoutOption: UserSessionTimeoutOption = .option1
    @Published private(set) var userSessionTimeoutOptions: [UserSessionTimeoutOptionConfig] = []
    private var cancellables: Set<AnyCancellable> = []
    
    func load() {
        self.userSessionTimeoutOption = Core
            .instance
            .getUserSessionTimeoutOption()
            .inspectError {
                Log.error("Failed to load user session timeout option, \($0.localizedDescription)")
            }
            .unwrapOr(.option1)
        
        self.userSessionTimeoutOptions = Core
            .instance
            .getUserSessionTimeoutOptionsConfig()
            .inspectError {
                Log.error("Failed to load user session timeout options config, \($0.localizedDescription)")
            }
            .unwrapOr([])
        
        $userSessionTimeoutOption.dropFirst().sink { option in
            _ = Core
                .instance
                .setUserSessionTimeout(option: option)
                .inspectError {
                    Log.error("Failed to set user session timeout, \($0.localizedDescription)")
                }
        }.store(in: &cancellables)
    }
}

struct SettingsView: View {
    @ObservedObject private var viewModel = SettingsViewModel()
    @State private var showVersion = false
    @State private var shareLogs = false
    @State private var isAuthenticationConfigured = Authentication.shared.isSetUp()
    
    var body: some View {
        VStack(spacing: 0) {
            Divider()
            List {
                Section(header: SettingsHeader("settings_about_section")) {
                    SettingsButton(
                        label: "settings_version",
                        action: { showVersion = true }
                    )
                    .alert(isPresented: $showVersion) {
                        Alert(
                            title: Text("settings_version"),
                            message: Text(RuntimeInfo.version)
                        )
                    }
                }
                
                Section(header: SettingsHeader("settings_sec_section")) {
                    SettingsToggleButton(
                        label: "settings_auth",
                        isToggled: $isAuthenticationConfigured,
                        onChange: { isOn in
                            Authentication.shared.setUp(newStatus: isOn) { success in
                                if !success {
                                    isAuthenticationConfigured = !isOn
                                }
                            }
                        }
                    )
                    if self.isAuthenticationConfigured {
                        Picker(
                            "screen_lock_inactivity_timeout_entry",
                            selection: $viewModel.userSessionTimeoutOption
                        ) {
                            ForEach(viewModel.userSessionTimeoutOptions) { option in
                                if let duration = option.duration {
                                    Text(
                                        String.localizedStringWithFormat(
                                            NSLocalizedString(
                                                "screen_lock_inactivity_timeout_duration %d",
                                                comment: ""
                                            ),
                                            duration
                                        )
                                    ).tag(option.option)
                                } else {
                                    Text("screen_lock_inactivity_no_timeout").tag(option.option)
                                }
                            }
                        }
                    }
                }
                
                Section(header: SettingsHeader("settings_legal_section")) {
                    NavigationLink {
                        VStack(spacing: 0) {
                            Divider()
                            HTMLView(text: "settings_imprint_text")
                        }
                        .navigationTitle("settings_imprint_title")
                    } label: {
                        SettingsButton(
                            label: "settings_imprint_title"
                        )
                    }
                    
                    NavigationLink {
                        PrivacyPolicyView()
                            .navigationTitle("settings_privacy_policy_title")
                    } label: {
                        SettingsButton(
                            label: "settings_privacy_policy_title"
                        )
                    }
                    
                    NavigationLink {
                        VStack(spacing: 0) {
                            Divider()
                            HTMLView(text: "settings_terms_of_use_text")
                        }
                        .navigationTitle("settings_terms_of_use_title")
                    } label: {
                        SettingsButton(
                            label: "settings_terms_of_use_title"
                        )
                    }
                    
                    NavigationLink {
                        LicensesView()
                            .navigationTitle("settings_licenses_title")
                    } label: {
                        SettingsButton(
                            label: "settings_licenses_title"
                        )
                    }
                    if !RuntimeInfo.isProduction {
                        SettingsButton(label: "settings_export_logs",
                                       action: {
                            shareLogs = true
                        })
                    }
                }
            }
        }
        .sheet(isPresented: $shareLogs) {
            ActivityViewController(activityItems: Log.logFiles)
        }
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle("Settings")
        .onAppear {
            viewModel.load()
        }
    }
}

private struct SettingsHeader: View {
    private let text: LocalizedStringKey
    
    init(_ text: LocalizedStringKey) {
        self.text = text
    }
    
    var body: some View {
        Text(text)
            .foregroundColor(Color(fromHex: "#3E495B"))
            .font(.custom("Jost-Medium", size: 12))
            .kerning(-0.12)
            .frame(
                maxWidth: .infinity,
                maxHeight: .infinity,
                alignment: .leading
            )
            .padding(.leading, 32)
            .background(Color.PolyPod.semiLightBackground)
    }
}

private struct SettingsButton: View {
    let label: LocalizedStringKey
    let action: () -> Void
    
    init(label: LocalizedStringKey, action: @escaping () -> Void = {}) {
        self.label = label
        self.action = action
    }
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(Color.PolyPod.darkForeground)
                .font(.custom("Jost-Regular", size: 18))
                .kerning(-0.18)
        }
    }
}

private struct SettingsToggleButton: View {
    let label: LocalizedStringKey
    let isToggled: Binding<Bool>
    
    var onChange: ((Bool) -> Void)?
    
    var body: some View {
        VStack {
            Toggle(isOn: isToggled.onChange(toggleChange)) {
                Text(label)
                    .foregroundColor(Color.PolyPod.darkForeground)
                    .font(.custom("Jost-Regular", size: 18))
                    .kerning(-0.18)
            }
        }
    }
    
    func toggleChange(_ value: Bool) {
        if let action = self.onChange {
            action(value)
        }
    }
    
}

private struct PrivacyPolicyView: View {
    var body: some View {
        VStack(spacing: 0) {
            Divider()
            HTMLView(content: loadPrivacyPolicyText())
        }
    }
    
    private func loadPrivacyPolicyText() -> String {
        let url = Bundle.main.bundleURL
            .appendingPathComponent("legal")
            .appendingPathComponent(Language.current)
            .appendingPathComponent("privacy-policy.html")
        guard let content = try? String(contentsOf: url) else {
            return ""
        }
        return content.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

private struct LicensesView: View {
    var body: some View {
        VStack(spacing: 0) {
            Divider()
            ScrollView {
                Text(loadLicenseText())
                    .font(.system(size: 7, design: .monospaced))
                    .padding(10)
            }
            .frame(
                maxWidth: .infinity,
                maxHeight: .infinity,
                alignment: .topLeading
            )
        }
    }
    
    private func loadLicenseText() -> String {
        let licenseFiles = ["ios-licenses.txt", "js-licenses.txt"]
        let licensesUrl = Bundle.main.bundleURL
            .appendingPathComponent("3rd-party-licenses")
        let licenses = licenseFiles.map { (file: String) -> String in
            let url = licensesUrl.appendingPathComponent(file)
            let content = (try? String(contentsOf: url)) ?? ""
            return content.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        return licenses.joined(separator: "\n\n\n")
    }
}
