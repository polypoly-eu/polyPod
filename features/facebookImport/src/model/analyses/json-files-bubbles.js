import React from "react";

import DataBubblesAll from "../../components/dataViz/dataBubblesAll.jsx";
import { jsonDataEntities } from "../../importer/importer-util.js";
import RootAnalysis from "./root-analysis.js";

export default class JsonFilesBubblesAnalysis extends RootAnalysis {
    get title() {
        return "Files Bubbles";
    }

    async _contentLinesForEntry(zipFile, jsonEntry) {
        const fileContent = new TextDecoder("utf-8").decode(
            await zipFile.getContent(jsonEntry)
        );
        const linesCount = fileContent
            .split("\n")
            .reduce(
                (linesCount, line) =>
                    linesCount + (line.trim().length >= 2 ? 1 : 0),
                0
            );
        return { zipFile, zipEntry: jsonEntry, count: linesCount };
    }

    async analyze({ zipFile, facebookAccount }) {
        this._advertisersCount = {};
        this.active = false;
        if (!zipFile) return;

        this._importedFileNames = facebookAccount.importedFileNames;
        const relevantEntries = await jsonDataEntities(zipFile);
        this._filesMessagesCount = await Promise.all(
            relevantEntries.map((jsonEntry) =>
                this._contentLinesForEntry(zipFile, jsonEntry)
            )
        );
        this.active = true;
    }

    render() {
        if (!this.active) {
            return "No Data!";
        }
        return (
            <DataBubblesAll
                data={this._filesMessagesCount}
                width={400}
                height={400}
                bubbleColor={(d) => {
                    const importedFileIndex = this._importedFileNames.findIndex(
                        (fileName) => {
                            return d.data.zipEntry.endsWith(fileName);
                        }
                    );
                    return importedFileIndex > -1 ? "#eb0000" : "#808080";
                }}
                textColor="black"
            />
        );
    }
}
