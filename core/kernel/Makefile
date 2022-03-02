FLATBUFFERS := $(shell find -P flatbuffers -name "*.fbs" )

generate_flatbuffers:
	# Check flatc is installed
	if ! hash flatc &> /dev/null; then echo "flatbuffers not installed"; exit 1; fi

	$(foreach flatbuffer, $(FLATBUFFERS),  $(call generate_flatbuffer,$(flatbuffer));)

define generate_flatbuffer
	flatc --rust -o ./src/flatbuffers_generated --include-prefix flatbuffers_generated $(1)
endef
