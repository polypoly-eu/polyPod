import SwiftUI

struct ContentView: View {
    typealias StateFunction = () -> AnyView
    
    @State private var state: StateFunction? = nil
    
    var body: some View {
        (state ?? firstRunState())()
    }
    
    private func firstRunState() -> StateFunction {
        let defaults = UserDefaults.standard
        let firstRunKey = "firstRun"
        let firstRun = defaults.value(forKey: firstRunKey) as? Bool ?? true
        if !firstRun {
            return featureListState()
        }
        
        return {
            AnyView(
                OnboardingView(closeAction: {
                    UserDefaults.standard.set(false, forKey: firstRunKey)
                    state = featureListState()
                })
            )
        }
    }
    
    private func featureListState() -> StateFunction {{
        AnyView(
            FeatureListView(
                features: FeatureStorage.shared.featuresList(),
                openFeatureAction: { feature in
                    state = featureState(feature)
                },
                openInfoAction: {
                    state = infoState()
                },
                openSettingsAction: {
                    state = settingsState()
                }
            )
        )
    }}
    
    private func featureState(_ feature: Feature) -> StateFunction {{
        AnyView(
            FeatureView(
                feature: feature,
                closeAction: {
                    state = featureListState()
                }
            )
        )
    }}
    
    private func infoState() -> StateFunction {{
        AnyView(
            OnboardingView(closeAction: {
                state = featureListState()
            })
        )
    }}
    
    private func settingsState() -> StateFunction {{
        AnyView(
            SettingsView(closeAction: {
                state = featureListState()
            })
        )
    }}
}
