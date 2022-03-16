FLATBUFFER_MODELS := $(shell find -P flatbuffer_models -name "*.fbs" )
FLATBUFFERS_VERSION = v2.0.0

flatbuffers:
	git clone --branch $(FLATBUFFERS_VERSION) https://github.com/google/flatbuffers.git

flatbuffers/flatc: flatbuffers
	cd flatbuffers; \
		cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release
	$(MAKE) -C flatbuffers flatc/fast

.PHONY := generate_flatbuffers
generate_flatbuffers: flatbuffers/flatc
	rm -rf ./src/flatbuffers_generated
	mkdir ./src/flatbuffers_generated/

	@$(foreach flatbuffer, $(FLATBUFFER_MODELS),  $(call generate_flatbuffer,$(flatbuffer));)

define generate_flatbuffer
	./flatbuffers/flatc --rust -o ./src/flatbuffers_generated --include-prefix flatbuffers_generated $(1)
	# Generate import from `./flatbuffer_models/flatbuffer_name.fbs`.
	echo "pub mod $(basename $(notdir $1))_generated;" >> ./src/flatbuffers_generated/mod.rs
endef

