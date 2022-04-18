build_type := $(if $(filter $(MODE), release),release,debug)
release_flag := $(if $(filter $(MODE), release),--release)

.PHONY: setup_flatbuffers
setup_flatbuffers:
	./flatbuffers_shared/setup_flatbuffers.sh

.PHONY: generate_flatbuffers
generate_flatbuffers: setup_flatbuffers
	./flatbuffers_shared/generate_flatbuffers.sh

# ========= XCFramework for iOS ========= #
export_dir_ios := export/ios
swift_core := PolyPodCoreSwift
ios_archs := aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ios_targets := iPhone simulator

.PHONY: build_ios_xcframework
build_ios_xcframework: generate_flatbuffers
# Ensure correct OS is used
ifeq ($(OS),Windows_NT)
	@echo "xcframework can be built only in macOS"
	exit 1
else
ifneq ($(shell uname -s),Darwin)
	@echo "xcframework can be built only in macOS"
	exit 1
endif
endif

	# Workspace setup
	rm -rf $(export_dir_ios)
	mkdir -p $(export_dir_ios)/iPhone
	mkdir -p $(export_dir_ios)/simulator

	# Check rustup is installed
	if ! hash rustup &> /dev/null; then echo "Rust not installed, check https://www.rust-lang.org/tools/install to install rust on your system"; exit 1; fi

	# Build library for all architectures
	$(foreach arch, $(ios_archs),  $(call build_for_architecture,$(arch));)
	
	# Copy libaries to export
	cp target/aarch64-apple-ios/$(build_type)/libpolypod_core.a $(export_dir_ios)/iPhone/libpolypod_core.a
	lipo -create \
		target/x86_64-apple-ios/$(build_type)/libpolypod_core.a \
		target/aarch64-apple-ios-sim/$(build_type)/libpolypod_core.a \
		-output $(export_dir_ios)/simulator/libpolypod_core.a

	# Generated module map and C header
	cargo install cbindgen
	cbindgen --config cbindgen.toml -o $(export_dir_ios)/headers/polypod-core.h
	@echo "module PolyPodCore { header \"polypod-core.h\" export * }" >> $(export_dir_ios)/headers/module.modulemap

	# Package xcframework
	rm -rf $(swift_core)/PolyPodCore.xcframework
	xcodebuild -create-xcframework \
	    $(foreach target, $(ios_targets), -library $(export_dir_ios)/$(target)/libpolypod_core.a -headers $(export_dir_ios)/headers) \
		-output $(swift_core)/PolyPodCore.xcframework

define build_for_architecture
	rustup target add $(1)
	cargo build \
		$(release_flag) \
		--lib --target $(1)
endef

# ========= Building for Android ========= #
android_min_ver := 24
jniLibs := ./PolyPodCoreAndroid/src/main/jniLibs
flatbuffers_lib := ./PolyPodCoreAndroid/src/main
libName := libpolypod_core.so
android_targets := aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
android_archs := arm64-v8a armeabi-v7a x86_64 x86

.PHONY: build_for_android
build_for_android: generate_flatbuffers
	# Copy Flatbuffer classes
	cp -a flatbuffers_shared/flatbuffers/java $(flatbuffers_lib)

	rustup target add $(android_targets)
	# Build library for all targets
	$(foreach target, $(android_targets), $(call build_for_android_target,$(target));)

	rm -rf $(jniLibs)
	mkdir ${jniLibs}
	$(foreach arch, $(android_archs), mkdir $(jniLibs)/$(arch);)

	cp target/aarch64-linux-android/release/$(libName) $(jniLibs)/arm64-v8a/$(libName)
	cp target/armv7-linux-androideabi/release/$(libName) $(jniLibs)/armeabi-v7a/$(libName)
	cp target/i686-linux-android/release/$(libName) $(jniLibs)/x86/$(libName)
	cp target/x86_64-linux-android/release/$(libName) $(jniLibs)/x86_64/$(libName)

define build_for_android_target
	cargo ndk --target $(1) --platform $(android_min_ver) -- build $(release_flag)
endef
