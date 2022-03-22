export_dir_ios = export/ios
# Supported architectures
ios_archs := aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
ios_targets := iPhone simulator
build_dir := Core/build
rust_core_dir := ../core

build_ios_xcframework:
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
	if ! hash rustup &> /dev/null; then echo "To add Rust in your local envirnonment execute: curl https://sh.rustup.rs -sSf | sh"; exit 1; fi

	# Build library for all architectures
	$(foreach arch, $(ios_archs),  $(call build_for_architecture,$(arch));)
	
	cp target/aarch64-apple-ios/release/libpolypod_core.a $(export_dir_ios)/iPhone/libpolypod_core.a
	# Combine libraries in one for the somulator
	lipo -create \
		target/x86_64-apple-ios/release/libpolypod_core.a \
		target/aarch64-apple-ios-sim/release/libpolypod_core.a \
		-output $(export_dir_ios)/simulator/libpolypod_core.a


	# Generated module map and header
	cargo install cbindgen
	cbindgen --config cbindgen.toml -o $(export_dir_ios)/headers/polypod-core.h
	@echo "module PolyPodCore { header "polypod-core.h" export * }" >> $(export_dir_ios)/headers/module.modulemap

	# Release artefact to be integrated in iOS app
	xcodebuild -create-xcframework \
	    $(foreach target, $(ios_targets),  -library $(export_dir_ios)/$(target)/libpolypod_core.a -headers $(export_dir_ios)/headers) \
		-output $(export_dir_ios)/PolyPodCore.xcframework

define build_for_architecture
	rustup target add $(1)
	cargo build --release --target $(1)
endef


