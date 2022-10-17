import React from "react";

import { BubbleCluster } from "@polypoly-eu/poly-look";
import { RootAnalysis, jsonDataEntities } from "@polypoly-eu/poly-analysis";
import { json } from "d3";

export default class JsonFilesBubblesAnalysis extends RootAnalysis {
    get title() {
        return "Files Bubbles";
    }

    async _contentLinesForEntry(jsonEntry) {
        const fileContent = new TextDecoder("utf-8").decode(
            await jsonEntry.getContent()
        );
        const linesCount = fileContent
            .split("\n")
            .reduce(
                (linesCount, line) =>
                    linesCount + (line.trim().length >= 2 ? 1 : 0),
                0
            );
        return { zipEntry: jsonEntry, count: linesCount };
    }

    async analyze({ zipFile, dataAccount }) {
        this._advertisersCount = {};
        this.active = false;
        if (!zipFile) return;

        this._importedFileNames = dataAccount.importedFileNames;
        const relevantEntries = await jsonDataEntities(zipFile);
        this._filesMessagesCount = await Promise.all(
            relevantEntries.map((jsonEntry) =>
                this._contentLinesForEntry(jsonEntry)
            )
        );
        this.active = true;
    }

    renderSummary() {
        return (
            <BubbleCluster
                data={this._filesMessagesCount}
                width={400}
                height={400}
                bubbleColor={(d) => {
                    const importedFileIndex = this._importedFileNames.findIndex(
                        (fileName) => {
                            return d.data.zipEntry.endsWith(fileName);
                        }
                    );
                    return importedFileIndex > -1 ? "#fb8a89" : "#808080";
                }}
                textColor="#0f1938"
            />
        );
    }
}
