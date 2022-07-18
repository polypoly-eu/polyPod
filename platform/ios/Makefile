.DEFAULT_GOAL := build

archive_path = ./build/PolyPod.xcarchive
ipa_path = ./build/PolyPod.ipa
project_path = PolyPodApp/PolyPod.xcodeproj
scheme_name = PolyPod
export_options_plist = exportOptions.plist
destination = 15.2

ifneq ($(shell which xcpretty),)
xcodebuild := set -o pipefail && xcodebuild
xcpretty := | xcpretty
else
xcodebuild := xcodebuild
endif

.PHONY: lockxcodeversion
lockxcodeversion:
	sudo xcode-select -switch /Applications/Xcode_13.2.1.app

.PHONY: build
build:
	$(xcodebuild) clean build \
		-project $(project_path) \
		-scheme $(scheme_name) \
		$(xcpretty)

.PHONY: test
test:
	$(xcodebuild) clean test \
		-project $(project_path) \
		-scheme $(scheme_name) \
		-destination "platform=iOS Simulator,name=iPhone 11,OS=${destination}" \
		$(xcpretty)
