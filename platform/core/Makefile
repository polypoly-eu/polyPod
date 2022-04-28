.DEFAULT_GOAL := all

export_dir_ios := export/ios
swift_core := PolyPodCoreSwift
swift_core_framework := $(swift_core)/PolyPodCore.xcframework
ios_archs := aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ios_targets := iPhone simulator
android_version := 24
# Rust still uses old-ish r22 version of NDK.
# For reference https://github.com/rust-lang/rust/pull/85806
ndk_version := r22b
build_type := $(if $(filter $(MODE), release),release,debug)

ifneq ($(OS),Windows_NT)
	ifeq ($(shell uname -s),Darwin)
		macos := true
	endif
endif

.PHONY: flatbuffers
flatbuffers:
	./flatbuffers_shared/setup_flatbuffers.sh
	./flatbuffers_shared/generate_flatbuffers.sh

target: flatbuffers
	cargo build

$(swift_core_framework): target
# Ensure correct OS is used
ifeq ($(macos),)
	@echo "xcframework can only be built on macOS"
	exit 1
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
	rm -rf $(swift_core_framework)
	xcodebuild -create-xcframework \
	    $(foreach target, $(ios_targets), \
			-library $(export_dir_ios)/$(target)/libpolypod_core.a \
			-headers $(export_dir_ios)/headers) \
		-output $(swift_core_framework)

define build_for_architecture
	rustup target add $(1)
	cargo build \
		$(if $(filter $(build_type), release), --release) \
		--lib --target $(1)
endef

.PHONY: android_libraries
android_libraries: flatbuffers
	./build_for_android.sh \
		--android_version $(android_version) \
		--ndk_version $(ndk_version) \
		--build_type $(build_type)

.PHONY: all
all: $(if $(macos),$(swift_core_framework),target)

.PHONY: clean
clean:
	$(RM) -r flatbuffers_shared/flat{c,buffers}
	$(RM) -r src/flatbuffers_generated
	$(RM) -r target
	$(RM) -r export
	$(RM) -r $(swift_core_framework)
	$(RM) -r $(swift_core)/{.swiftpm,FlatbuffersGenerated}
