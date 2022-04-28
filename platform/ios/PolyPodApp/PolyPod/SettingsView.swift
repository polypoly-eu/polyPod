import SwiftUI

struct SettingsView: View {
    var closeAction: () -> Void = {}
    @State private var activeSection = Sections.main
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            NavigationBar(
                leading: AnyView(Button(action: back) {
                    Image("NavIconBackDark").renderingMode(.original)
                }),
                center: AnyView(
                    Text({
                        switch activeSection {
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
                    }())
                    .foregroundColor(Color.PolyPod.darkForeground)
                    .font(.custom("Jost-Medium", size: 16))
                    .kerning(-0.16)
                )
            )
            .background(Color.PolyPod.lightBackground)
            
            Divider()
            
            switch activeSection {
            case .main:
                MainSection(activeSection: $activeSection)
            case .imprint:
                HTMLView(text: "settings_imprint_text")
            case .privacyPolicy:
                PrivacyPolicyView()
            case .termsOfUse:
                HTMLView(text: "settings_terms_of_use_text")
            case .licenses:
                LicensesView()
            }
        }
    }
    
    private func back() {
        if activeSection == .main {
            closeAction()
            return
        }
        activeSection = .main
    }
}

private enum Sections {
    case main, imprint, privacyPolicy, termsOfUse, licenses
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}

private struct MainSection: View {
    @Binding var activeSection: Sections
    @State private var showVersion = false
    @State private var shareLogs = false
    @State private var isToggle = Authentication.shared.isSetUp()

    var body: some View {
        List() {
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
            .listRowInsets(
                EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)
            )
            

            Section(header: SettingsHeader("settings_sec_section")) {
                SettingsToggleButton(
                    label: "settings_auth",
                    isToggle: isToggle,
                    onChange: { status in
                        print("status is \(status)")

                        if status {
                            Authentication.shared.setUp { success in
                                print("success is \(success)")

                                if !success {
                                    isToggle = false
                                    print("setup auth failed")
                                }
                                print("set up auth")
                                isToggle = true; // ?
                            }
                        } else {
                            Authentication.shared.disable { _ in}
                            print("Disabled auth")
                            isToggle = false;  // ?
                        }
                        
                    }
                )
            }
            .listRowInsets(
                EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)
            )
            
            Section(header: SettingsHeader("settings_legal_section")) {
                SettingsButton(
                    label: "settings_imprint_title",
                    action: { activeSection = .imprint }
                )
                SettingsButton(
                    label: "settings_privacy_policy_title",
                    action: { activeSection = .privacyPolicy }
                )
                SettingsButton(
                    label: "settings_terms_of_use_title",
                    action: { activeSection = .termsOfUse }
                )
                SettingsButton(
                    label: "settings_licenses_title",
                    action: { activeSection = .licenses }
                )
                if !RuntimeInfo.isProduction {
                    SettingsButton(label: "settings_export_logs",
                                   action: {
                        shareLogs = true
                    })
                }
            }
            .listRowInsets(
                EdgeInsets(top: 0, leading: 0, bottom: 0, trailing: 0)
            )
        }.sheet(isPresented: $shareLogs) {
            ActivityViewController(activityItems: Log.logFiles)
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
    
    var body: some View {
        Button(action: action) {
            Text(label)
                .foregroundColor(Color.PolyPod.darkForeground)
                .font(.custom("Jost-Regular", size: 18))
                .kerning(-0.18)
        }.padding(.leading, 32)
    }
}

typealias OnChange = ((Bool) -> Void)?

private struct SettingsToggleButton: View {
    let label: LocalizedStringKey
    @State var isToggle : Bool;
    
    //let onChange: (Bool, Binding<Bool>) -> Void
    
    var onChange: OnChange

    var body: some View {
       VStack {
           Toggle(isOn: $isToggle.onChange(toggleChange)) {
                    Text(label)
                           .foregroundColor(Color.PolyPod.darkForeground)
                           .font(.custom("Jost-Regular", size: 14))
                           .kerning(-0.18)

                       if isToggle {
                           Text("Granted")                       .foregroundColor(Color.PolyPod.darkForeground)
                               .font(.custom("Jost-Regular", size: 14))
                               .kerning(-0.18)
                       }
                       else {
                           Text("Not Granted")                       .foregroundColor(Color.PolyPod.darkForeground)
                               .font(.custom("Jost-Regular", size: 14))
                               .kerning(-0.18)
                       }
                   }
                   .padding(.trailing, 32)
        }.padding(.leading, 32)
    }
    
    func toggleChange(_ value: Bool) {
        print("Toggle value: \(value)")
        if let action = self.onChange {
          action(value)
        }
    }
    
//    func onChanged(perform action: OnChange) -> Self {
//      var copy = self
//      copy.action = action
//      return copy
//    }
        
}


private struct PrivacyPolicyView: View {
    var body: some View {
        HTMLView(content: loadPrivacyPolicyText())
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
