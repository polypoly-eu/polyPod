build_type := $(if $(filter $(MODE), release),release,debug)
release_flag := $(if $(filter $(MODE), release),--release)
OS_NAME :=
ifeq ($(OS),Windows_NT)
	OS_NAME = windows
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OS_NAME = linux
	endif
	ifeq ($(UNAME_S),Darwin)
		OS_NAME = darwin
	endif
endif

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
# Location where to copy the generated jni libs
jni_libs_copy_path := ./PolyPodCoreAndroid/src/main/jniLibs
# Location of the Java flatbuffer source files
flatbuffers_lib_source_path := flatbuffers_shared/flatbuffers/java
# Location where to copy the flatbuffer source files
flatbuffers_lib_copy_path := ./PolyPodCoreAndroid/src/main
libName := libpolypod_core.so
# Android target triplets for which to build the library
android_targets := aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
android_archs := arm64-v8a armeabi-v7a x86_64 x86
pairs_count := $(shell for x in {1..$(words $(android_targets))}; do echo $$x; done)

android_export := export/android
ndk_dir := $(android_export)/NDK
# Rust currently works with `r22` version, it was not updated
# to support newer NDK version. Reference https://github.com/rust-lang/rust/pull/85806
ndk_version := r22b
ndk_lib := android-ndk-$(ndk_version)
# Note - For NDK versions > r22, architecture is not needed.
# To be removed when `ndk_version` is updated.
ndk_architecture := x86_64
google_repository := https://dl.google.com/android/repository
ndk_download_link := $(google_repository)/$(ndk_lib)-$(OS_NAME)-$(ndk_architecture).zip
# Override $NDK_HOME for `cargo ndk`, so it uses the downloaded NDK instead of the default one.
export NDK_HOME = $(ndk_dir)/$(ndk_lib)

.PHONY: android_libraries
android_libraries: generate_flatbuffers
	mkdir -p $(android_export)
	# Install Android NDK if missing
	if [ ! -d $(ndk_dir)/$(ndk_lib) ]; then \
		curl -L $(ndk_download_link) \
		     -o $(ndk_dir)/NDK.zip \
		      && unzip -d $(ndk_dir) $(ndk_dir)/NDK.zip \
		      && rm $(ndk_dir)/NDK.zip; \
	fi

	# Copy Flatbuffer classes
	cp -a $(flatbuffers_lib_source_path) $(flatbuffers_lib_copy_path)

	# Build library for all targets
	rustup target add $(android_targets)
	$(foreach target, $(android_targets), $(call build_for_android_target,$(target));)

	rm -rf $(jni_libs_copy_path)
	mkdir ${jni_libs_copy_path}

	$(foreach index, $(pairs_count), $(call copy_android_lib,$(index));)

define build_for_android_target
	cargo ndk --target $(1) --platform $(android_min_ver) -- build $(release_flag)
endef

define copy_android_lib
	mkdir $(jni_libs_copy_path)/$(word $(1),$(android_archs))
	cp target/$(word $(1),$(android_targets))/$(build_type)/$(libName) \
	   $(jni_libs_copy_path)/$(word $(1),$(android_archs))/$(libName)
endef
