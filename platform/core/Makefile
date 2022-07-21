.DEFAULT_GOAL := all

build_type := $(if $(filter $(MODE), release),release,debug)
cargo_build_flag := $(if $(filter $(build_type), release), --release)
target := target/$(build_type)

# iOS export
export_dir_ios := export/ios
swift_core := PolyPodCoreSwift
swift_core_framework := $(swift_core)/PolyPodCore.xcframework
ios_archs := aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ios_targets := iPhone simulator

# Android export
tools_dir := tools
android_core := PolyPodCoreAndroid/core/src/main/
android_version := 24
google_repo := https://dl.google.com/android/repository
android_triples := aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
android_binaries := $(patsubst %, target/%, $(android_triples))
android_architectures := arm64-v8a armeabi-v7a x86_64 x86
jni_libs_copy_path := $(android_core)/jniLibs
android_core_libraries := $(patsubst %, $(jni_libs_copy_path)/%, $(android_architectures))
# Need for libgcc.a link
wflags += -L$(CURDIR)/ndk_env

ifeq ($(OS),Windows_NT)
	ndk_download_url = $(google_repo)/$(ndk_lib)-windows-x86_64.zip
	# Need on Windows, to allow interpreting escaping characters
	os_echo := echo -e
else
	os_echo := echo
	ifeq ($(shell uname -s),Darwin)
		ndk_download_url = $(google_repo)/$(ndk_lib)-darwin-x86_64.zip
		macos := true
	endif
	ifeq ($(shell uname -s),Linux)
		ndk_download_url = $(google_repo)/$(ndk_lib)-linux-x86_64.zip
	endif
endif


# ============  Rust core ============ #

$(target):
# Check rustup is installed
ifeq (,$(shell which rustup))
	$(error "Rust not installed, check https://www.rust-lang.org/tools/install to install rust on your system")
endif
	cargo build $(cargo_build_flag)

# ============  Swift framework ============ #

$(swift_core_framework): $(target)
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

# ============ Android lib ============ #

$(android_binaries): $(target)
	cargo install cargo-ndk
	rustup target add $(android_triples)

	$(foreach triple, $(android_triples), \
		cargo ndk --platform $(android_version) --target $(triple) build $(cargo_build_flag); \
	)

$(android_core_libraries): $(android_binaries)
	$(call pairmap, copy_android_arch, $(android_triples), $(android_architectures))

define copy_android_arch
   mkdir -p $(jni_libs_copy_path)/$2
   cp target/$1/$(build_type)/libpolypod_core.so \
	  $(jni_libs_copy_path)/$2/libpolypod_core.so;
endef

# ============ Main targets ============ #

.PHONY: rust_core
rust_core: $(target)

.PHONY: android_bindings
android_bindings: $(android_core_libraries)

.PHONY: ios_bindings
ios_bindings: $(swift_core_framework)

.PHONY: all
all: $(android_core_libraries) $(if $(macos),$(swift_core_framework),$(target))

.PHONY: clean
clean:
	$(RM) -r target
	$(RM) -r export
	$(RM) -r $(swift_core_framework)
	$(RM) -r $(android_core_libraries)

# ============  Utils ============ #

# A way to zip two lists, ref: https://riptutorial.com/makefile/example/23643/zipping-lists
list-rem = $(wordlist 2,$(words $1),$1)
pairmap = $(and $(strip $2),$(strip $3),$(call \
    $1,$(firstword $2),$(firstword $3)) $(call \
    pairmap,$1,$(call list-rem,$2),$(call list-rem,$3)))
