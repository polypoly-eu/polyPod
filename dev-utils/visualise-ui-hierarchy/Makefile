CWD := $(shell pwd)
POLYPOD_FEATURES_PATH := $(CWD)/../../features
RCH := node $(CWD)/react-component-hierarchy/bin/rch.js -e

.PHONY: all
all: polyExplorer.svg facebookImport.svg

.PHONY: rebuild
rebuild: clean-files all

%.svg: %.dot
	fdp -T svg -o $@ $<

.INTERMEDIATE: %.dot
%.dot: %.txt
	./tree2dot < $< > $@

.INTERMEDIATE: polyExplorer.txt
polyExplorer.txt: ensure-rch
	cd $(POLYPOD_FEATURES_PATH)/polyExplorer; \
		$(RCH) src/polyExplorer.jsx > $@; \
		mv $@ $(CWD)

.INTERMEDIATE: facebookImport.txt
facebookImport.txt: ensure-rch
	cd $(POLYPOD_FEATURES_PATH)/facebookImport; \
		$(RCH) src/facebookImporter.jsx > $@; \
		mv $@ $(CWD)

.PHONY: ensure-rch
ensure-rch: react-component-hierarchy
	cd react-component-hierarchy; git pull --rebase; yarn install

react-component-hierarchy:
	git clone https://github.com/fhd/react-component-hierarchy

.PHONY: clean
clean: clean-files clean-deps

.PHONY: clean-files
clean-files:
	$(RM) *.txt *.dot *.svg

.PHONY: clean-deps
clean-deps:
	$(RM) -r react-component-hierarchy
