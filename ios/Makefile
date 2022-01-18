archive_path = ./build/PolyPod.xcarchive
ipa_path = ./build/PolyPod.ipa
project_path = PolyPodApp/PolyPod.xcodeproj
scheme_name = PolyPod
export_options_plist = exportOptions.plist
destination = 14.4

# Github secrets
DISTRIBUTION_CERTIFICATE = $POLYPOD_APPLE_IOS_DISTRIBUTION_CERTIFICATE
DISTRIBUTION_CERTIFICATE_PWD = $POLYPOD_APPLE_IOS_DISTRIBUTION_CERTIFICATE_PWD
DISTRIBUTION_PROVISIONING_PROFILE = $POLYPOD_APPLE_IOS_DISTRIBUTION_PROVISIONING_PROFILE
APPSTORE_CONNECT_API_KEY = $POLYPOD_APPLE_APP_STORE_CONNECT_API_KEY
APPSTORE_API_KEY_ID = $POLYPOD_APPLE_IOS_APPSTORE_API_KEY_ID
APPSTORE_API_ISSUER_ID = $POLYPOD_APPLE_IOS_APPSTORE_API_ISSUER_ID

build:
	xcodebuild clean build \
		-project $(project_path) \
		-scheme $(scheme_name)

test:
	xcodebuild clean test \
		-project $(project_path) \
		-scheme $(scheme_name) \
		-destination "platform=iOS Simulator,name=iPhone 11,OS=${destination}"

archive:
	rm -rf $(archive_path)
	xcodebuild clean archive \
		-project $(project_path) \
		-scheme $(scheme_name) \
		-archivePath $(archive_path)

export_ipa:
	xcodebuild \
		-exportArchive \
		-archivePath $(archive_path) \
		-exportPath ./build \
		-exportOptionsPlist exportOptions.plist \
		-allowProvisioningUpdates

upload_ipa:
	# Validte the app before uploading, to catch any possible issues.
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

install_distribution_prerequisits:
	# 1. Install Distribution certificate. xcodebuild will automatically extract the app certificate from the keychain.
	@echo $(value DISTRIBUTION_CERTIFICATE) | base64 --decode > Certificate.p12
	security create-keychain -p "" build.keychain
	security import Certificate.p12 -t agg -k ~/Library/Keychains/build.keychain -P $(value DISTRIBUTION_CERTIFICATE_PWD) -A
	security list-keychains -s ~/Library/Keychains/build.keychain
	security default-keychain -s ~/Library/Keychains/build.keychain
	security unlock-keychain -p "" ~/Library/Keychains/build.keychain
	security set-key-partition-list -S apple-tool:,apple: -s -k "" ~/Library/Keychains/build.keychain

	# 2. Install Distribution provisioning profile. xcodebuild will automatically extract the prfile from Provisioning Profiles directory
	mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
	@echo $(value DISTRIBUTION_PROVISIONING_PROFILE) | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/cooppolypolypolypod__iOS_App_Store_Distribution.mobileprovision

	# 3. App Store Connect API Key. altool will automtically use the private key from private_keys folder. 
	mkdir -p ~/private_keys
	@echo $(value APPSTORE_CONNECT_API_KEY) | base64 --decode > ~/private_keys/AuthKey_$(value APPSTORE_API_KEY_ID).p8
