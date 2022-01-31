archive_path = PolyPod.xcarchive
project_path = PolyPodApp/PolyPod.xcodeproj
scheme_name = PolyPod
export_options_plist = exportOptions.plist
destination = 15.2

lockxcodeversion:
	sudo xcode-select -switch /Applications/Xcode_13.2.1.app

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

upload:
	xcodebuild \
		-exportArchive \
		-archivePath $(archive_path) \
		-exportOptionsPlist exportOptions.plist \
		-allowProvisioningUpdates
