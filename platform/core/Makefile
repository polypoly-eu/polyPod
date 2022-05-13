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
rust_flatbuffer_models = $(patsubst $(flatbuffer_models_dir)/%, $(rust_flatbuffers_dir)/%, $(flatbuffer_models:.fbs=.rs))
rust_flatbuffers_generated_lib := $(rust_flatbuffers_dir)/mod.rs
swift_flatbuffers_dir := PolyPodCoreSwift/Sources/PolyPodCoreSwift/FlatbuffersGenerated
swift_flatbuffer_models = $(patsubst $(flatbuffer_models_dir)/%, $(swift_flatbuffers_dir)/%, $(flatbuffer_models:.fbs=.swift))

ifeq ($(OS),Windows_NT)
	flatc_download_url = $(flatbuffers_releases)/Windows.flatc.binary.zip
	flatc := $(flatc_dir)/flatc.exe
	# Need on Windows, to allow interpreting escaping characters
	os_echo := echo -e
else
	flatc := $(flatc_dir)/flatc
	os_echo := echo
	ifeq ($(shell uname -s),Darwin)
		flatc_download_url = $(flatbuffers_releases)/Mac.flatc.binary.zip
		macos := true
	endif
	ifeq ($(shell uname -s),Linux)
		flatc_download_url = $(flatbuffers_releases)/Linux.flatc.binary.clang++-9.zip
	endif
endif

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

$(rust_flatbuffers_generated_lib): $(rust_flatbuffer_models)
	$(os_echo) $(foreach model, $^, \
		"pub mod $(basename $(notdir $(model))); \n") > $(rust_flatbuffers_generated_lib)

$(target): $(flatc) $(flatbuffers) $(rust_flatbuffers_generated_lib)
        # Check rustup is installed
	if [ -z "$(which rustup)"]; then echo "Rust not installed, check https://www.rust-lang.org/tools/install to install rust on your system"; exit 1; fi
	cargo build $(cargo_build_flag)

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
