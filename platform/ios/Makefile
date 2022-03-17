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

.PHONY := build
lockxcodeversion:
	sudo xcode-select -switch /Applications/Xcode_13.2.1.app

# Github secrets
DISTRIBUTION_CERTIFICATE = $POLYPOD_APPLE_IOS_APPSTORE_P12_FILE_BASE64
DISTRIBUTION_CERTIFICATE_PWD = $POLYPOD_APPLE_IOS_APPSTORE_P12_PASS
DISTRIBUTION_PROVISIONING_PROFILE = $POLYPOD_APPLE_IOS_APPSTORE_PROVISION_PROFILE_BASE64
APPSTORE_CONNECT_API_KEY = $POLYPOD_APPLE_IOS_APPSTORE_API_PRIVATE_KEY_BASE64
APPSTORE_API_KEY_ID = $POLYPOD_APPLE_IOS_APPSTORE_API_KEY_ID
APPSTORE_API_ISSUER_ID = $POLYPOD_APPLE_IOS_APPSTORE_API_ISSUER_ID

.PHONY := build
build:
	$(xcodebuild) clean build \
		-project $(project_path) \
		-scheme $(scheme_name) \
		$(xcpretty)

.PHONY := test
test:
	$(xcodebuild) clean test \
		-project $(project_path) \
		-scheme $(scheme_name) \
		-destination "platform=iOS Simulator,name=iPhone 11,OS=${destination}" \
		$(xcpretty)

.PHONY := archive
archive:
	rm -rf $(archive_path)
	$(xcodebuild) clean archive \
		-project $(project_path) \
		-scheme $(scheme_name) \
		-archivePath $(archive_path) \
		$(xcpretty)

.PHONY := export_ipa
export_ipa: archive
	$(xcodebuild) \
		-exportArchive \
		-archivePath $(archive_path) \
		-exportPath ./build \
		-exportOptionsPlist $(export_options_plist) \
		$(xcpretty)

.PHONY := upload_ipa
upload_ipa: export_ipa
	# Validate the app before uploading, to catch any possible issues.
	xcrun altool --validate-app \
		-f $(ipa_path) \
		-t ios \
		--apiKey $(value APPSTORE_API_KEY_ID) \
		--apiIssuer $(value APPSTORE_API_ISSUER_ID)

	xcrun altool --upload-app \
		-f $(ipa_path) \
		-t ios \
		--apiKey $(value APPSTORE_API_KEY_ID) \
		--apiIssuer $(value APPSTORE_API_ISSUER_ID)

.PHONY := install_distribution_prerequisites
install_distribution_prerequisites:
	# 1. Install Distribution certificate. xcodebuild will automatically extract the app certificate from the keychain.
	@echo $(value DISTRIBUTION_CERTIFICATE) | base64 --decode > Certificate.p12
	security create-keychain -p "" build.keychain
	security import Certificate.p12 -t agg -k ~/Library/Keychains/build.keychain -P $(value DISTRIBUTION_CERTIFICATE_PWD) -A
	security list-keychains -s ~/Library/Keychains/build.keychain
	security default-keychain -s ~/Library/Keychains/build.keychain
	security unlock-keychain -p "" ~/Library/Keychains/build.keychain
	security set-key-partition-list -S apple-tool:,apple: -s -k "" ~/Library/Keychains/build.keychain

	# 2. Install Distribution provisioning profile. xcodebuild will automatically extract the profile from the Provisioning Profiles directory
	mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
	@echo $(value DISTRIBUTION_PROVISIONING_PROFILE) | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/cooppolypolypolypod__iOS_App_Store_Distribution.mobileprovision

	# 3. App Store Connect API Key. altool will automatically use the private key from the private_keys folder.
	mkdir -p ~/private_keys
	@echo $(value APPSTORE_CONNECT_API_KEY) | base64 --decode > ~/private_keys/AuthKey_$(value APPSTORE_API_KEY_ID).p8
