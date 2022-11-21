.DEFAULT_GOAL := all

plantuml_url := https://github.com/plantuml/plantuml/releases/download/v1.2022.8/plantuml-1.2022.8.jar
plantuml_file := plantuml.jar

%.png: %.puml $(plantuml_file)
	java -jar $(plantuml_file) $<

plantuml.jar:
	curl -L -o $(plantuml_file) $(plantuml_url)

.PHONY: all
all: architecture.png

.PHONY: clean
clean:
	$(RM) *.png $(plantuml_file)
