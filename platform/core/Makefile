.DEFAULT_GOAL := all

build_type := $(if $(filter $(MODE), release),release,debug)
cargo_build_flag := $(if $(filter $(build_type), release), --release)
target := target/$(build_type)

# Flatbuffer tools
flatbuffers_version := v2.0.0
flatbuffers_repo := https://github.com/google/flatbuffers
flatbuffers_releases := $(flatbuffers_repo)/releases/download/$(flatbuffers_version)
flatbuffers := flatbuffers_shared/flatbuffers_$(flatbuffers_version)
flatc_dir := flatbuffers_shared/flatc_$(flatbuffers_version)
flatc := $(flatc_dir)/flatc
flatc_archive := $(flatc_dir)/flatc.zip

# Flatbuffer models
flatbuffer_models_dir := flatbuffers_shared/flatbuffer_models
flatbuffer_models := $(shell find $(flatbuffer_models_dir) -name '*.fbs')
rust_flatbuffers_dir := src/flatbuffers_generated
rust_flatbuffer_models := $(patsubst $(flatbuffer_models_dir)/%, $(rust_flatbuffers_dir)/%, $(flatbuffer_models:.fbs=.rs))
rust_flatbuffers_generated_lib := $(rust_flatbuffers_dir)/mod.rs
swift_flatbuffers_dir := PolyPodCoreSwift/Sources/PolyPodCoreSwift/FlatbuffersGenerated
swift_flatbuffer_models := $(patsubst $(flatbuffer_models_dir)/%, $(swift_flatbuffers_dir)/%, $(flatbuffer_models:.fbs=.swift))
kotlin_flatbuffer_models_dir := PolyPodCoreAndroid/core/src/main/java/coop/polypoly/core/flatbuffersGenerated
kotlin_flatbuffer_models := $(patsubst $(flatbuffer_models_dir)/%, $(kotlin_flatbuffer_models_dir)/%, $(flatbuffer_models:.fbs=.kt))

# iOS export
export_dir_ios := export/ios
swift_core := PolyPodCoreSwift
swift_core_framework := $(swift_core)/PolyPodCore.xcframework
ios_archs := aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ios_targets := iPhone simulator

# Android export
android_version := 24
# Rust still uses old-ish r22 version of NDK.
# For reference https://github.com/rust-lang/rust/pull/85806
ndk_version := r22b
google_repo := https://dl.google.com/android/repository
ndk_lib := android-ndk-$(ndk_version)
export_dir_android := export/android
ndk=$(export_dir_android)/NDK_$(ndk_version)
ndk_archive = $(export_dir_android)/NDK.zip
java_flatbuffers_package := com/google/flatbuffers
java_flatbuffers_lib_source_path := $(flatbuffers)/java/$(java_flatbuffers_package)
android_flatbuffers_lib := PolyPodCoreAndroid/core/src/main/java/$(java_flatbuffers_package)
android_triples := aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
android_binaries := $(patsubst %, target/%, $(android_triples))
android_architectures := arm64-v8a armeabi-v7a x86_64 x86

export NDK_HOME=$(ndk)/$(ndk_lib)

ifeq ($(OS),Windows_NT)
	flatc_download_url = $(flatbuffers_releases)/Windows.flatc.binary.zip
	flatc := $(flatc_dir)/flatc.exe

	ndk_download_url = $(google_repo)/$(ndk_lib)-windows-x86_64.zip
	# Need on Windows, to allow interpreting escaping characters
	os_echo := echo -e
else
	flatc := $(flatc_dir)/flatc
	os_echo := echo
	ifeq ($(shell uname -s),Darwin)
		flatc_download_url = $(flatbuffers_releases)/Mac.flatc.binary.zip
		ndk_download_url = $(google_repo)/$(ndk_lib)-darwin-x86_64.zip
		macos := true
	endif
	ifeq ($(shell uname -s),Linux)
		flatc_download_url = $(flatbuffers_releases)/Linux.flatc.binary.clang++-9.zip
		ndk_download_url = $(google_repo)/$(ndk_lib)-linux-x86_64.zip
	endif
endif

# Java libraries
$(ndk):
	mkdir -p $(ndk)
	curl -L $(ndk_download_url) -o $(ndk_archive)
	unzip -d $(ndk) $(ndk_archive)
	rm $(ndk_archive)

$(android_flatbuffers_lib): $(flatbuffers)
	mkdir -p $(android_flatbuffers_lib)
	cp -a $(java_flatbuffers_lib_source_path)/. $(android_flatbuffers_lib)

$(android_binaries): $(target) $(ndk) $(kotlin_flatbuffer_models) $(android_flatbuffers_lib)
	#cargo install cargo-ndk
	#rustup target add $(android_triples)
	
	$(foreach tripple, $(android_triples), \
		cargo ndk --platform $(android_version) --target $(tripple) build $(cargo_build_flag); \
	)

android: $(android_binaries)

# Flatbuffers
$(flatbuffers):
	git clone --branch $(flatbuffers_version) $(flatbuffers_repo) $(flatbuffers)

$(flatc):
	mkdir -p $(flatc_dir)
	curl -L $(flatc_download_url) -o $(flatc_archive)
	unzip -d $(flatc_dir) $(flatc_archive)
	rm $(flatc_archive)
	chmod +x $(flatc)

$(rust_flatbuffers_dir)/%.rs: $(flatbuffer_models_dir)/%.fbs
	./$(flatc) --rust -o $(rust_flatbuffers_dir) --filename-suffix "" --include-prefix flatbuffers_generated $^

$(swift_flatbuffers_dir)/%.swift: $(flatbuffer_models_dir)/%.fbs
	./$(flatc) --swift -o $(swift_flatbuffers_dir) --filename-suffix "" $^

$(kotlin_flatbuffer_models_dir)/%.kt: $(flatbuffer_models_dir)/%.fbs
	./$(flatc) --kotlin -o $(kotlin_flatbuffer_models_dir) --filename-suffix "" $^

$(rust_flatbuffers_generated_lib): $(rust_flatbuffer_models)
	$(os_echo) $(foreach model, $^, \
		"pub mod $(basename $(notdir $(model))); \n") > $(rust_flatbuffers_generated_lib)

# Rust core build
$(target): $(flatc) $(flatbuffers) $(rust_flatbuffers_generated_lib)
	# Check rustup is installed
	if ! hash rustup &> /dev/null; then echo "Rust not installed, check https://www.rust-lang.org/tools/install to install rust on your system"; exit 1; fi
	cargo build $(cargo_build_flag)

# Swift framework

$(swift_core_framework): $(target) $(swift_flatbuffer_models)
# Ensure correct OS is used
ifeq ($(macos),)
	@$(os_echo) "xcframework can only be built on macOS"
	exit 1
endif

	# Workspace setup
	rm -rf $(export_dir_ios)
	mkdir -p $(export_dir_ios)/iPhone
	mkdir -p $(export_dir_ios)/simulator

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
	@$(os_echo) "module PolyPodCore { header \"polypod-core.h\" export * }" >> $(export_dir_ios)/headers/module.modulemap

	# Package xcframework
	rm -rf $(swift_core_framework)
	xcodebuild -create-xcframework \
	    $(foreach target, $(ios_targets), \
			-library $(export_dir_ios)/$(target)/libpolypod_core.a \
			-headers $(export_dir_ios)/headers) \
		-output $(swift_core_framework)

define build_for_architecture
	rustup target add $(1)
	cargo build \
		$(cargo_build_flag) \
		--lib --target $(1)
endef

.PHONY: rust-core
rust-core: $(target)

.PHONY: all
all: $(if $(macos),$(swift_core_framework),$(target))

.PHONY: clean
clean:
	$(RM) -r flatbuffers_shared/flat{c_$(flatbuffers_version),buffers_$(flatbuffers_version)}
	$(RM) -r src/flatbuffers_generated
	$(RM) -r target
	$(RM) -r export
	$(RM) -r $(swift_core_framework)
	$(RM) -r $(swift_core)/{.swiftpm,FlatbuffersGenerated}
	$(RM) -r $(android_flatbuffers_lib_copy_path)
