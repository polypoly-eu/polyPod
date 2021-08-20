import { jsonDataEntities } from "./../analysis-util.js";

class JsonFilesBubblesAnalysis {
    get title() {
        return "Files Bubbles";
    }

    get id() {
        return "files-bubbles";
    }

    async _contentLinesForEntry(id, zipFile, jsonEntry) {
        const fileContent = new TextDecoder("utf-8").decode(
            await zipFile.getContent(`${id}/${jsonEntry}`)
        );
        const linesCount = fileContent
            .split("\n")
            .reduce(
                (linesCount, line) =>
                    linesCount + (line.trim().length >= 2 ? 1 : 0),
                0
            );
        return { zipFile, linesCount };
    }

    async parse({ id, zipFile }) {
        this._advertisersCount = {};
        this.active = false;
        if (!zipFile) return;

        const relevantEntries = await jsonDataEntities(id, zipFile);
        this._filesMessagesCount = await Promise.all(
            relevantEntries.map((jsonEntry) =>
                this._contentLinesForEntry(id, zipFile, jsonEntry)
            )
        );
        this.active = true;
    }

    render() {
        if (!this.active) {
            return "No Data!";
        }
        return `There are ${this._advertisersCount} advertisers whose ads you've clicked on Facebook`;
    }
}

export default JsonFilesBubblesAnalysis;
