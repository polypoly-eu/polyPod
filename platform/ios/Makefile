archive_path = ./build/PolyPod.xcarchive
ipa_path = ./build/PolyPod.ipa
project_path = PolyPodApp/PolyPod.xcodeproj
scheme_name = PolyPod
export_options_plist = exportOptions.plist
destination = 15.2
appstore_api_key_id = $(POLYPOD_APPLE_IOS_APPSTORE_API_KEY_ID)
appstore_api_issuer_id = $(POLYPOD_APPLE_IOS_APPSTORE_API_ISSUER_ID)
provisioning_profile_dir := ~/Library/MobileDevice/Provisioning\ Profiles
provisioning_profile_file := cooppolypolypolypod__iOS_App_Store_Distribution.mobileprovision

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

.PHONY: archive
archive:
	rm -rf $(archive_path)
	$(xcodebuild) clean archive \
		-project $(project_path) \
		-scheme $(scheme_name) \
		-archivePath $(archive_path) \
		$(xcpretty)

.PHONY: export_ipa
export_ipa: archive
	$(xcodebuild) \
		-exportArchive \
		-archivePath $(archive_path) \
		-exportPath ./build \
		-exportOptionsPlist $(export_options_plist) \
		$(xcpretty)

.PHONY: upload_ipa
upload_ipa: export_ipa
	# Validate the app before uploading, to catch any possible issues.
	xcrun altool --validate-app \
		-f $(ipa_path) \
		-t ios \
		--apiKey $(appstore_api_key_id) \
		--apiIssuer $(appstore_api_issuer_id)

	xcrun altool --upload-app \
		-f $(ipa_path) \
		-t ios \
		--apiKey $(appstore_api_key_id) \
		--apiIssuer $(appstore_api_issuer_id)

.PHONY: install_distribution_prerequisites
install_distribution_prerequisites:
	# 1. Install Distribution certificate. xcodebuild will automatically
	#    extract the app certificate from the keychain.
	@printf "$$POLYPOD_APPLE_IOS_APPSTORE_P12_FILE_BASE64" \
		| base64 --decode > Certificate.p12
	security create-keychain -p "" build.keychain
	security import Certificate.p12 \
		-t agg -k ~/Library/Keychains/build.keychain \
		-P $(POLYPOD_APPLE_IOS_APPSTORE_P12_PASS) -A
	security list-keychains -s ~/Library/Keychains/build.keychain
	security default-keychain -s ~/Library/Keychains/build.keychain
	security unlock-keychain -p "" ~/Library/Keychains/build.keychain
	security set-key-partition-list -S apple-tool:,apple: -s -k "" \
		~/Library/Keychains/build.keychain

	# 2. Install Distribution provisioning profile. xcodebuild will
	#    automatically extract the profile from the Provisioning Profiles
	#    directory
	mkdir -p $(provisioning_profile_dir)
	@printf "$$POLYPOD_APPLE_IOS_APPSTORE_PROVISION_PROFILE_BASE64" \
		| base64 --decode > \
		$(provisioning_profile_dir)/$(provisioning_profile_file)

	# 3. App Store Connect API Key. altool will automatically use the private
	#    key from the private_keys folder.
	mkdir -p ~/private_keys
	@printf "$$POLYPOD_APPLE_IOS_APPSTORE_API_PRIVATE_KEY_BASE64" \
		| base64 --decode > ~/private_keys/AuthKey_$(appstore_api_key_id).p8
