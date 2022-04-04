working_directory := $(shell pwd)
polypod_features_path := $(working_directory)/../../features
rch := node $(working_directory)/react-component-hierarchy/bin/rch.js -e

define run-rch
cd $(polypod_features_path)/$1; $(rch) $2 > $@; mv $@ $(working_directory)
endef

react-component-hierarchy:
	git clone https://github.com/fhd/react-component-hierarchy

.PHONY: ensure-rch
ensure-rch: react-component-hierarchy
	cd react-component-hierarchy; git pull --rebase; yarn install

.INTERMEDIATE: polyExplorer.txt
polyExplorer.txt: ensure-rch
	$(call run-rch,polyExplorer,src/polyExplorer.jsx)

.INTERMEDIATE: facebookImport.txt
facebookImport.txt: ensure-rch
	$(call run-rch,facebookImport,src/facebookImporter.jsx)

.INTERMEDIATE: %.dot
%.dot: %.txt
	./tree2dot < $< > $@

%.svg: %.dot
	fdp -T svg -o $@ $<

.PHONY: all
all: polyExplorer.svg facebookImport.svg

.PHONY: clean-files
clean-files:
	$(RM) *.txt *.dot *.svg

.PHONY: rebuild
rebuild: clean-files all

.PHONY: clean-deps
clean-deps:
	$(RM) -r react-component-hierarchy

.PHONY: clean
clean: clean-files clean-deps
